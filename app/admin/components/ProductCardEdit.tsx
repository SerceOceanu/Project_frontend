'use client';

import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { BsTrash3 } from "react-icons/bs";
import { Switch } from "@/components/ui/switch";
import { Product } from "@/types/types";
import DeleteAlert from "./DeleteAlert";
import EditDialog from "./EditDialog";
import { useUpdateProductStatus } from "@/hooks/useAdminProducts";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/currency";
import ImageSlider from "./ImageSlider";

export default function ProductCardEdit({item}: {item: Product  }) {
  const { name, description, price, gramsPerServing, imageUrl, imageUrlPL, imageUrlUA, id, inStock } = item;
  
  // Создаем массив изображений из доступных URL
  const images = (() => {
    const urls: string[] = [];
    
    // Новый формат - imageUrl как объект
    if (typeof imageUrl === 'object' && imageUrl !== null) {
      if ('pl' in imageUrl && imageUrl.pl) urls.push(imageUrl.pl);
      if ('ua' in imageUrl && imageUrl.ua) urls.push(imageUrl.ua);
    }
    // Старый формат - imageUrl как строка
    else if (typeof imageUrl === 'string' && imageUrl) {
      urls.push(imageUrl);
    }
    
    // Fallback на отдельные поля
    if (imageUrlPL) urls.push(imageUrlPL);
    if (imageUrlUA) urls.push(imageUrlUA);
    
    return [...new Set(urls)]; // Убираем дубликаты
  })();
  
  // Получаем названия и описания для обоих языков
  const namePL = typeof name === 'string' ? name : name.pl;
  const nameUA = typeof name === 'string' ? name : name.ua;
  const descriptionPL = typeof description === 'string' ? description : description.pl;
  const descriptionUA = typeof description === 'string' ? description : description.ua;
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const updateStatus = useUpdateProductStatus();
  

  const handleUpdateStatus = (checked: boolean) => {
    updateStatus.mutate(
      { id, inStock: checked },
      { onSuccess: () => toast.success('Статус товару успішно оновлено!'), onError: (error) => toast.error(`Помилка оновлення статусу: ${error.message}`) }
    );
  }
  return (
    <>
      <div className='bg-white shadow rounded-[20px] p-5 flex flex-col relative'>
        <div className='absolute top-6 right-6 rounded-lg bg-white shadow px-5 py-2.5 flex gap-5 z-10'>
          <FiEdit 
            size={20} 
            className='flex cursor-pointer text-gray hover:text-orange transition-colors' 
            onClick={() => setIsEdit(true)}
          />
          <BsTrash3 
            size={20} 
            className='flex cursor-pointer text-gray hover:text-red-500 transition-colors' 
            onClick={() => setIsDelete(true)}
          />
        </div>
        <ImageSlider 
          images={images}
          alt={typeof name === 'string' ? name : `${name.pl} / ${name.ua}`}
          className="w-full h-[180px]"
          width={222}
          height={180}
        />
        <div className='flex mt-6 flex-col'>
          <div className='flex flex-col gap-1 mb-2'>
            {typeof name === 'string' ? (
              <h3 className="rubik text-lg font-semibold">{name}</h3>
            ) : (
              <>
                <h3 className="rubik text-lg font-semibold">
                  <span className="text-xs text-gray-500">PL:</span> {name.pl}
                </h3>
                <h3 className="rubik text-lg font-semibold">
                  <span className="text-xs text-gray-500">UA:</span> {name.ua}
                </h3>
              </>
            )}
            <span className="text-blue font-bold text-base inter">{gramsPerServing} г</span>
          </div>
          <div className="mb-6">
            {typeof description === 'string' ? (
              <p className="text-gray text-xs inter">{description}</p>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-gray text-xs inter">
                  <span className="font-semibold">PL:</span> {description.pl}
                </p>
                <p className="text-gray text-xs inter">
                  <span className="font-semibold">UA:</span> {description.ua}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className='flex items-center justify-between mt-auto'>
          <div className="inter text-[28px] font-bold">
            {formatCurrency(price)}
            <span className="text-sm text-gray">zl</span>
          </div>
          <Switch 
            id="active" 
            checked={inStock}
            onCheckedChange={handleUpdateStatus}
            disabled={updateStatus.isPending}
          />
        </div>
      </div>

      <DeleteAlert 
        isDelete={isDelete} 
        setIsDelete={setIsDelete} 
        id={id} 
        name={typeof name === 'string' ? name : `${name.pl} / ${name.ua}`} 
      />

    <EditDialog
      isEdit={isEdit}
      setIsEdit={setIsEdit}
      item={item}
    />  
    </>
  )
}