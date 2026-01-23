import { useQuery } from '@tanstack/react-query';
import { Banner } from '@/types/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://145.239.30.37:3000';

export function useBanners() {
  return useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/banners`, {
        cache: 'no-store',
      });
    
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Failed to fetch banners');
      }
    
      const data: Banner[] = await response.json();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
