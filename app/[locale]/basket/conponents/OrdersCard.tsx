'use client';
import NoOrders from './NoOrders'
import OrderItem from './OrderItem'  
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useState, useMemo } from 'react'
import { Link } from '@/lib/navigation'
import { useBasketStore } from '@/store/useBasketStore'
import { Checkbox } from '@/components/ui/checkbox';
import { BasketProduct } from '@/types/types';
import { useCreateOrder } from '@/hooks/useOrder';
import { toast } from 'sonner';

export default function OrdersCard({ type }: { type: 'modal' | 'page' }) {
  const { basket } = useBasketStore();
  const t = useTranslations();
  console.log(basket, 'Basket');
  const total = basket.reduce((acc, item: BasketProduct) => acc + item.price * item.quantity, 0).toFixed(2);
  console.log(total, 'Total');
  return (
    <div className='flex flex-col bg-white rounded-xl p-5 shadow-lg gap-6 '>
      {(basket.length === 0 || !basket.length) && <NoOrders />}
      {basket.length > 0 && (
        <>
        <h2 className="text-2xl font-bold w-full "> {t('basket.title')} </h2>
        <div className='flex flex-col gap-2.5 pr-[30px]'>
          {basket.map((item, index) => (
            <OrderItem key={index} product={item} />
          ))}
        </div>
        {type === 'modal' ? <TotalModal total={Number(total)} /> : <TotalPage total={Number(total)} />}
      </>)}

    </div>
  )
}

const TotalModal = ({ total }: { total: number }) => {
  const t = useTranslations();
  const { setValue } = useBasketStore();

  return (
    <div className='flex px-8 py-5 bg-light rounded-2xl items-end justify-between'>
      <div className='flex flex-col text-2xl text-gray'>
        {t('total')}
        <span className='rubik text-[500] text-[40px] text-black '>{total}{t('currency')}</span>
      </div>
      <Link href={'/basket'}>
        <Button onClick={() => setValue('isBasketModalOpen', false)} className="bg-orange hover:bg-orange/90 text-lg h-[56px]">{t('basket.button')}</Button>
      </Link>
    </div>
  )
}

const TotalPage = ({ total }: { total: number }) => {
  const { deliveryCost, order, basket, clearBasket } = useBasketStore();
  const t = useTranslations();
  const [accept, setAccept] = useState(false);
  const totalAmount = deliveryCost + total;
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
    createOrder(
      {
        ...order,
        basket,
        deliveryCost,
      },
      {
        onSuccess: (data) => {
          toast.success('Замовлення успішно створено!');
          console.log('Order created:', data);
          clearBasket();
        },
        onError: (error) => {
          toast.error(`Помилка: ${error.message}`);
          console.error('Order creation failed:', error);
        },
      }
    );
  };
  
  return (
    <div className='px-8 py-5 bg-light rounded-2xl  '>
      <div className='flex justify-between border-b pb-4'>
        <div className='flex flex-col gap-1 text-gray'>
          <span className='rubik'>{t('delivery-form.delivery-cost')}: {deliveryCost}{t('currency')} </span>
          <span className='rubik'>{t('delivery-form.order-cost')}: {total}{t('currency')}</span>
        </div>
        <div className='flex flex-col text-2xl text-gray'>
          {t('total')}
          <span className='rubik text-[500] text-[40px] text-black '>{totalAmount}{t('currency')}</span>
        </div>
      </div>
      <div className='flex items-center gap-2 py-5'>
        <Checkbox id="accept" checked={accept} onCheckedChange={(checked) => setAccept(checked === 'indeterminate' ? false : checked)} />
        <label htmlFor="accept" className="text-sm text-gray cursor-pointer">  Zapoznałem się z treścią strony Regulamin * </label>
      </div>
      <Button 
        onClick={handleCreateOrder} 
        disabled={!isValid || isPending}
        className="bg-orange hover:bg-orange/90 w-full text-lg h-[56px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Відправка...' : t('basket.button')}
      </Button>
    </div>
  )
}
