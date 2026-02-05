import { Button } from "@/components/ui/button";
import { BsTrash3 } from "react-icons/bs";
import { Banner } from "@/types/types";
import { useDeleteBanner } from "@/hooks/useAdminBaners";
import DeleteAlert from "./DeleteAlert";
import ImageSlider from "@/app/admin/components/ImageSlider";
import { useState } from "react";

export default function BannerCard({item}: {item: Banner}) {
  const [isDelete, setIsDelete] = useState(false);
  
  const images = [item.fileUrlPL, item.fileUrlUA].filter(Boolean);
  
  return (
    <>
      <div key={item.id} className=' flex flex-col relative gap-2'>
        <ImageSlider 
          images={images}
          alt={`${item.namePL} / ${item.nameUA}`}
          className="w-full h-[180px]"
          width={400}
          height={180}
        />
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <div className='flex flex-col gap-1'>
              <h3 className='text-lg font-bold'>PL: {item.namePL}</h3>
              <h3 className='text-lg font-bold'>UA: {item.nameUA}</h3>
            </div>
            <Button variant='outline' className='h-10 bg-white border-none w-14' onClick={() => setIsDelete(true)}>
              <BsTrash3 className='size-5' />
            </Button>
          </div>
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