import { cn } from '@/lib/utils';
import React from 'react'
import { useTranslations } from 'next-intl';
export default function Status({ status, className }: { status: string, className?: string }) {
  const t = useTranslations();
  const colors = {
    pending: 'bg-light-yellow',
    completed: 'bg-blue text-white',
  }
  return (
    <div className={cn("px-5 py-1 rounded-full", colors[status as keyof typeof colors], className)}>
      {t(status)}
    </div>
  );
}