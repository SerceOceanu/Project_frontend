import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Banner, CreateBanner } from '@/types/types';
import { getAuthHeaders } from '@/hooks/useAdminProducts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://145.239.30.37:3000';

export function useBaners() {
  return useQuery({
    queryKey: ['admin-baners'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/banners`, {
        cache: 'no-store',
      });
    
      if (!response.ok) {
        throw new Error(`Failed to fetch baners: ${response.status}`);
      }
    
      const data: Banner[] = await response.json();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bannerData: CreateBanner): Promise<Banner> => {
      const formData = new FormData();
      formData.append('name', bannerData.name);
      formData.append('file', bannerData.image);
      
      const headers = getAuthHeaders();
      
      const response = await fetch(`${API_URL}/banners`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create banner');
      }
      
      const data: Banner = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-baners'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const headers = getAuthHeaders();
      
      const response = await fetch(`${API_URL}/banners/${id}`, {
        method: 'DELETE',
        headers: headers,
      });
    
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Failed to delete banner');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-baners'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
}

