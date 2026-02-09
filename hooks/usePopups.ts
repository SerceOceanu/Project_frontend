import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';

export interface Popup {
  id: string;
  title: string;
  description: string;
  active: boolean;
  created: string;
  updated: string;
}

export function usePopups() {
  return useQuery<Popup[]>({
    queryKey: ['popups'],
    queryFn: () => {
      return apiRequest<Popup[]>('pop-ups', { requireAuth: false });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}
