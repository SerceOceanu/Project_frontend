import ButtonBack from "@/components/ui/buttonBack";
import { getTranslations } from "next-intl/server";
import { FaChevronRight } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/app/components/ProductCard";
import Buttons from "./components/Buttons";
import { getProductsByCategory } from "@/services/getProducts";
import { getProduct } from "@/services/getProduct";


export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const products = await getProductsByCategory();
  const product = await getProduct(id);
  const t = await getTranslations();

  if(!product) {
    return <div>Product not found</div>
  }

  return (
    <div className='px-[100px] pt-[90px] container pb-[130px]' >
        <ButtonBack />
        <div className='flex flex-col mt-[50px]'>
          <div className='flex items-center text-base inter font-semibold gap-2 mb-3'>
            <Link href={'/catalogue'} className='text-gray text-sm font-medium hover:text-orange hover:underline'>{t('header.catalogue')}</Link> <FaChevronRight className='size-3' /> {product.name}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 mb-[90px]">
            <div className="col-span-1">
              <Image src={product?.imageUrl || ''} alt={product?.name || ''} width={600} height={400} className=" h-100  max-h-[400px] object-cover rounded-4xl" />
            </div>
            <div className="col-span-1 flex  flex-col py-10 pl-15">
              <div className="rounded-md px-2.5 py-2 bg-blue text-white text-xs inter self-start mb-3"> {t('new')} </div>
              <h1 className="text-[42px] rubik font-bold mb-6">{product.name}</h1>
              <span className="text-blue font-bold text-2xl inter mb-7">{product.gramsPerServing} {t('weight')}</span>
              <p className="text-gray text-base inter mb-10">{product.description}</p>

              <Buttons product={product} />

            </div>
          </div>

          <h2 className="text-[32px] rubik font-bold mb-10">{t('catalogue.recommended')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {
              products.slice(0, 4).map((product, index) => (
                <ProductCard key={index} product={product} />
              ))
            }
          </div>
        </div>

    </div>
  );
}


