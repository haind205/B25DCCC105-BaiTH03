import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Product } from '../../types';

type FetchStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface ProductsState {
  items: Product[];
  status: FetchStatus;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      return rejectWithValue(`Lỗi máy chủ: ${response.status}`);
    }
    const data: Product[] = (await response.json()) as Product[];
    return data;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Không thể tải danh sách sản phẩm';
    return rejectWithValue(message);
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Đã xảy ra lỗi khi tải dữ liệu';
      });
  },
});

export default productsSlice.reducer;
