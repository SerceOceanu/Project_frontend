import { cn } from '@/lib/utils';
import React from 'react'
import { useTranslations } from 'next-intl';
export default function Status({ status, className }: { status: string, className?: string }) {
  const t = useTranslations();
  const colors = {
    pending: 'bg-light-yellow',
    confirmed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-orange-100 text-orange-700',
    in_delivery: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return (
    <div className={cn("px-5 py-1 rounded-full", colors[status as keyof typeof colors], className)}>
      {t(status)}
    </div>
  );
}