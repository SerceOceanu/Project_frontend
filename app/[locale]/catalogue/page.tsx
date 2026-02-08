import { getProductsByCategory } from "@/services/getProducts";
import Searching from "./components/Searching";
import ProductsList from "./components/ProductsList";
import NoProducts from "./components/NoProducts";
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/navigation";
import type { Metadata } from 'next';

type CataloguePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
  }>;
};

export async function generateMetadata({ params, searchParams }: CataloguePageProps): Promise<Metadata> {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations('seo.catalogue');
  
  const categoryNames: Record<string, { ua: string; pl: string }> = {
    chilled: { ua: 'охолоджена продукція', pl: 'produkty chłodzone' },
    frozen: { ua: 'заморозка', pl: 'produkty mrożone' },
    ready: { ua: 'готова продукція', pl: 'produkty gotowe' },
    marinated: { ua: 'маринована продукція', pl: 'produkty marynowane' },
    snacks: { ua: 'снеки', pl: 'przekąski' },
  };
  
  const categoryName = category ? categoryNames[category]?.[locale as 'ua' | 'pl'] : '';
  const title = categoryName ? `${t('title')} - ${categoryName}` : t('title');
  const description = categoryName 
    ? `${t('description')} ${categoryName}.`
    : t('description');
  
  return generateSEOMetadata({
    title,
    description,
    keywords: locale === 'ua'
      ? 'каталог морепродуктів, морепродукти, риба, доставка'
      : 'katalog owoców morza, owoce morza, ryby, dostawa',
    url: `/${locale}/catalogue${category ? `?category=${category}` : ''}`,
  }, locale);
}

export default async function Catalogue({ params, searchParams }: CataloguePageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const { category } = resolvedSearchParams;
  const products = await getProductsByCategory(category)
  const hasProducts = products.length > 0;
  const t = await getTranslations();
  
  // Related categories for internal linking
  const allCategories = ['chilled', 'frozen', 'ready', 'marinated', 'snacks'];
  const relatedCategories = category 
    ? allCategories.filter(c => c !== category).slice(0, 3)
    : allCategories.slice(0, 3);
  
  return (
    <div className="pt-[140px] md:pt-[160px] px-4 md:px-10 xl:px-[100px] container pb-[130px]">
      <Searching category={category || undefined} />
      {hasProducts ? <ProductsList products={products} /> : <NoProducts />}
      
      {/* Related Categories Links - Hidden for SEO */}
      <div className="sr-only mt-10">
        <p>
          {locale === 'ua' 
            ? 'Перегляньте також інші категорії: '
            : 'Zobacz także inne kategorie: '
          }
          {relatedCategories.map((cat, index) => {
            const catName = cat === 'chilled' ? t('header.chilled') :
                           cat === 'frozen' ? t('header.frozen') :
                           cat === 'ready' ? t('header.ready') :
                           cat === 'marinated' ? t('header.marinated') :
                           t('header.snacks');
            return (
              <span key={cat}>
                <Link href={`/${locale}/catalogue?category=${cat}`}>{catName}</Link>
                {index < relatedCategories.length - 1 ? ', ' : '.'}
              </span>
            );
          })}
        </p>
        <p>
          <Link href={`/${locale}`}>{locale === 'ua' ? 'Головна' : 'Główna'}</Link> |{' '}
          <Link href={`/${locale}/about-us`}>{t('header.about-us')}</Link> |{' '}
          <Link href={`/${locale}/delivery`}>{t('header.delivery')}</Link>
        </p>
      </div>
    </div>
  );
}

     