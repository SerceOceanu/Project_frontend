import { useMutation } from '@tanstack/react-query';
import { BasketProduct } from '@/types/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://145.239.30.37:3000';

interface OrderData {
  name: string;
  surname: string;
  company?: string;
  address: string;
  postalCode: string;
  isCity: boolean;
  phone: string;
  email: string;
  isAnotherAddress: boolean;
  deliveryType: 'pickup' | 'courier' | 'locker';
  lockerNumber?: string;
  paymentType: 'card' | 'payu' | 'blik';
  comment?: string;
  basket: BasketProduct[];
  deliveryCost: number;
}

interface OrderResponse {
  id: string;
  status: string;
  message: string;
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (orderData: OrderData): Promise<OrderResponse> => {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: orderData.basket.map(item => ({
            productId: item.id,
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
            postalCode: orderData.postalCode,
            isCity: orderData.isCity,
            deliveryType: orderData.deliveryType,
            lockerNumber: orderData.lockerNumber || '',
            paymentType: orderData.paymentType,
            deliveryCost: orderData.deliveryCost,
            isAnotherAddress: orderData.isAnotherAddress,
          },
          totalAmount: orderData.basket.reduce((acc, item) => acc + item.price * item.quantity, 0) + orderData.deliveryCost,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create order');
      }

      return await response.json();
    },
  });
}
