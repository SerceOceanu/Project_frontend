import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Banner, CreateBanner } from '@/types/types';
import { adminApiRequest } from '@/hooks/useAdminProducts';

export function useBaners() {
  return useQuery({
    queryKey: ['admin-baners'],
    queryFn: () => adminApiRequest<Banner[]>('/banners'),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bannerData: CreateBanner): Promise<Banner> => {
      const formData = new FormData();
      formData.append('namePL', bannerData.namePL);
      formData.append('nameUA', bannerData.nameUA);
      formData.append('bannerFilePL', bannerData.imagePL);
      formData.append('bannerFileUA', bannerData.imageUA);
      
      return adminApiRequest<Banner>('/banners', {
        method: 'POST',
        body: formData,
      });
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
    mutationFn: async (id: string): Promise<void> => {
      return adminApiRequest<void>(`/banners/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-baners'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
}

