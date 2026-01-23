
import { getProductsByCategory } from "@/services/getProducts";
import FavoritesList from "./FavoritesList";

export default async function Favorites() {
  const products = await getProductsByCategory();

  return (
    <FavoritesList products={products} />
  );
} 

