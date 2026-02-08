import { useQuery } from '@tanstack/react-query';
import { apiRequest, isAuthenticated } from '@/lib/api-client';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
}

export function useUser() {
  return useQuery<User | null>({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      if (!isAuthenticated()) {
        return null;
      }
      try {
        return await apiRequest<User>('/user/me');
      } catch (error) {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: isAuthenticated(), // Only fetch if user is authenticated
  });
}
