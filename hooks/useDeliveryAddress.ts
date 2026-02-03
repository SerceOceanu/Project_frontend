import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';

export interface DeliveryAddress {
  id: string;
  locality: string;
  address: string;
  postalCode: string;
  isCity: boolean;
  deliveryType: 'pickup' | 'courier' | 'locker';
  lockerNumber?: string;
}

interface DeliveryAddressesResponse {
  items: DeliveryAddress[];
  metadata: {
    limit: number;
    offset: number;
    total: number;
  };
}

export function useDeliveryAddress() {
  return useQuery<DeliveryAddress | null>({
    queryKey: ['delivery-address', 'latest'],
    queryFn: async () => {
      try {
        const response = await apiRequest<DeliveryAddress>('/orders/delivery-info/latest');
        return response;
      } catch (error: any) {
        if (error?.status === 404 || error?.message?.includes('not found')) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    retry: false,
  });
}

export function useDeliveryAddresses(params?: { limit?: number; offset?: number }) {
  const { limit = 10, offset = 0 } = params || {};

  return useQuery<DeliveryAddressesResponse>({
    queryKey: ['delivery-addresses', limit, offset],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit.toString());
      queryParams.append('offset', offset.toString());
      
      return await apiRequest<DeliveryAddressesResponse>(`/orders/delivery-info/addresses?${queryParams.toString()}`);
    },
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useDeleteDeliveryAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deliveryInfoId: string) => {
      console.log('🗑️ Deleting address:', deliveryInfoId);
      try {
        const result = await apiRequest(`/orders/delivery-info/${deliveryInfoId}`, {
          method: 'DELETE',
        });
        console.log('✅ Address deleted successfully:', result);
        return result;
      } catch (error: any) {
        console.error('❌ Error deleting address:', {
          deliveryInfoId,
          error,
          message: error?.message,
          status: error?.status,
          response: error?.response,
        });
        throw error;
      }
    },
    onSuccess: (data, deliveryInfoId) => {
      console.log('✅ Delete mutation success:', { deliveryInfoId, data });
      queryClient.invalidateQueries({ queryKey: ['delivery-address'] });
      queryClient.invalidateQueries({ queryKey: ['delivery-addresses'] });
    },
    onError: (error: any, deliveryInfoId) => {
      console.error('❌ Delete mutation error:', {
        deliveryInfoId,
        error,
        message: error?.message,
        status: error?.status,
      });
    },
  });
}
