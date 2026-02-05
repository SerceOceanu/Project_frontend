import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';
import { Product } from '@/types/types';

interface FavoriteProductsResponse {
  favoriteProductIds: string[];
}

interface ProductsResponse {
  items: Product[];
}

export function useFavoriteProducts() {
  return useQuery<Product[]>({
    queryKey: ['favorite-products-list'],
    queryFn: async () => {
      const favoritesData = await apiRequest<FavoriteProductsResponse>('/user/favorite-products');
      
      if (!favoritesData.favoriteProductIds || favoritesData.favoriteProductIds.length === 0) {
        return [];
      }

      const productsData = await apiRequest<ProductsResponse>('/products/in-stock/list', { requireAuth: false });
      
      const favoriteProducts = productsData.items.filter(product =>
        favoritesData.favoriteProductIds.includes(String(product.id))
      );

      return favoriteProducts;
    },
    staleTime: 1000 * 60 * 5,
  });
}
