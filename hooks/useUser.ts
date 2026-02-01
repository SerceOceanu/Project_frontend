import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
}

export function useUser() {
  return useQuery<User>({
    queryKey: ['user', 'me'],
    queryFn: () => apiRequest<User>('/user/me'),
    staleTime: 1000 * 60 * 5,
  });
}
