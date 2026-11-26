import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import { loadStoredUser, saveStoredCart } from '../utils/storage';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
});

let previousCartItems = store.getState().cart.items;

store.subscribe(() => {
  const currentCartItems = store.getState().cart.items;
  if (currentCartItems !== previousCartItems) {
    previousCartItems = currentCartItems;
    const currentUser = loadStoredUser();
    saveStoredCart(currentCartItems, currentUser?.username);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
