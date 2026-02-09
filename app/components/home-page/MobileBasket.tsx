'use client';
import { useBasketStore } from "@/store/useBasketStore";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/navigation";
import { calculateItemTotal, formatCurrency, sum } from "@/lib/currency";
import { FiShoppingBag } from "react-icons/fi";

export default function MobileBasket() {
  const { basket } = useBasketStore();
  const t = useTranslations();
  const pathname = usePathname();
  
  const isBasketPage = pathname === '/basket' || pathname?.match(/^\/(ua|pl)\/basket/);
  
  if (basket.length === 0 || isBasketPage) {
    return null;
  }

  const totalItems = basket.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalPrice = sum(basket.map((item) => calculateItemTotal(item.price, item.quantity || 1)));

  return (
    <div className='fixed md:hidden bottom-5 left-5 right-5 bg-orange py-4 px-5 rounded-lg z-50'>
      <div className="flex items-center justify-around text-white">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {t('items', { count: totalItems })}, {formatCurrency(totalPrice)}{t('currency')}
          </span>
        </div>
        <div className="h-6 w-px bg-white/30"></div>
        <Link href="/basket" className="flex items-center gap-2  font-medium hover:opacity-90 transition-opacity">
          {t('apply')}
          <FiShoppingBag className="size-5" />
        </Link>
      </div>
    </div>
  )
}