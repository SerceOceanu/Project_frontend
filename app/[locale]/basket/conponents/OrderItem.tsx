import { useTranslations } from "next-intl";
import Image from "next/image";
import Counter from "@/components/Counter";
import { RxCross2 } from "react-icons/rx";
import { BasketProduct } from "@/types/types";
import { useBasketStore } from "@/store/useBasketStore";

export default function OrderItem({ product }: { product: BasketProduct }) {
  const t = useTranslations();
  const { changeQuantity, removeFromBasket } = useBasketStore();
  const handleRemoveFromBasket = () => {
    if(product?.quantity && product.quantity > 1) changeQuantity(product.id, product.quantity - 1);
    else removeFromBasket(product.id);
  }

  const totalPrice = product.price * (product?.quantity || 1);
  return (
      <div className="relative flex p-2.5 bg-light rounded-2xl items-center pr-5">
        <div className="flex gap-6 items-center w-1/2 ">
          <Image
            src={product.imageUrl}
            alt="product"
            width={60}
            height={60}
            className="rounded-lg object-cover w-16 h-16"
          />

          <div className="flex flex-col w-2/3">
            <div className="rubik font-semibold text-lg truncate ">{product.name}</div>
            <div className="rubik text-orange">{product.gramsPerServing} {t('weight')} / {product.quantityPerServing} {t('qty')}</div>
          </div>
        </div>
        <div className="inter text-lg md:text-2xl text-gray flex ml-auto mr-5">{totalPrice.toFixed(2)} {t('currency')}</div>
        <Counter count={product?.quantity || 1} setCount={(count) => changeQuantity(product.id, count)} handleRemove={handleRemoveFromBasket} />
        <RxCross2 className="absolute top-1/2 -translate-y-1/2 -right-[30px] size-6 text-gray cursor-pointer" onClick={() => removeFromBasket(product.id)} />
      </div>
  )
}