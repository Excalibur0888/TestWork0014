import { create } from 'zustand';
import { Product } from '@/types';
import { productsApi } from '@/api';

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  total: number;
  skip: number;
  limit: number;
}

interface ProductsActions {
  fetchProducts: (limit?: number, skip?: number) => Promise<void>;
  fetchProductsByCategory: (category: string, limit?: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type ProductsStore = ProductsState & ProductsActions;

export const useProductsStore = create<ProductsStore>((set) => ({
  products: [],
  isLoading: false,
  error: null,
  total: 0,
  skip: 0,
  limit: 12,

  fetchProducts: async (limit = 12, skip = 0) => {
    try {
      set({ isLoading: true, error: null });

      const response = await productsApi.getProducts(limit, skip);

      set({
        products: response.products,
        total: response.total,
        skip: response.skip,
        limit: response.limit,
        isLoading: false,
      });
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Error loading products';
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  fetchProductsByCategory: async (category: string, limit = 12) => {
    try {
      set({ isLoading: true, error: null });

      const response = await productsApi.getProductsByCategory(category, limit);

      set({
        products: response.products,
        total: response.total,
        skip: response.skip,
        limit: response.limit,
        isLoading: false,
      });
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Error loading products';
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));