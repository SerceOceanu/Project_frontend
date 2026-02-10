import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Counter from "@/components/Counter";
import { RxCross2 } from "react-icons/rx";
import { BasketProduct } from "@/types/types";
import { useBasketStore } from "@/store/useBasketStore";
import { calculateItemTotal, formatCurrency } from "@/lib/currency";
import { getProductName, getProductImage } from "@/lib/product-utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function OrderItem({ product }: { product: BasketProduct }) {
  const t = useTranslations();
  const locale = useLocale();
  const { changeQuantity, removeFromBasket } = useBasketStore();
  
  const handleDecrease = () => {
    const currentQuantity = product?.quantity || 1;
    if (currentQuantity > 1) {
      changeQuantity(product.id, currentQuantity - 1);
    } else {
      removeFromBasket(product.id);
    }
  };

  const handleIncrease = () => {
    const currentQuantity = product?.quantity || 1;
    changeQuantity(product.id, currentQuantity + 1);
  };

  const productName = getProductName(product, locale);
  const productImage = getProductImage(product, locale);
  const totalPrice = calculateItemTotal(product.price, product?.quantity || 1);
  
  return (
      <div className="relative flex p-2.5 bg-white  md:bg-light  rounded-2xl items-center justify-between gap-3">
        <div className="flex gap-3 sm:gap-6 items-center w-full xl:w-1/2">
          <Image
            src={productImage}
            alt={productName}
            width={60}
            height={60}
            className="rounded-lg object-cover  h-18 w-24 md:size-16 "
          />

          <div className="flex flex-col flex-1 min-w-0">
            <div className="rubik font-semibold text-base sm:text-lg truncate w-9/10 ">{productName}</div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="rubik text-orange cursor-help text-sm sm:text-base">
                    {product.gramsPerServing}{product.maxGramsPerServing && ` - ${product.maxGramsPerServing}`} {t('weight')}
                  </div>
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
            <div className="flex md:hidden items-center gap-3 w-full justify-between">
              <div className="inter text-base sm:text-lg md:text-2xl text-gray">{formatCurrency(totalPrice)} {t('currency')}</div>
              <Counter count={product?.quantity || 1} onIncrease={handleIncrease} onDecrease={handleDecrease} />
            </div>
          </div>
        </div>
        <div className="hidden md:flex flex-col xl:flex-row items-center xl:gap-3 ">
          <div className="inter text-2xl text-gray">{formatCurrency(totalPrice)} {t('currency')}</div>
          <Counter count={product?.quantity || 1} onIncrease={handleIncrease} onDecrease={handleDecrease} />
        </div>
        <RxCross2 className="absolute top-2 right-2 sm:top-1/2 sm:-translate-y-1/2 sm:-right-[30px] size-5 sm:size-6 text-gray cursor-pointer" onClick={() => removeFromBasket(product.id)} />
      </div>
  )
}