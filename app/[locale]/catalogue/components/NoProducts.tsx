'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function NoProducts() {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <Image 
          src="/assets/images/no-favorites.svg" 
          alt="No products" 
          width={200} 
          height={200}
          className="opacity-50"
        />
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          {t('catalogue.no-products-title')}
        </h2>
        <p className="text-gray-600 text-center">
          {t('catalogue.no-products-description')}
        </p>
      </div>
    </div>
  );
}
