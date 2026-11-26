export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  username: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  isDemo?: boolean;
}

export interface RegisteredUser {
  fullName: string;
  username: string;
  password: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  customerName: string;
  phone: string;
  address: string;
}

export type Theme = 'light' | 'dark';
