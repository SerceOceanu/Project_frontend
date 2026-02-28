import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BasketProduct } from '@/types/types';
import { apiRequest } from '@/lib/api-client';

interface OrderData {
  name: string;
  surname: string;
  company?: string;
  address: string;
  postalCode: string;
  locality: string;
  phone: string;
  email: string;
  isWaybillToAnotherAddress: boolean;
  billAddress?: string;
  billPostalCode?: string;
  billLocality?: string;
  deliveryType: 'pickup' | 'courier' | 'locker' | 'internal_courier';
  lockerNumber?: string;
  paymentType: 'cash' | 'payu';
  comment?: string;
  basket: BasketProduct[];
  deliveryCost: number;
}

interface OrderResponse {
  payment?: {
    redirectUri: string;
  };
  [key: string]: any;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: OrderData): Promise<OrderResponse> => {
      const payload = {
        items: orderData.basket.map(item => ({
          productId: String(item.id),
          quantity: item.quantity,
        })),
        comment: orderData.comment || '',

        customerInfo: {
          name: orderData.name,
          surname: orderData.surname,
          company: orderData.company || '',
          phone: orderData.phone,
          email: orderData.email,
        },
        deliveryInfo: {
          address: orderData.address,
          locality: orderData.locality || 'Warszawa',
          postalCode: orderData.postalCode,
          deliveryType: orderData.deliveryType,
          lockerNumber: orderData.lockerNumber || '',
          paymentType: orderData.paymentType,
          isWaybillToAnotherAddress: orderData.isWaybillToAnotherAddress,
          billAddress: orderData.billAddress || '',
          billPostalCode: orderData.billPostalCode || '',
          billLocality: orderData.billLocality || '',
        },
      };

      const result = await apiRequest<OrderResponse>('/orders', {
        method: 'POST',
        body: payload,
        requireAuth: false,
      });

      queryClient.invalidateQueries({ queryKey: ['delivery-addresses'] });
      
      return result;
    },
  });
}
