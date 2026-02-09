"use client";
import { useState } from "react";
import { PiHeart, PiHeartFill } from "react-icons/pi";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { FaPlus } from "react-icons/fa6";
import Counter from "@/components/Counter";
import { Link } from "@/lib/navigation";
import { useBasketStore } from "@/store/useBasketStore";
import { Product } from "@/types/types";
import { isAuthenticated } from "@/lib/api-client";
import { useFavoriteProducts, useToggleFavorite } from "@/hooks/useFavorites";
import { formatCurrency } from "@/lib/currency";
import { getProductName, getProductDescription, getProductImage } from "@/lib/product-utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ProductCard({ product }: { product: Product }) {
  const { addToBasket, removeFromBasket, basket, changeQuantity } = useBasketStore();
  const productInBasket = basket.find((p) => p.id === product.id);
  const { data: favoriteIds = [] } = useFavoriteProducts();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const isFavorite = favoriteIds.includes(String(product.id));
  const t = useTranslations();
  const locale = useLocale() as 'pl' | 'ua';
  const isAuth = isAuthenticated();
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  
  const productName = getProductName(product, locale);
  const productDescription = getProductDescription(product, locale);
  const productImage = getProductImage(product, locale);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({ productId: product.id, currentFavorites: favoriteIds });
  };

  const handleDecrease = () => {
    if (!productInBasket) return;
    const currentQuantity = productInBasket.quantity || 1;
    if (currentQuantity > 1) {
      changeQuantity(product.id, currentQuantity - 1);
    } else {
      removeFromBasket(product.id);
    }
  };

  const handleIncrease = () => {
    if (!productInBasket) return;
    const currentQuantity = productInBasket.quantity || 1;
    changeQuantity(product.id, currentQuantity + 1);
  };

  const handleAddToBasket = () => {
    addToBasket({ ...product, quantity: 1 });
  }

  const handleDescriptionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDescriptionOpen(true);
  };

  return (
    <div className="bg-white rounded-[20px] h-full p-2.5 transition-all duration-300 hover:scale-101 flex flex-col">
      <Link
        href={`/catalogue/${product.id}`}
        className="block"
      >
        <div className='relative w-full h-[215px] mb-5'>
          {product.label !== 'none' && <div className="absolute top-2.5 left-2.5 rounded-md px-2.5 py-2 bg-blue text-white text-xs inter">{product.label}</div>}
          {isAuth && (
            <div 
              className='absolute top-2.5 right-2.5 size-8 flex items-center justify-center bg-white/90 rounded-md cursor-pointer hover:bg-white'
              onClick={handleToggleFavorite}
            >
              {isFavorite ? <PiHeartFill size={16} className={`text-orange`} /> : <PiHeart size={16} className={`text-orange`} />}
            </div>
          )}
          <Image
              src={productImage}
              alt={productName}
              width={275}
              height={215}
              className="object-cover rounded-2xl w-full h-[215px] "
              loading="lazy"
            />
        </div>
        <div className='flex flex-col px-2 flex-1'>
          <div className='flex items-start justify-between mb-2'>
            <h3 className="rubik text-2xl font-semibold w-3/4">{productName}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-blue font-bold text-lg inter cursor-help">
                    {product.gramsPerServing}
                    {product.maxGramsPerServing && ` - ${product.maxGramsPerServing}`}{t('weight')}
                  </span>
                </TooltipTrigger>
                {product.maxGramsPerServing && (
                  <TooltipContent className="max-w-[250px] bg-white border-gray-200">
                    <p className="text-sm">
                      {t('weight-tooltip', { 
                        min: product.gramsPerServing, 
                        max: product.maxGramsPerServing 
                      })}
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Link>
      
      <div className='px-2'>
        <p 
          className="text-gray text-sm inter mb-6 line-clamp-4 cursor-pointer hover:text-orange transition-colors"
          onClick={handleDescriptionClick}
        >
          {productDescription}
        </p>
        <div className='flex items-center justify-between mt-auto'>
          <div className="inter text-[28px] font-bold">
            {formatCurrency(product.price)} 
            <span className="text-sm text-gray">zł</span>
          </div>
         
          <div onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
            {productInBasket  
              ? <Counter count={productInBasket.quantity || 1} onIncrease={handleIncrease} onDecrease={handleDecrease} />
              : <Button className="bg-orange hover:bg-orange/90 !px-6 h-[48px] flex items-center justify-center" onClick={handleAddToBasket}>
                  <FaPlus className="text-white  size-[28px]" />
                </Button> 
            }
          </div>
        </div>
      </div>
      
      <Dialog open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
        <DialogContent className="bg-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="rubik text-2xl font-semibold">{productName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-gray text-base inter whitespace-pre-wrap">
              {productDescription}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}