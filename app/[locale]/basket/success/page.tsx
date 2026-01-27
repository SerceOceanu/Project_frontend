'use client';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function OrderSuccessPage() {
  const t = useTranslations();
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-black text-center">
            {t('order-success-title')}
          </h1>
          
          <p className="text-center text-gray-600 text-base">
            {t('order-success-description')}
          </p>
          
          <Button 
            onClick={handleGoHome}
            className="bg-orange hover:bg-orange/90 text-white w-full h-14 text-lg rounded-lg mt-4"
          >
            {t('order-success-button')}
          </Button>
        </div>
    </div>
  );
}
