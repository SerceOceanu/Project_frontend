import { useQuery } from '@tanstack/react-query';
import { apiRequest, isAuthenticated } from '@/lib/api-client';

interface OrderProduct {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    gramsPerServing: number;
    maxGramsPerServing?: number;
    imageUrl: string;
  };
  totalPrice: number;
}

interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'in_delivery' | 'delivered' | 'cancelled';
  userId: string;
  totalAmount: number;
  items: OrderProduct[];
  created: string;
}

interface OrdersResponse {
  items: Order[];
  metadata: {
    limit: number;
    offset: number;
    total: number;
  };
}

interface UseOrdersParams {
  limit?: number;
  offset?: number;
  status?: 'pending' | 'confirmed' | 'preparing' | 'in_delivery' | 'delivered' | 'cancelled' | 'all';
}

export function useOrders(params: UseOrdersParams = {}) {
  const { limit = 10, offset = 0, status = 'all' } = params;

  return useQuery<OrdersResponse>({
    queryKey: ['orders', limit, offset, status],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit.toString());
      queryParams.append('offset', offset.toString());
      
      if (status !== 'all') {
        queryParams.append('status', status);
      }

      const endpoint = `/orders?${queryParams.toString()}`;
      return apiRequest<OrdersResponse>(endpoint);
    },
    staleTime: 0,
    refetchOnMount: 'always', 
    refetchOnWindowFocus: true,
    enabled: isAuthenticated(),
  });
}
