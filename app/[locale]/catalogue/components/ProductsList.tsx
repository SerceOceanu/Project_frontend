"use client";
import ProductCard from '@/app/components/ProductCard'
import { Product } from '@/types/types'
import { useCatalogueStore } from '@/store/useCatalogue';
import { useTranslations, useLocale } from 'next-intl';
import { getProductName } from '@/lib/product-utils';

export default function ProductsList({products}: {products: Product[]}) {
  const { filter, search } = useCatalogueStore();
  const t = useTranslations();
  const locale = useLocale();
  
  let filteredProducts: Product[] = products;

  filteredProducts = filter === 'cheap'?   filteredProducts.sort((a, b) => a.price - b.price) : filteredProducts.sort((a, b) => b.price - a.price);
  if(search) {
    filteredProducts = filteredProducts.filter((product) => {
      const productName = getProductName(product, locale);
      return productName.toLowerCase().includes(search.toLowerCase());
    });
  }

  // If search is active but no results found
  if(search && filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-full max-w-md flex flex-col items-center gap-6">
          <div className="text-8xl">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            {t('catalogue.no-search-results-title')}
          </h2>
          <p className="text-gray-600 text-center">
            {t('catalogue.no-search-results-description', { query: search })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}