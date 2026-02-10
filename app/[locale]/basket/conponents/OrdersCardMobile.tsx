'use client';
import NoOrders from './NoOrders'
import OrderItem from './OrderItem'  
import { useTranslations } from 'next-intl'
import { useBasketStore } from '@/store/useBasketStore'


export default function OrdersCardMobile() {
  const { basket } = useBasketStore();
  const t = useTranslations();
  
  return (
    <div className='flex flex-col gap-6 col-span-1 md:hidden '>
      {(basket.length === 0 || !basket.length) && <NoOrders />}
      {basket.length > 0 && (
        <>   
          <h2 className="text-2xl font-bold w-full "> {t('basket.title')} </h2>
          <div className='flex flex-col gap-2.5 pr-0 md:pr-[30px]'>
            {basket.map((item, index) => (
              <OrderItem key={index} product={item} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

