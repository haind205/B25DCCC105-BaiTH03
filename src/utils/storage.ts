import type {
  CartItem,
  OrderRecord,
  Product,
  RegisteredUser,
  User,
} from '../types';

const USER_STORAGE_KEY = 'shopmini_user';
const USERS_STORAGE_KEY = 'shopmini_users';
const DEMO_PROFILES_KEY = 'shopmini_demo_profiles';
const CART_GUEST_KEY = 'shopmini_cart';

export const DEFAULT_DEMO_PHONE = '0987654321';
export const DEFAULT_DEMO_ADDRESS =
  'Số 122 Hoàng Quốc Việt, Cầu Giấy, Hà Nội';

export const DEMO_USERNAMES: readonly string[] = [
  'admin',
  'demo',
  'user',
  'shopmini',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getOptionalString(
  obj: Record<string, unknown>,
  key: string
): string | undefined {
  const val = obj[key];
  return typeof val === 'string' ? val : undefined;
}

function isValidProduct(value: unknown): value is Product {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.id === 'number' &&
    typeof value.title === 'string' &&
    typeof value.price === 'number' &&
    typeof value.description === 'string' &&
    typeof value.category === 'string' &&
    typeof value.image === 'string'
  );
}

function isValidCartItem(value: unknown): value is CartItem {
  if (!isRecord(value)) {
    return false;
  }
  return (
    isValidProduct(value.product) &&
    typeof value.quantity === 'number' &&
    Number.isFinite(value.quantity) &&
    value.quantity > 0
  );
}

function isValidRegisteredUser(value: unknown): value is RegisteredUser {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.fullName === 'string' &&
    typeof value.username === 'string' &&
    typeof value.password === 'string'
  );
}

function parseUserRecord(parsed: Record<string, unknown>): User | null {
  const rawUsername = parsed.username;
  if (typeof rawUsername !== 'string' || !rawUsername.trim()) {
    return null;
  }
  return {
    username: rawUsername.trim(),
    fullName: getOptionalString(parsed, 'fullName'),
    email: getOptionalString(parsed, 'email'),
    phone: getOptionalString(parsed, 'phone'),
    address: getOptionalString(parsed, 'address'),
    avatar: getOptionalString(parsed, 'avatar'),
    isDemo: typeof parsed.isDemo === 'boolean' ? parsed.isDemo : undefined,
  };
}

export function getCartStorageKey(username?: string | null): string {
  const trimmed = username?.trim();
  return trimmed ? `shopmini_cart_${trimmed}` : CART_GUEST_KEY;
}

export function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return null;
    }
    return parseUserRecord(parsed);
  } catch {
    return null;
  }
}

export function saveStoredUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch {
    // Bỏ qua lỗi quota hoặc private mode của trình duyệt
  }
}

export function loadRegisteredUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isValidRegisteredUser);
  } catch {
    return [];
  }
}

export function saveRegisteredUsers(users: RegisteredUser[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Bỏ qua lỗi quota hoặc private mode của trình duyệt
  }
}

export function loadDemoProfile(username: string): User | null {
  try {
    const raw = localStorage.getItem(DEMO_PROFILES_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return null;
    }
    const entry = parsed[username.trim().toLowerCase()];
    if (!isRecord(entry)) {
      return null;
    }
    return parseUserRecord(entry);
  } catch {
    return null;
  }
}

export function saveDemoProfile(user: User): void {
  try {
    const raw = localStorage.getItem(DEMO_PROFILES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    const map: Record<string, User> = isRecord(parsed)
      ? (parsed as Record<string, User>)
      : {};
    map[user.username.trim().toLowerCase()] = user;
    localStorage.setItem(DEMO_PROFILES_KEY, JSON.stringify(map));
  } catch {
    // Bỏ qua lỗi quota hoặc private mode của trình duyệt
  }
}

export function loadStoredCart(username?: string | null): CartItem[] {
  try {
    const raw = localStorage.getItem(getCartStorageKey(username));
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isValidCartItem);
  } catch {
    return [];
  }
}

export function saveStoredCart(
  items: CartItem[],
  username?: string | null
): void {
  try {
    localStorage.setItem(getCartStorageKey(username), JSON.stringify(items));
  } catch {
    // Bỏ qua lỗi quota hoặc private mode của trình duyệt
  }
}

export function clearStoredGuestCart(): void {
  try {
    localStorage.removeItem(CART_GUEST_KEY);
  } catch {
    // Bỏ qua lỗi storage
  }
}

export function mergeCartItems(
  baseItems: CartItem[],
  incomingItems: CartItem[]
): CartItem[] {
  const merged = baseItems.map((item) => ({ ...item }));
  for (const incoming of incomingItems) {
    const existing = merged.find(
      (item) => item.product.id === incoming.product.id
    );
    if (existing) {
      existing.quantity += incoming.quantity;
    } else {
      merged.push({ ...incoming });
    }
  }
  return merged;
}

export function loadOrderHistory(username?: string | null): OrderRecord[] {
  const trimmed = username?.trim();
  if (!trimmed) {
    return [];
  }
  try {
    const raw = localStorage.getItem(`shopmini_orders_${trimmed}`);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as OrderRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveOrderRecord(
  username: string,
  order: OrderRecord
): void {
  const trimmed = username.trim();
  if (!trimmed) {
    return;
  }
  try {
    const existing = loadOrderHistory(trimmed);
    localStorage.setItem(
      `shopmini_orders_${trimmed}`,
      JSON.stringify([order, ...existing])
    );
  } catch {
    // Bỏ qua lỗi quota hoặc private mode của trình duyệt
  }
}
