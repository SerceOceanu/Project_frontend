import { Button } from "@/components/ui/button";
import { BsTrash3 } from "react-icons/bs";
import Image from "next/image";
import { Banner } from "@/types/types";
import { useDeleteBanner } from "@/hooks/useAdminBaners";
import DeleteAlert from "./DeleteAlert";
import { useState } from "react";
export default function BannerCard({item}: {item: Banner}) {
  const deleteBanner = useDeleteBanner();
  const [isDelete, setIsDelete] = useState(false);
  const handleDelete = () => {
    deleteBanner.mutate(item.id, {
      onSuccess: () => {
        setIsDelete(true);
      },
    });
  }
  return (
    <>
      <div key={item.name} className=' flex flex-col relative gap-2'>
        <Image src={item.fileUrl} alt={item.name} width={222} height={180} className='object-cover rounded-2xl w-full h-[180px]' />
        <div className='flex items-center justify-between'>
          <h3 className='text-2xl font-bold'>{item.name}</h3>
          <Button variant='outline' className='h-10 bg-white border-none w-14' onClick={() => setIsDelete(true)}>
            <BsTrash3 className='size-5' />
          </Button>
        </div>
      </div>
      <DeleteAlert
        isDelete={isDelete} 
        setIsDelete={setIsDelete} 
        id={item.id} 
      />
    </>
  )
}