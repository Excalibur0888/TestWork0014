import { apiClient } from './config';
import { ProductsResponse, Product } from '@/types';

export const productsApi = {
  getProducts: async (
    limit: number = 12,
    skip: number = 0
  ): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>(
      `/products?limit=${limit}&skip=${skip}`
    );
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  getProductsByCategory: async (
    category: string,
    limit: number = 12
  ): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>(
      `/products/category/${encodeURIComponent(category)}?limit=${limit}`
    );
    return response.data;
  },
};