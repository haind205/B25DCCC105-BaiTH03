import { createContext, useContext, useState, type ReactNode } from 'react';
import type { RegisteredUser, User } from '../types';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  addToastMessage,
  selectCartItems,
  setCartItems,
} from '../features/cart/cartSlice';
import {
  DEFAULT_DEMO_ADDRESS,
  DEFAULT_DEMO_PHONE,
  DEMO_USERNAMES,
  clearStoredGuestCart,
  loadDemoProfile,
  loadRegisteredUsers,
  loadStoredCart,
  loadStoredUser,
  mergeCartItems,
  saveDemoProfile,
  saveRegisteredUsers,
  saveStoredCart,
  saveStoredUser,
} from '../utils/storage';

interface RegisterResult {
  ok: boolean;
  error?: string;
}

export interface ProfileUpdates {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface AuthContextValue {
  user: User | null;
  login: (username: string, password: string) => boolean;
  register: (
    fullName: string,
    username: string,
    password: string
  ) => RegisterResult;
  updateProfile: (updates: ProfileUpdates) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const currentCartItems = useAppSelector(selectCartItems);
  const [user, setUser] = useState<User | null>(() => loadStoredUser());

  const applyAuthenticatedUser = (nextUser: User): void => {
    saveStoredUser(nextUser);
    setUser(nextUser);

    const savedUserCart = loadStoredCart(nextUser.username);
    const mergedCart = mergeCartItems(savedUserCart, currentCartItems);
    saveStoredCart(mergedCart, nextUser.username);
    clearStoredGuestCart();
    dispatch(setCartItems(mergedCart));
  };

  const login = (username: string, password: string): boolean => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      return false;
    }

    const registeredUsers = loadRegisteredUsers();
    const matchedRegistered = registeredUsers.find(
      (acc) => acc.username.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (matchedRegistered) {
      if (matchedRegistered.password !== password) {
        return false;
      }
      applyAuthenticatedUser({
        username: matchedRegistered.username,
        fullName: matchedRegistered.fullName,
        email: matchedRegistered.email ?? '',
        phone: matchedRegistered.phone ?? '',
        address: matchedRegistered.address ?? '',
        avatar: matchedRegistered.avatar ?? '',
        isDemo: false,
      });
      return true;
    }

    if (password !== '123456') {
      return false;
    }

    const savedDemo = loadDemoProfile(trimmedUsername);
    const demoUser: User = savedDemo
      ? { ...savedDemo, isDemo: true }
      : {
          username: trimmedUsername,
          fullName: trimmedUsername,
          email: '',
          phone: DEFAULT_DEMO_PHONE,
          address: DEFAULT_DEMO_ADDRESS,
          avatar: '',
          isDemo: true,
        };

    applyAuthenticatedUser(demoUser);
    return true;
  };

  const register = (
    fullName: string,
    username: string,
    password: string
  ): RegisterResult => {
    const trimmedFullName = fullName.trim();
    const trimmedUsername = username.trim();

    if (!trimmedFullName || !trimmedUsername || !password) {
      return { ok: false, error: 'Vui lòng điền đầy đủ các trường bắt buộc.' };
    }

    if (password.length < 6) {
      return { ok: false, error: 'Mật khẩu phải có tối thiểu 6 ký tự.' };
    }

    const normalizedUsername = trimmedUsername.toLowerCase();
    const registeredUsers = loadRegisteredUsers();

    const isDemoDuplicate = DEMO_USERNAMES.includes(normalizedUsername);
    const isRegisteredDuplicate = registeredUsers.some(
      (acc) => acc.username.toLowerCase() === normalizedUsername
    );

    if (isDemoDuplicate || isRegisteredDuplicate) {
      return {
        ok: false,
        error: 'Tên đăng nhập / Email đã tồn tại. Vui lòng chọn tên khác.',
      };
    }

    const defaultEmail = trimmedUsername.includes('@') ? trimmedUsername : '';

    const newAccount: RegisteredUser = {
      fullName: trimmedFullName,
      username: trimmedUsername,
      password,
      email: defaultEmail,
      phone: '',
      address: '',
      avatar: '',
    };

    saveRegisteredUsers([...registeredUsers, newAccount]);
    applyAuthenticatedUser({
      username: newAccount.username,
      fullName: newAccount.fullName,
      email: newAccount.email,
      phone: '',
      address: '',
      avatar: '',
      isDemo: false,
    });
    dispatch(addToastMessage('Đăng ký tài khoản thành công!'));

    return { ok: true };
  };

  const updateProfile = (updates: ProfileUpdates): void => {
    if (!user) {
      return;
    }

    const updatedUser: User = {
      ...user,
      ...updates,
    };

    saveStoredUser(updatedUser);
    setUser(updatedUser);

    if (user.isDemo) {
      saveDemoProfile(updatedUser);
    } else {
      const registeredUsers = loadRegisteredUsers();
      const updatedList = registeredUsers.map((acc) => {
        if (acc.username.toLowerCase() !== user.username.toLowerCase()) {
          return acc;
        }
        return {
          ...acc,
          fullName: updatedUser.fullName ?? acc.fullName,
          email: updatedUser.email ?? acc.email,
          phone: updatedUser.phone ?? acc.phone,
          address: updatedUser.address ?? acc.address,
          avatar: updatedUser.avatar ?? acc.avatar,
        };
      });
      saveRegisteredUsers(updatedList);
    }

    dispatch(addToastMessage('Cập nhật thông tin tài khoản thành công!'));
  };

  const logout = (): void => {
    saveStoredUser(null);
    setUser(null);
    dispatch(setCartItems(loadStoredCart(null)));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, updateProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
}
