"use client";
import ProductCard from '@/app/components/ProductCard'
import { Product } from '@/types/types'
import { useCatalogueStore } from '@/store/useCatalogue';

export default function ProductsList({products}: {products: Product[]}) {
  const { filter, search } = useCatalogueStore();
  
  let filteredProducts: Product[] = products;

  filteredProducts = filter === 'cheap'?   filteredProducts.sort((a, b) => a.price - b.price) : filteredProducts.sort((a, b) => b.price - a.price);
  if(search) filteredProducts = filteredProducts.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}