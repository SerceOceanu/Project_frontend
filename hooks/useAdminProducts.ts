import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateProduct, Product } from '@/types/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://145.239.30.37:3000';

export function getAdminToken(): string | null {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin-token');
    if (token) {
      return token;
    }
  }
  return null;
}

export function getAuthHeaders(): HeadersInit {
  const token = getAdminToken();
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

export function handleUnauthorized(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin-token');
    window.location.href = '/admin/login';
  }
}

interface AdminApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: BodyInit | object;
  headers?: HeadersInit;
  useJson?: boolean;
}

export async function adminApiRequest<T>(
  endpoint: string,
  options: AdminApiRequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, useJson = false } = options;
  
  const authHeaders = getAuthHeaders();
  const requestHeaders: Record<string, string> = {};
  
  if (authHeaders instanceof Headers) {
    authHeaders.forEach((value, key) => {
      requestHeaders[key] = value;
    });
  } else if (Array.isArray(authHeaders)) {
    authHeaders.forEach(([key, value]) => {
      requestHeaders[key] = value;
    });
  } else {
    Object.assign(requestHeaders, authHeaders);
  }
  
  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      requestHeaders[key] = value;
    });
  } else if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => {
      requestHeaders[key] = value;
    });
  } else if (headers) {
    Object.assign(requestHeaders, headers);
  }
  
  let requestBody: BodyInit | undefined = body as BodyInit;
  if (useJson && body && typeof body === 'object' && !(body instanceof FormData)) {
    requestBody = JSON.stringify(body);
    requestHeaders['Content-Type'] = 'application/json';
  } else if (body) {
    requestBody = body as BodyInit;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: requestHeaders,
    body: requestBody,
    cache: 'no-store',
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized');
    }
    
    let errorMessage = `Request failed: ${response.status} ${response.statusText}`;
    try {
      const error = await response.json();
      errorMessage = error.message || error.error || errorMessage;
    } catch (e) {
      const errorText = await response.text();
      if (errorText) {
        errorMessage = errorText;
      }
    }
    throw new Error(errorMessage);
  }
  
  if (response.status === 204 || method === 'DELETE') {
    return undefined as T;
  }
  
  return await response.json();
}

interface UseProductsParams {
  category?: string;
}

export function useProducts(params?: UseProductsParams) {
  const { category } = params || {};
  
  return useQuery({
    queryKey: ['admin-products', category],
    queryFn: async () => {
      const endpoint = category ? `/products?category=${category}` : '/products';
      const data = await adminApiRequest<{ items: Product[] }>(endpoint);
      return data.items;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      return adminApiRequest<void>(`/products/${id}`, {
        method: 'DELETE',
      });
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
      return adminApiRequest<void>(`/products/${id}/status`, {
        method: 'PATCH',
        body: { inStock },
        useJson: true,
      });
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

      return adminApiRequest<Product>('/products', {
        method: 'POST',
        body: formData,
      });
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

      return adminApiRequest<Product>(`/products/${id}`, {
        method: 'PUT',
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
}

