import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';

interface DeliveryCostsResponse {
  courier: number;
  locker: number;
  pickup: number;
  internal_courier: number;
}

export function useDeliveryPrice() {
  return useQuery<DeliveryCostsResponse>({
    queryKey: ['delivery-costs'],
    queryFn: () => {
      return apiRequest<DeliveryCostsResponse>('/delivery/costs', { requireAuth: false });
    },
    staleTime: 1000 * 60 * 5,
  });
}
