import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';

export function useFavoriteProducts() {
  return useQuery<string[]>({
    queryKey: ['favorite-products'],
    queryFn: async () => {
      const response = await apiRequest<{ favoriteProductIds: string[] }>('/user/favorite-products');
      
      if (!response.favoriteProductIds || !response.favoriteProductIds.length) return [];
      return response.favoriteProductIds;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, currentFavorites }: { productId: number; currentFavorites: string[] }) => {
      const productIdString = String(productId);
      const isFavorite = currentFavorites.includes(productIdString);
      
      const newFavorites = isFavorite
        ? currentFavorites.filter(id => id !== productIdString)
        : [...currentFavorites, productIdString];

      await apiRequest('/user/favorite-products', {
        method: 'PUT',
        body: {
          favoriteProductIds: newFavorites,
        },
      });

      return newFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-products'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-products-list'] });
    },
  });
}
