'use client';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from './button';
import { FaAngleLeft } from "react-icons/fa6";

export default function ButtonBack() {
  const t = useTranslations();
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <Button 
      onClick={handleClick}
      variant="outline" 
      className='flex items-center gap-2 text-orange border-orange h-[52px] px-6 hover:bg-orange hover:text-white'
    >
      <FaAngleLeft className='size-5' />{t('back')}
    </Button>
  );
}