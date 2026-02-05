"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreateModal from "./components/CreateModal";
import ModalCard from "./components/ModalCard";

export default function AdminPage() {
  const [isCreate, setIsCreate] = useState(false);
  const menuItems = [
    {
      id: 1,
      name: 'Марінована ',
      description: 'Опис 1 sgf sfgsfd sfd gfdsg fsdfgsdfgsdf sdfgsfgsfg sdfgsdgsd gsdf sdf sdfdsfgdsfs dfgdsfg',
      enabled: true,
    },
    {
      id: 2,
      name: 'Банер 2',
      description: 'Опис 1 sgf sfgsfd sfd gfdsg fsdfgsdfgsdf sdfgsfgsfg sdfgsdgsd gsdf sdf sdfdsfgdsfs dfgdsfg',
      enabled: true,
    },
  ]

  
  return (
    <div className='w-full flex-1 p-5 flex flex-col max-w-[1440px] mx-auto'>
      <div className='flex gap-10 text-[32px] text-black font-[700] items-center mb-6'>
        Спливаючі вікна <Button className='h-9' onClick={() => setIsCreate(true)}>Додати Вікно</Button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  gap-5'>
        {menuItems.map((item) => (
          <ModalCard key={item.id} item={item} />
        ))}
      </div>
      <CreateModal isCreate={isCreate} setIsCreate={setIsCreate} />
    </div>
  );
}
