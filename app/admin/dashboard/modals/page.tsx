"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreateModal from "./components/CreateModal";
import ModalCard from "./components/ModalCard";
import { useModals } from "@/hooks/useAdminModals";

export default function AdminPage() {
  const [isCreate, setIsCreate] = useState(false);
  const { data: popups, isLoading, isError } = useModals();

  console.log(popups);
  if (isLoading) {
    return (
      <div className='w-full flex-1 p-5 flex flex-col max-w-[1440px] mx-auto'>
        <div className='flex items-center justify-center h-64'>
          <p className="text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='w-full flex-1 p-5 flex flex-col max-w-[1440px] mx-auto'>
        <div className='flex items-center justify-center h-64'>
          <p className="text-red-600">Помилка завантаження попапів</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full flex-1 p-5 flex flex-col max-w-[1440px] mx-auto'>
      <div className='flex gap-10 text-[32px] text-black font-[700] items-center mb-6'>
        Спливаючі вікна <Button className='h-9' onClick={() => setIsCreate(true)}>Додати Вікно</Button>
      </div>

      {popups && popups.length > 0 ? (
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  gap-5'>
          {popups.map((popup) => (
            <ModalCard key={popup.id} popup={popup} />
          ))}
        </div>
      ) : (
        <div className='flex items-center justify-center h-64'>
          <p className="text-gray-600">Немає попапів. Додайте перший попап.</p>
        </div>
      )}
      <CreateModal isCreate={isCreate} setIsCreate={setIsCreate} />
    </div>
  );
}
