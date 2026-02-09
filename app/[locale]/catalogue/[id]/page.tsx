import ButtonBack from "@/components/ui/buttonBack";
import { getTranslations, getLocale } from "next-intl/server";
import { FaChevronRight } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/app/components/ProductCard";
import Buttons from "./components/Buttons";
import WeightWithTooltip from "./components/WeightWithTooltip";
import { getProductsByCategory } from "@/services/getProducts";
import { getProduct } from "@/services/getProduct";
import { getProductName, getProductDescription, getProductImage } from "@/lib/product-utils";
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import StructuredDataServer from "@/app/components/StructuredDataServer";
import { Link as NavLink } from "@/lib/navigation";
import type { Metadata } from 'next';

type ProductPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const product = await getProduct(id);
  const t = await getTranslations('seo.product');
  
  if (!product) {
    return generateSEOMetadata({
      title: 'Product not found',
      description: 'Product not found',
    }, locale);
  }
  
  const productName = getProductName(product, locale);
  const productDescription = getProductDescription(product, locale);
  const productImage = getProductImage(product, locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://serceoceanu.com.pl';
  
  return generateSEOMetadata({
    title: t('title', { name: productName }),
    description: t('description', { name: productName, description: productDescription }),
    keywords: locale === 'ua'
      ? `${productName}, морепродукти, риба, купити онлайн`
      : `${productName}, owoce morza, ryby, kup online`,
    image: productImage.startsWith('http') ? productImage : `${siteUrl}${productImage}`,
    url: `/${locale}/catalogue/${id}`,
    type: 'product',
  }, locale);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const products = await getProductsByCategory();
  const product = await getProduct(id);
  const t = await getTranslations();
  const locale = await getLocale();

  if(!product)  return <div>Product not found</div>

  const productName = getProductName(product, locale);
  const productDescription = getProductDescription(product, locale);
  const productImage = getProductImage(product, locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://serceoceanu.com.pl';
  const fullImageUrl = productImage.startsWith('http') ? productImage : `${siteUrl}${productImage}`;

  // Get category name for links
  const categoryNames: Record<string, { ua: string; pl: string }> = {
    chilled: { ua: t('header.chilled'), pl: t('header.chilled') },
    frozen: { ua: t('header.frozen'), pl: t('header.frozen') },
    ready: { ua: t('header.ready'), pl: t('header.ready') },
    marinated: { ua: t('header.marinated'), pl: t('header.marinated') },
    snacks: { ua: t('header.snacks'), pl: t('header.snacks') },
  };
  const categoryName = categoryNames[product.category]?.[locale as 'ua' | 'pl'] || '';
  const categoryUrl = `/catalogue?category=${product.category}`;
  
  // Get similar products from same category
  const similarProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  // If not enough similar products, add from other categories
  const recommendedProducts = similarProducts.length >= 4 
    ? similarProducts 
    : [...similarProducts, ...products.filter(p => p.id !== product.id && !similarProducts.includes(p)).slice(0, 4 - similarProducts.length)];

  // Breadcrumbs for Structured Data
  const breadcrumbs = {
    items: [
      { name: locale === 'ua' ? 'Головна' : 'Główna', url: `/${locale}` },
      { name: t('header.catalogue'), url: `/${locale}/catalogue` },
      ...(categoryName ? [{ name: categoryName, url: categoryUrl }] : []),
      { name: productName, url: `/${locale}/catalogue/${id}` },
    ],
  };

  return (
    <>
      <StructuredDataServer 
        type="Product" 
        data={{
          name: productName,
          description: productDescription,
          image: fullImageUrl,
          price: product.price,
          url: `/${locale}/catalogue/${id}`,
        }} 
      />
      <StructuredDataServer type="BreadcrumbList" data={breadcrumbs} />
      <div className='px-4 md:px-10 xl:px-25 pt-[90px] container pb-[130px]' >
        <ButtonBack />
        <div className='flex flex-col mt-[50px]'>
          <div className='flex items-center text-base inter font-semibold gap-2 mb-3 min-w-0'>
            <NavLink href={'/'} className='text-gray text-sm font-medium hover:text-orange hover:underline flex-shrink-0'>{locale === 'ua' ? 'Головна' : 'Główna'}</NavLink> 
            <FaChevronRight className='size-3 flex-shrink-0' />
            <NavLink href={'/catalogue'} className='text-gray text-sm font-medium hover:text-orange hover:underline flex-shrink-0'>{t('header.catalogue')}</NavLink>
            {categoryName && (
              <>
                <FaChevronRight className='size-3 flex-shrink-0' />
                <NavLink href={categoryUrl} className='text-gray text-sm font-medium hover:text-orange hover:underline flex-shrink-0'>{categoryName}</NavLink>
              </>
            )}
            <FaChevronRight className='size-3 flex-shrink-0' /> 
            <span className='truncate'>{productName}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 mb-[90px]">
            <div className="col-span-1">
              <Image src={productImage} alt={productName} width={600} height={400} className="h-50 md:h-100  max-h-[400px] object-cover rounded-4xl" priority />
            </div>
            <div className="col-span-1 flex  flex-col py-10 px-4 md:pl-10 xl:pl-25">
              <div className="rounded-md px-2.5 py-2 bg-blue text-white text-xs inter self-start mb-3"> {t('new')} </div>
              <h1 className="text-2xl md:text-[42px] rubik font-bold mb-4 md:mb-6 line-clamp-2 break-words">{productName}</h1>
              <WeightWithTooltip 
                gramsPerServing={product.gramsPerServing} 
                maxGramsPerServing={product.maxGramsPerServing}
              />
              <p className="text-gray text-base inter mb-4 md:mb-10">
                {productDescription}
 
              </p>
              <Buttons product={product} />

            </div>
          </div>

          {similarProducts.length > 0 && (
            <>
              <h2 className="text-[32px] rubik font-bold mb-4">
                {locale === 'ua' ? 'Схожі продукти' : 'Podobne produkty'}
              </h2>
              <p className="text-gray text-sm mb-6">
                {locale === 'ua' 
                  ? `Інші продукти з категорії "${categoryName}"`
                  : `Inne produkty z kategorii "${categoryName}"`
                }
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
                {similarProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
          
          <h2 className="text-[32px] rubik font-bold mb-10">{t('catalogue.recommended')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          
          {/* SEO Internal Links */}
          <div className="sr-only mt-10">
            <p>
              {locale === 'ua' 
                ? `Перегляньте також: `
                : `Zobacz także: `
              }
              <NavLink href={`/${locale}/catalogue?category=chilled`}>{t('header.chilled')}</NavLink>,{' '}
              <NavLink href={`/${locale}/catalogue?category=frozen`}>{t('header.frozen')}</NavLink>,{' '}
              <NavLink href={`/${locale}/catalogue?category=ready`}>{t('header.ready')}</NavLink>,{' '}
              <NavLink href={`/${locale}/catalogue?category=marinated`}>{t('header.marinated')}</NavLink>,{' '}
              <NavLink href={`/${locale}/catalogue?category=snacks`}>{t('header.snacks')}</NavLink>.
            </p>
          </div>
        </div>

    </div>
    </>
  );
}


