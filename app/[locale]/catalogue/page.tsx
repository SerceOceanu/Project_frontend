import { getProductsByCategory } from "@/services/getProducts";
import Searching from "./components/Searching";
import ProductsList from "./components/ProductsList";
import NoProducts from "./components/NoProducts";

type CataloguePageProps = {
  searchParams: {
    category?: string;
  };
};

export default async function Catalogue({ searchParams }: CataloguePageProps) {
  const { category } = await searchParams;
  const products = await getProductsByCategory(category)
  const hasProducts = products.length > 0;
  
  return (
    <div className="pt-[140px] md:pt-[160px] px-4 md:px-10 xl:px-[100px] container pb-[130px]">
      <Searching category={category || undefined} />
      {hasProducts ? <ProductsList products={products} /> : <NoProducts />}
    </div>
  );
}

     