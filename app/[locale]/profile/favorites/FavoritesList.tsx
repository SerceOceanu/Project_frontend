"use client";
import ProductCard from "@/app/components/ProductCard";
import NoFavorites from "./NoFavorites";
import Paggination from "@/components/Paggination";
import { useState, useEffect } from "react";
import { useFavoriteProducts } from "@/hooks/useFavoriteProducts";
import { useTranslations } from "next-intl";

export default function FavoritesList() {
  const t = useTranslations();
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { data: favoriteProducts = [], isLoading, error } = useFavoriteProducts();

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemsPerPage = mounted && window.innerWidth < 1280 ? 4 : 6;
  const pageCount = Math.ceil(favoriteProducts.length / itemsPerPage);

  const startIndex = step * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFavorites = favoriteProducts.slice(startIndex, endIndex);

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{t('error')}: {error.message}</p>
      </div>
    );
  }

  if (favoriteProducts.length === 0) return <NoFavorites /> 

  return (
    <div className="flex flex-col gap-5">
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-2.5 gap-y-5">
        {currentFavorites.map((favorite) => (
          <ProductCard key={favorite.id} product={favorite} />
        ))}
      </div>
      {pageCount > 1 && (
        <Paggination 
          currentPage={step}
          setCurrentPage={setStep}
          pageCount={pageCount}
        />
      )}
    </div>
  );
} 