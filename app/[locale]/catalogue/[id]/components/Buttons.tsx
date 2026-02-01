'use client';
import Counter from "@/components/Counter";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { PiHeart, PiHeartFill } from "react-icons/pi";
import { Product } from "@/types/types";
import { useBasketStore } from "@/store/useBasketStore";
import { FiShoppingBag } from "react-icons/fi";
import { isAuthenticated } from "@/lib/api-client";
import { useFavoriteProducts, useToggleFavorite } from "@/hooks/useFavorites";


export default function Buttons({product}: {product: Product}) {
  const t = useTranslations();
  const { addToBasket, removeFromBasket, basket, changeQuantity } = useBasketStore();
  const productInBasket = basket.find((p) => p.id === product.id);
  const { data: favoriteIds = [] } = useFavoriteProducts();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const isFavorite = favoriteIds.includes(String(product.id));
  const isAuth = isAuthenticated();

  const handleToggleFavorite = () => {
    toggleFavorite({ productId: product.id, currentFavorites: favoriteIds });
  };

  return (
    <div className='flex flex-col md:flex-row md:items-center justify-between self-start'>
      <div className="rubik text-[32px] font-bold mr-6"> {product.price}{t('currency')} </div>
      <div className="flex items-center gap-2.5">
        <div className='flex  w-[180px] items-center justify-center'>
          {productInBasket  
            ? <Counter count={productInBasket.quantity || 1} setCount={(count) => changeQuantity(product.id, count)} handleRemove={() => removeFromBasket(product.id)} />
            : <Button 
                className="bg-orange hover:bg-orange/90 !px-6 h-[48px] text-2xl w-[180px]"
                onClick={() => addToBasket({ ...product, quantity: 1 })}
              >  
                {t('basket.in-basket')} <FiShoppingBag className="size-6" />
              </Button>
          }
        </div>
        {isAuth && (
          <Button 
            size='icon' 
            variant='outline' 
            className='size-[48px] bg-white hover:bg-white/90 shadow border-none text-orange'
            onClick={handleToggleFavorite}
          >
            {isFavorite ? <PiHeartFill className="size-[24px]" /> : <PiHeart className="size-[24px]" />}
          </Button>
        )}
      </div>
    </div>
  )
}