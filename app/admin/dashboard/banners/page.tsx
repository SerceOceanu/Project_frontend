"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreateBaner from "./components/CreateBaner";
import BannerCard from "./components/BannerCard";
import { useBanners } from "@/hooks/useBanners";

export default function AdminPage() {
  const { data: banners = []} = useBanners();
  const [isCreate, setIsCreate] = useState(false);
  
  return (
    <div className='w-full flex-1 p-5 pb-[100px] md:pb-5 flex flex-col max-w-[1440px] mx-auto'>
      <div className='flex gap-10 text-[32px] text-black font-[700] items-center mb-6'>
        Банери <Button className='h-9' onClick={() => setIsCreate(true)}>Додати Банер</Button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  gap-5'>
        {banners.map((item) => (
          <BannerCard key={item.id} item={item} />
        ))}
      </div>
      <CreateBaner isCreate={isCreate} setIsCreate={setIsCreate} />
    </div>
  );
}
