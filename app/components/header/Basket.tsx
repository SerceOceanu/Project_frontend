"use client";
import { Button } from "@/components/ui/button";
import { CiHeart } from "react-icons/ci";
import { PiHeartFill } from "react-icons/pi";
import { useTranslations } from "next-intl";
import { TbBasket } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/lib/navigation";
import { useEffect, useRef } from "react";

import OrdersCard from "@/app/[locale]/basket/conponents/OrdersCard";
import { useBasketStore } from "@/store/useBasketStore";
import ProfileButton from "./auth/ProfileButton";
import { useUser } from "@/hooks/useAuth";


export default function Basket() {
  const t = useTranslations();
  const pathname = usePathname();
  const { isBasketModalOpen, setValue } = useBasketStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: user } = useUser();
  
  const isFavoritesPage = pathname === '/profile/favorites' || pathname?.match(/^\/(ua|pl)\/profile\/favorites/);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setValue('isBasketModalOpen', false);
      }
    };

    if (isBasketModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBasketModalOpen, setValue]);


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
        {user && (
          <Link href={buttons[0].href}>
            <Button 
              className={cn( isFavoritesPage && ' text-orange border-orange', "flex items-center gap-2 shadow-none rounded-2xl " )} 
              variant="outline" 
              size="icon-lg"
            >
              {isFavoritesPage ? <PiHeartFill size={20} /> : <CiHeart size={20} />}
            </Button>
          </Link>
        )}
        <ProfileButton />
        
        {/* Mobile basket button */}
        <Link href={buttons[1].href} className="lg:hidden">
          <Button 
            className={cn(
              pathname === buttons[1].href && ' text-orange border-orange',
              "flex items-center gap-2 shadow-none rounded-2xl ", 
            )} 
            variant="outline" 
            size="icon-lg"
          >
            {buttons[1].icon}
          </Button>
        </Link>

        {/* Desktop basket button with modal */}
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
        
        {isBasketModalOpen && (
          <div
            className={cn(
              "absolute top-14  -right-2 z-10 w-[calc(100vw-32px)] max-w-[600px]  transition-all duration-200 origin-top",
              "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            )}
          >
            <OrdersCard  type="modal" />
          </div>
        )}
    </div>
  );  
}




