import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';

interface DeliveryCostResponse {
  cost?: number;
  freeDelivery?: boolean;
  [key: string]: any;
}

interface UseDeliveryPriceParams {
  deliveryType: 'pickup' | 'courier' | 'locker';
}

export function useDeliveryPrice(params: UseDeliveryPriceParams) {
  const { deliveryType } = params;
  
  return useQuery<DeliveryCostResponse>({
    queryKey: ['delivery-cost', deliveryType],
    queryFn: () => {
      const endpoint = `/delivery/cost?deliveryType=${deliveryType}`;
      return apiRequest<DeliveryCostResponse>(endpoint, { requireAuth: false });
    },
    staleTime: 1000 * 60 * 5,
  });
}
