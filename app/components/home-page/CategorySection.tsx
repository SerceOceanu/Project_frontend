import { getProductsByCategory } from "@/services/getProducts";
import ProductsSlider from "../productsSlider";

export default async function CategorySection({ category, title, href }: { category: string, title: string, href: string }) {
  const products = await getProductsByCategory(category);
  if (!products || products.length === 0) return null;
  return (
    <section className="container flex flex-col mx-auto px-4 md:px-10 xl:px-[100px] ">
        <h2 className="rubik text-3xl font-bold mb-10">{title}</h2>
        <ProductsSlider href={href} products={products || []} />
    </section>
  )
}