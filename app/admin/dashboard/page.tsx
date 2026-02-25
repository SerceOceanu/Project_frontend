"use client";
import { Button } from "@/components/ui/button";
import { Filter } from "@/types/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ProductCardEdit from "../components/ProductCardEdit";
import CreateDialog from "../components/CreateDialog";
import { useProducts } from "@/hooks/useAdminProducts";

export default function AdminPage() {
  const [filter, setFilter] = useState<Filter>('chilled');
  const [isCreate, setIsCreate] = useState(false);
  
  // Получаем продукты с бэкенда с фильтром по категории
  const { data: products = [], isLoading, error } = useProducts({
    category: filter,
  });

  const menuItems = [
    {
      label: 'Охолоджена продукція',
      value: 'chilled',
    },
    {
      label: 'Заморожена продукція',
      value: 'frozen',
    },
    {
      label: 'Готова продукція',
      value: 'ready',
    },
    {
      label: 'Марінована продукція',
      value: 'marinated',
    },
    {
      label: 'Снеки',
      value: 'snacks',
    },
  ];
  
  return (
    <div className='w-full flex-1 p-3 sm:p-5 pb-[100px] md:pb-5 flex flex-col max-w-[1440px] mx-auto'>
      <div className='flex flex-col sm:flex-row gap-4 sm:gap-10 text-xl sm:text-2xl lg:text-[32px] text-black font-[700] items-start sm:items-center mb-4 sm:mb-6'>
        <h1>Товари</h1>
        <Button 
          className='h-9 text-sm sm:text-base w-full sm:w-auto' 
          onClick={() => setIsCreate(true)}
        >
          Створити товар
        </Button>
      </div>
      <div className='flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-4 lg:gap-6 xl:gap-10 px-3 sm:px-5 py-3 bg-white shadow rounded-[10px] mb-4 sm:mb-6 overflow-x-auto sm:overflow-visible'>
        {menuItems.map((item) => (
          <div 
            key={item.value} 
            className={cn(
              'px-3 sm:px-4 lg:px-5 text-center py-2 rounded hover:bg-gray/10 cursor-pointer text-xs sm:text-sm whitespace-nowrap transition-colors', 
              filter === item.value && 'bg-blue/10 text-blue font-medium'
            )} 
            onClick={() => setFilter(item.value as Filter)}
          >
            {item.label}
          </div>
        ))}
      </div>
      
      {isLoading && (
        <div className="text-center py-10">
          <p>Завантаження товарів...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center py-10 text-red-500">
          <p>Помилка завантаження товарів: {error.message}</p>
        </div>
      )}
      
      {!isLoading && !error && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {products.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray">
              <p>Товарів не знайдено</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCardEdit key={product.id} item={product} />
            ))
          )}
        </div>
      )}
      
      <CreateDialog isCreate={isCreate} setIsCreate={setIsCreate} />
    </div>
  );
}
