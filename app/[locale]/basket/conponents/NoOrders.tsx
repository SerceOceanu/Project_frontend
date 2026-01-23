"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { useBasketStore } from "@/store/useBasketStore";

export default function NoOrders() {
  const t = useTranslations();
  const { setValue } = useBasketStore();

  const handleLinkClick = () => {
    setValue('isBasketModalOpen', false);
  };

  return (
    <div 
      style={{
        backgroundImage: "url('/assets/images/image-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="relative bg-white rounded-[40px] "
    >
      <div className='absolute top-0 left-0 w-full h-full bg-white/80 rounded-[40px]' />
      <div className='flex flex-col  bg-transparent relative z-10 items-center gap-5  pb-10'>
        <Image src="/assets/images/empty-basket.svg" alt="image" 
          width={84} 
          height={100} 
          className="rounded-[16px] w-[84px]  object-cover" 
        />
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-[24px] text-base/6 font-semibold rubik text-center  ">
            {t('basket.no-products')}
          </h2>
          <p className=" text-gray text-center ">
            {t('basket.no-products-text')}
          </p>
          <Link href={'/catalogue'} onClick={handleLinkClick}> 
            <Button  className="text-2xl h-[44px] px-6">
              {t('basket.no-products-button')}
            </Button> 
          </Link>
        </div>
      </div>
    </div>
  );
} 