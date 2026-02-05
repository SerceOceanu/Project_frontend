import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Status from '@/components/Status';
import { IoIosArrowForward } from 'react-icons/io';
import { formatCurrency } from '@/lib/currency'; 


export default function OrderItem({ order }: { order: any }   ) {
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  return (
      <div className='flex flex-col px-5 lg:px-10 py-5 bg-white rounded-[14px] '>
        <div className="flex flex-col lg:flex-row items-center  cursor-pointer" onClick={() => setOpen(!open)}>
          <div className="flex items-center w-full lg:w-auto  gap-2">
            <IoIosArrowForward className={cn("text-2xl text-orange transition-transform duration-300", open ? "rotate-90" : "")} />
            <div className='rubik text-lg lg:text-2xl'>{order.date}</div>
            <Status status={order.status} className="ml-auto lg:ml-0" />
          </div>
          <div className="inter text-2xl font-bold lg:ml-auto self-start mt-6 lg:mt-0">
            {formatCurrency(order.total)} {t('currency')}
          </div>
        </div>
        <div 
          className={cn(
            "flex flex-col gap-2.5 overflow-hidden transition-all duration-300 ease-in-out",
            open ? "max-h-[2000px] mt-6 opacity-100" : "max-h-0 mt-0 opacity-0"
          )}
        >
          {order.products.map((product: any) => (
            <OrderItemProduct key={product.id} product={product} />
          ))}
        </div>
    </div>
    
  )
}



export const OrderItemProduct = ({ product }: { product: any }) => {
  const t = useTranslations();
  
  // Handle both old string format and new multi-language format
  const productName = typeof product.name === 'string' 
    ? product.name 
    : product.name?.pl || product.name?.ua || 'Product';
    
  const productImage = typeof product.imageUrl === 'string'
    ? product.imageUrl
    : product.imageUrl?.pl || product.imageUrl?.ua || "/assets/images/street-1.png";
  
  return (
    <div className="flex p-2.5 bg-light rounded-2xl gap-6 items-center pr-5">
      <div className="flex items-center gap-6 min-w-0 flex-1">
        <Image
          src={productImage}
          alt={productName}
          width={60}
          height={50}
          className="rounded-lg object-cover w-16 h-[50px] flex-shrink-0"
        />

        <div className="flex flex-col min-w-0 flex-1">
          <div className="rubik font-semibold text-sm md:text-lg truncate">{productName}</div>
          <div className="rubik text-sm md:text-base text-orange">{product.weight} {t('weight')} / {product.quantity} {t('qty')}</div>
        </div>
      </div>
      <div className="inter text-sm md:text-2xl ml-auto text-gray flex-shrink-0">{formatCurrency(product.price)} {t('currency')}</div>
    </div>
  )
}