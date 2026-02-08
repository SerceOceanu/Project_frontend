import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BasketProduct } from '@/types/types'

interface Order {
  name: string;
  surname: string;
  company: string;
  address: string;
  postalCode: string;
  locality: string;
  isCity: boolean;
  phone: string;
  email: string;

  isWaybillToAnotherAddress: boolean;
  billAddress: string;
  billPostalCode: string;
  billLocality: string;

  deliveryType: 'pickup' | 'courier' | 'locker';
  lockerNumber?: string;
  paymentType: 'cash' | 'payu';
  comment?: string;
}
interface BasketStore {
  isBasketModalOpen: boolean
  deliveryCost: number

  basket: BasketProduct[];

  order: Order;
  setOrder: (key: keyof Order, value: boolean | string | number) => void;
  addToBasket: (product: BasketProduct) => void;
  removeFromBasket: (id: string) => void;
  clearBasket: () => void;
  changeQuantity: (id: string, quantity: number) => void;
  setValue: (key: string, value: boolean | string | number) => void
}

export const useBasketStore = create<BasketStore>()(
  persist(
    (set) => ({
  isBasketModalOpen: false,
  deliveryCost: 0,
  basket: [],
  order: {
    name: '',
    surname: '',
    company: '',
    address: '',
    postalCode: '',
    locality: 'Warszawa',
    isCity: false,
    phone: '',
    email: '',
    isWaybillToAnotherAddress: false,
    billAddress: '',
    billPostalCode: '',
    billLocality: '',
    deliveryType: 'pickup',
    lockerNumber: '',
    paymentType: 'payu',
    comment: '',
  },
  
  setOrder: (key: keyof Order, value: boolean | string | number) => set((state) => ({ order: { ...state.order, [key]: value } })),
  addToBasket: (product) => set((state) => ({ basket: [...state.basket, product] })),
  removeFromBasket: (id: string) => set((state) => ({ basket: state.basket.filter((p) => p.id !== id) })),
  changeQuantity: (id: string, quantity: number) => set((state) => ({ basket: state.basket.map((p) => p.id === id ? { ...p, quantity: quantity } : p) })),
  clearBasket: () => set({ 
    basket: [],
    order: {
      name: '',
      surname: '',
      company: '',
      address: '',
      postalCode: '',
      locality: 'Warszawa',
      isCity: false,
      phone: '',
      email: '',
      isWaybillToAnotherAddress: false,
      billAddress: '',
      billPostalCode: '',
      billLocality: '',
      deliveryType: 'pickup',
      lockerNumber: '',
      paymentType: 'payu',
      comment: '',
    },
  }),
  setValue: (key: string, value: boolean | string | number) => set({ [key]: value }),
    }),
    {
      name: 'basket-storage', // unique name for localStorage key
      partialize: (state) => ({
        basket: state.basket,
        order: state.order,
        deliveryCost: state.deliveryCost,
      }),
    }
  )
)

