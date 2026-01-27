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
          postalCode: orderData.postalCode,
          isCity: orderData.isCity,
          deliveryType: orderData.deliveryType,
          lockerNumber: orderData.lockerNumber || '',
          paymentType: orderData.paymentType,
          isAnotherAddress: orderData.isAnotherAddress,
        },
      };

      console.log('📦 Creating order with payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📥 Order response status:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = 'Failed to create order';
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
          console.error('❌ Order creation error:', error);
        } catch (e) {
          const errorText = await response.text();
          console.error('❌ Order creation error (text):', errorText);
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Order created successfully!');
      console.log('📋 Order details:', result.order);
      console.log('💳 Payment redirect URI:', result.payment?.redirectUri);
      return result;
    },
  });
}
