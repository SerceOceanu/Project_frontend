import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateProduct, Product } from '@/types/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://145.239.30.37:3000';

// Функция для получения токена админа
export function getAdminToken(): string | null {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin-token');
    if (token) {
      return token;
    }
  }
  
  console.warn('⚠️ No admin token found in localStorage');
  return null;
}

export function getAuthHeaders(): HeadersInit {
  const token = getAdminToken();
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔐 Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
  } else {
    console.error('❌ No token available! Please login first.');
  }
  
  return headers;
}

interface UseProductsParams {
  category?: string;
}

export function useProducts(params?: UseProductsParams) {
  const { category } = params || {};
  
  return useQuery({
    queryKey: ['admin-products', category],
    queryFn: async () => {
      const url = new URL(`${API_URL}/products`);
      if (category) {
        url.searchParams.append('category', category);
      }
      
      const response = await fetch(url.toString(), {
        cache: 'no-store',
        headers: getAuthHeaders(),
      });
    
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.error || 'Failed to fetch products');
      }
    
      const data: { items: Product[] } = await response.json();
      return data.items;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete product');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, inStock }: { id: number; inStock: boolean }): Promise<void> => {
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      };

      const response = await fetch(`${API_URL}/products/${id}/status`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ inStock }),
      });
    
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Failed to update product status');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: CreateProduct): Promise<Product> => {
      // Проверяем обязательные поля
      if (!productData.name) throw new Error('Name is required');
      if (!productData.category) throw new Error('Category is required');
      if (!productData.description) throw new Error('Description is required');
      if (productData.gramsPerServing === undefined || productData.gramsPerServing === null) throw new Error('GramsPerServing is required');
      if (productData.quantityPerServing === undefined || productData.quantityPerServing === null) throw new Error('QuantityPerServing is required');
      if (productData.price === undefined || productData.price === null) throw new Error('Price is required');
      if (!productData.file) throw new Error('File is required');
      
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('category', productData.category);
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      formData.append('gramsPerServing', productData.gramsPerServing.toString());
      formData.append('quantityPerServing', productData.quantityPerServing.toString());
      
      if (productData.label) {
        formData.append('label', productData.label);
      }
      
      formData.append('file', productData.file);

      const headers = getAuthHeaders();


      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: headers, // Отправляем Bearer токен в заголовке Authorization
        body: formData,
      });
    
      console.log('📥 Create product response status:', response.status, response.statusText);
    
      if (!response.ok) {
        let errorMessage = 'Failed to create product';
        try {
        const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
          console.error('❌ Create product error:', error);
        } catch (e) {
          const errorText = await response.text();
          console.error('❌ Create product error (text):', errorText);
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
    
      const data: Product = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, productData }: { id: number; productData: CreateProduct }): Promise<Product> => {
      // Создаем FormData для отправки файла
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('category', productData.category);
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      formData.append('gramsPerServing', productData.gramsPerServing.toString());
      formData.append('quantityPerServing', productData.quantityPerServing.toString());
      
      if (productData.enabled !== undefined) {
      formData.append('enabled', productData.enabled.toString());
      }
      
      if (productData.label) {
        formData.append('label', productData.label);
      }
      
      if (productData.file) {
        formData.append('file', productData.file);
      }

      const headers = getAuthHeaders();
      // НЕ добавляем Content-Type для FormData - браузер сам установит multipart/form-data с boundary

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: headers, // Отправляем Bearer токен в заголовке Authorization
        body: formData,
      });
    
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update product');
      }
    
      const data: Product = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
}

