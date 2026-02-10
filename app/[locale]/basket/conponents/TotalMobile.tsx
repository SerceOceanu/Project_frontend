'use client';
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useState, useMemo } from 'react'
import { useBasketStore } from '@/store/useBasketStore'
import { Checkbox } from '@/components/ui/checkbox';
import { BasketProduct } from '@/types/types';
import { useCreateOrder } from '@/hooks/useOrder';
import { toast } from 'sonner';
import { useDeliveryPrice } from '@/hooks/useDeliveryPrice';
import { calculateItemTotal, sum, add, formatCurrency } from '@/lib/currency';

interface TotalMobileProps {
  setIsSuccessModalOpen?: (open: boolean) => void;
}

export default function TotalMobile({ setIsSuccessModalOpen }: TotalMobileProps) {
  const { basket, order, clearBasket } = useBasketStore();
  const t = useTranslations();
  const [accept, setAccept] = useState(false);
  
  const total = sum(basket.map((item: BasketProduct) => calculateItemTotal(item.price, item.quantity || 1)));
  const { data: deliveryCosts, isLoading: isLoadingDelivery } = useDeliveryPrice();
  const deliveryCost = deliveryCosts ? deliveryCosts[order.deliveryType] : 0;
  const totalAmount = add(Number(total), deliveryCost || 0);
  const { mutate: createOrder, isPending } = useCreateOrder();
  
  const isValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const hasRequiredFields = 
      order.name.trim().length >= 3 &&
      order.surname.trim().length >= 3 &&
      order.address.trim().length >= 5 &&
      order.postalCode.trim().length >= 4 &&
      order.phone.trim().length >= 10 &&
      emailRegex.test(order.email.trim());
    
    const hasLockerNumber = order.deliveryType !== 'locker' || (order.lockerNumber && order.lockerNumber.trim().length > 0);
    
    return hasRequiredFields && hasLockerNumber && accept;
  }, [order, accept]);

  const handleCreateOrder = () => {
      const orderData = {
        ...order,
        locality: order.locality || 'Warszawa',
        basket,
        deliveryCost,
      };
      
      createOrder(
        orderData,
        {
          onSuccess: (data) => {
            if (order.paymentType === 'cash') {
              setIsSuccessModalOpen?.(true);
              clearBasket();
            } 
            else if (data?.payment?.redirectUri) {
              clearBasket();
              window.location.href = data.payment.redirectUri;
            }
            else {
              setIsSuccessModalOpen?.(true);
              clearBasket();
            }
          },
          onError: (error) => {
            toast.error(`Помилка: ${error.message}`);
          },
        }
      );
  };
  
  return (
    <div className='p-5 bg-white rounded-2xl md:hidden'>
      <div className='flex flex-col sm:flex-row sm:justify-between gap-4 border-b pb-4'>
        <div className='flex flex-col gap-1 text-gray'>
          <span className='rubik text-sm sm:text-base'>
            {t('delivery-form.delivery-cost')}: {
              isLoadingDelivery ? (
                <span className="text-gray-400">...</span>
              ) : deliveryCost === 0 ? (
                <span className="">{t('free')}</span>
              ) : (
                `${formatCurrency(deliveryCost)}${t('currency')}`
              )
            }
          </span>
          <span className='rubik text-sm sm:text-base'>{t('delivery-form.order-cost')}: {formatCurrency(Number(total))}{t('currency')}</span>
        </div>
        <div className='flex flex-col text-xl sm:text-2xl text-gray'>
          {t('total')}
          <span className='rubik text-[500] text-3xl sm:text-[40px] text-black '>{formatCurrency(totalAmount)}{t('currency')}</span>
        </div>
      </div>
      <div className='flex items-center gap-2 py-5'>
        <Checkbox id="accept" checked={accept} onCheckedChange={(checked) => setAccept(checked === 'indeterminate' ? false : checked)} />
        <label htmlFor="accept" className="text-sm text-gray cursor-pointer">
          {t('accept-regulations')} <span className="text-red-500">*</span>
        </label>
      </div>
      <Button 
        onClick={handleCreateOrder} 
        disabled={!isValid || isPending}
        className="bg-orange hover:bg-orange/90 w-full text-lg h-[56px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? t('basket.sending') : t('basket.button')}
      </Button>
    </div>
  )
}
