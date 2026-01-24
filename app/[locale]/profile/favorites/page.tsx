
import { getProductsByCategory } from "@/services/getProducts";
import FavoritesList from "./FavoritesList";

export const dynamic = 'force-dynamic';

export default async function Favorites() {
  const products = await getProductsByCategory();

  return (
    <FavoritesList products={products} />
  );
} 

