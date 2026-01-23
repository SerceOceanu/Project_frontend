"use client";
import ProductCard from "@/app/components/ProductCard";
import NoFavorites from "./NoFavorites";
import Paggination from "@/components/Paggination";
import { useState } from "react";
import { Product } from "@/types/types";

export default function FavoritesList ({products}: {products: Product[]}) {
  const [step, setStep] = useState(0);  
  const itemsPerPage = window.innerWidth  < 1280 ? 4 : 6;
  const pageCount = Math.ceil(products.length / itemsPerPage);

  const startIndex = step * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFavorites = products.slice(startIndex, endIndex);

  if(products.length === 0) return <NoFavorites /> 

  return (
    <div className="flex flex-col gap-5">
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-2.5 gap-y-5">
        {currentFavorites.map((favorite, index) => (
          <ProductCard key={index} product={favorite} />
        ))}
        
      </div>
      <Paggination 
        currentPage={step}
        setCurrentPage={setStep}
        pageCount={pageCount}
      />  
    </div>
  );
} 