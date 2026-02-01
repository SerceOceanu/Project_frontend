'use client';

import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { BsTrash3 } from "react-icons/bs";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { Product } from "@/types/types";
import DeleteAlert from "./DeleteAlert";
import EditDialog from "./EditDialog";
import { useUpdateProductStatus } from "@/hooks/useAdminProducts";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/currency"; 

export default function ProductCardEdit({item}: {item: Product  }) {
  const { name, description, price, gramsPerServing, imageUrl, id, inStock } = item;
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
        <div className='absolute top-6 right-6 rounded-lg bg-white shadow px-5 py-2.5 flex gap-5'>
          <FiEdit 
            size={20} 
            className='flex cursor-pointer text-gray' 
            onClick={() => setIsEdit(true)}
          />
          <BsTrash3 
            size={20} 
            className='flex cursor-pointer text-gray' 
            onClick={() => setIsDelete(true)}
          />
        </div>
        <Image 
          src={imageUrl} 
          alt={`Product image`} 
          width={222} 
          height={180} 
          className="object-cover rounded-2xl w-full h-[180px]"
        />
        <div className='flex mt-6 flex-col'>
          <div className='flex items-start justify-between mb-2'>
            <h3 className="rubik text-2xl font-semibold w-3/4">{name}</h3>
            <span className="text-blue font-bold text-lg inter ">{gramsPerServing} г</span>
          </div>
          <p className="text-gray text-sm inter mb-6">{description}</p>
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
        name={name} 
      />

    <EditDialog
      isEdit={isEdit}
      setIsEdit={setIsEdit}
      item={item}
    />  
    </>
  )
}