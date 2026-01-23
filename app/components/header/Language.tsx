"use client";
import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/config';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from '@/lib/navigation';

export default function Language() {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const languages = [
    { code: "ua" as Locale },
    { code: "pl" as Locale }
  ];

  const handleLocaleChange = (newLocale: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
      setOpen(false);
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button 
          className="flex items-center p-2 gap-1 cursor-pointer xl:mr-[30px]"
          disabled={isPending}
        >
          <Image src={`/assets/images/${locale}.png`} alt="Language" width={30} height={20} />
          <span className="rubik font-light">{locale}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="end">
        <p className="text-sm font-medium rubik mb-2">{t('language.change-language')}</p>
        <div className="flex justify-center gap-1">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant="secondary"
              onClick={() => handleLocaleChange(lang.code)}
              size="sm"
              disabled={isPending}
              className={`rubik font-light border border-transparent ${locale === lang.code && 'border-orange text-orange'}`}
            >
              <span className="rubik text-sm">{lang.code === "ua" ? t('language.labelUA') : t('language.labelPL')}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}