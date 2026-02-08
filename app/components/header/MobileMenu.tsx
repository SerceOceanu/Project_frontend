"use client";
import { TbMenu2 } from "react-icons/tb";
import { useState, useTransition } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname as useIntlPathname, useRouter } from "@/lib/navigation";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Filter } from "@/types/types";
import Item from "./Item";
import LinkItem from "./LinkItem";
import { BsHeart, BsPerson, BsHeartFill } from "react-icons/bs";
import { RiTelegram2Fill } from "react-icons/ri";
import { Locale } from "@/i18n/config";
import { useUser } from "@/hooks/useAuth";

export default function MobileMenu() {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const router = useRouter();
  const pathname = useIntlPathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Filter | null>(null);
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get('filter') as Filter | null;
  const { data: user } = useUser();

  const languages = [
    { code: "ua" as Locale },
    { code: "pl" as Locale }
  ];
  const navigation = [
    {
      label: t('header.home'),
      href: '/'
    },
    {
      label: t('header.delivery'),
      href: '/delivery'
    },
    {
      label: t('header.about-us'),
      href: '/about-us'
    },

  ];

  const filters: {image: string, title: string, value: Filter, href: string}[] = [
    {
      image: '/assets/images/icon1.png',
      title: t('header.chilled'),
      value: 'chilled' as Filter,
      href: '/catalogue?filter=chilled'
    },
    {
      image: '/assets/images/icon2.png',
      title: t('header.frozen'),
      value: 'frozen',
      href: '/catalogue?filter=frozen'
    },
    {
      image: '/assets/images/icon3.png',
      title: t('header.ready'),
      value: 'ready',
      href: '/catalogue?filter=ready'
    },
    {
      image: '/assets/images/icon4.png',
      title: t('header.marinated'),
      value: 'marinated',
      href: '/catalogue?filter=marinated'
    },
    {
      image: '/assets/images/icon5.png',
      title: t('header.snacks'),
      value: 'snacks',
      href: '/catalogue?filter=snacks'
    },
  ]
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon-lg"
          className="lg:hidden flex shadow-none rounded-2xl"
        >
          <TbMenu2 size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full h-full max-w-none bg-background p-0 flex flex-col gap-0">
        <SheetHeader className="px-5 pt-6 pb-0">
          <SheetTitle className="rubik text-2xl font-bold">{t('header.menu')}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4">
          <span className="rubik text-sm text-gray mb-2.5">{t('header.navigation')}</span>
          <LinkItem item={navigation[0]} className="mb-2" onClick={() => setOpen(false)} />
          <div className="flex gap-2 mb-6">
            <LinkItem item={navigation[1]} className="w-full" onClick={() => setOpen(false)} />
            <LinkItem item={navigation[2]} className="w-full" onClick={() => setOpen(false)} />
          </div>

          <span className="rubik text-sm text-gray mb-2.5">{t('header.catalogue')}</span>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {filters.filter((_, index) => index < 4).map((item) => (
              <Item 
                key={item.value} 
                item={item} 
                filter={activeFilter || filter as Filter} 
                setFilter={setFilter} 
                href={item.href}
                onClick={() => setOpen(false)}
              />
            ))}
          </div>
          <Item 
            item={filters[4]} 
            filter={activeFilter || filter as Filter} 
            setFilter={setFilter} 
            className="justify-center mb-6 max-h-12" 
            href={filters[4].href}
            onClick={() => setOpen(false)}
          />

          {user && (
            <>
              <span className="rubik text-sm text-gray mb-2.5 ">{t('header.personal')}</span>
              <div className="flex gap-2 mb-6">
                <Link 
                  href="/profile" 
                  onClick={() => setOpen(false)}
                  className={cn(button,'justify-center gap-2.5',pathname === '/profile' && ' text-orange border-orange')}
                >
                  <BsPerson size={20} />
                  <span className="rubik text-sm font-light">{t('header.profile')}</span> 
                </Link>
                <Link 
                  href="/profile/favorites" 
                  onClick={() => setOpen(false)}
                  className={cn(button,'justify-center gap-2.5',pathname === '/profile/favorites' && ' text-orange border-orange')}
                >
                  {pathname === '/profile/favorites' ? <BsHeartFill size={20} /> : <BsHeart size={20} />}
                  <span className="rubik text-sm font-light">{t('header.favorites')}</span>
                </Link>
              </div>
            </>
          )}

          <span className="rubik text-sm text-gray mb-2.5 mt-6">{t('header.contacts')}</span>
          <div className={cn(button,'justify-center flex-col mb-2.5')}>
            <span rel="tel:+48884826064" className="inter mb-2.5 font-medium text-black"> +48 884 826 064</span>
            <span className="rubik text-xs text-light-gray">{t('header.contacts-title')}:</span>
            <span className="rubik font-medium">{t('header.work-hours-description')}: 10:00 - 22:00</span>
          </div>

          <a 
            href="https://t.me/Serce_Oceanu" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <Button size="lg" className="w-full bg-[#1599DA] h-[48px] rounded-2xl text-lg font-light rubik flex items-center justify-center gap-3 mb-6 hover:opacity-90 transition-opacity">
              <RiTelegram2Fill size={20} />
              {t('header.support')}
            </Button>
          </a>

          <div className={cn(button,'flex-col mb-2.5 items-start')}>
          <p className="text-sm font-medium rubik mb-2">{t('language.change-language')}</p>
          <div className="flex gap-1 w-full">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant="secondary"
                onClick={() => {
                  startTransition(() => {
                    router.replace(pathname, { locale: lang.code });
                  });
                }}
                size="sm"
                disabled={isPending}
                className={`rubik w-1/2 font-light border border-transparent ${ locale === lang.code && 'border-orange text-orange'  }`}
              >
                  <span className="rubik text-sm">{lang.code === "ua" ? t('language.labelUA') : t('language.labelPL')}</span>
                </Button>
              ))}
            </div>
          </div>
    </div>
      </SheetContent>
    </Sheet>
  );
}

const button = 'w-full flex items-center text-center justify-center rubik text-sm text-gray py-3 px-3 rounded-2xl bg-white border border-transparent';