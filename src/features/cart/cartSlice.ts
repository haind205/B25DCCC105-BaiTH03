import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '../../types';
import type { RootState } from '../../app/store';
import { loadStoredCart, loadStoredUser } from '../../utils/storage';

export interface CartToastItem {
  id: number;
  productTitle?: string;
  message?: string;
}

interface CartState {
  items: CartItem[];
  toasts: CartToastItem[];
}

const initialUser = loadStoredUser();

const initialState: CartState = {
  items: loadStoredCart(initialUser?.username),
  toasts: [],
};

let nextToastId = 1;

interface UpdateQuantityPayload {
  productId: number;
  quantity: number;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }

      state.toasts.push({
        id: nextToastId++,
        productTitle: action.payload.title,
      });
      if (state.toasts.length > 4) {
        state.toasts.shift();
      }
    },
    dismissToast: (state, action: PayloadAction<number>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    addToastMessage: (state, action: PayloadAction<string>) => {
      state.toasts.push({
        id: nextToastId++,
        message: action.payload,
      });
      if (state.toasts.length > 4) {
        state.toasts.shift();
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
    },
    updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter(
          (item) => item.product.id !== productId
        );
        return;
      }
      const existingItem = state.items.find(
        (item) => item.product.id === productId
      );
      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addToCart,
  dismissToast,
  addToastMessage,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartItems,
} = cartSlice.actions;

export const selectCartItems = (state: RootState): CartItem[] => state.cart.items;

export const selectCartToasts = (state: RootState): CartToastItem[] =>
  state.cart.toasts;

export const selectCartTotalQuantity = (state: RootState): number =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartTotalPrice = (state: RootState): number =>
  state.cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

export default cartSlice.reducer;
