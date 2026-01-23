"use client";
import { Button } from "@/components/ui/button";
import { CiHeart } from "react-icons/ci";
import { useTranslations } from "next-intl";
import { TbBasket } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/lib/navigation";
import { useEffect, useRef } from "react";

import OrdersCard from "@/app/[locale]/basket/conponents/OrdersCard";
import { useBasketStore } from "@/store/useBasketStore";
import ProfileButton from "./auth/ProfileButton";


export default function Basket() {
  const t = useTranslations();
  const pathname = usePathname();
  const { isBasketModalOpen, setValue } = useBasketStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setValue('isBasketModalOpen', false);
    };

    if (isBasketModalOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBasketModalOpen]);


  const buttons = [
    {
      icon: <CiHeart size={20} />,
      href: '/profile/favorites',
    },

    {
      icon: <TbBasket size={20} />,
      href: '/basket',
    },
  ]

  return (
    <div ref={containerRef} className="flex items-center gap-2 relative">
        <Link href={buttons[0].href}>
          <Button 
            className={cn( pathname === buttons[0].href && ' text-orange border-orange', "flex items-center gap-2 shadow-none rounded-2xl " )} 
            variant="outline" 
            size="icon-lg"
          >
            {buttons[0].icon}
          </Button>
        </Link>
        <ProfileButton />
        <Link href={buttons[1].href}>
          <Button 
            className={cn(
              pathname === buttons[1].href && ' text-orange border-orange',
              "flex lg:hidden items-center gap-2 shadow-none rounded-2xl ", 
            )} 
            variant="outline" 
            size="icon-lg"
          >
            {buttons[1].icon}
          </Button>
        </Link>


      <Button 
        onClick={() => {
          if (pathname !== '/basket') setValue('isBasketModalOpen', !isBasketModalOpen);
        }}
        className={cn((isBasketModalOpen || pathname === '/basket') && 'text-orange border-orange', "hidden lg:flex items-center gap-2 h-10 shadow-none rounded-2xl")} 
        variant="outline" 
      >
        <TbBasket  size={20} className={cn(isBasketModalOpen && "text-orange")} />
        <span className={cn(isBasketModalOpen && "text-orange","rubik text-sm font-light")}>{t('header.basket')}</span>
      </Button>
      <div
        className={cn(
          "absolute top-14  -right-2 z-10 w-[calc(100vw-32px)] max-w-[600px]  transition-all duration-200 origin-top",
          isBasketModalOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        )}
      >
        <OrdersCard  type="modal" />
      </div>
    </div>
  );  
}




