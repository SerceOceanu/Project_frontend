import { BsTrash3 } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Modal } from "@/types/types";  
import DeleteAlert from "./DeleteAlert";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
export default function ModalCard({item}: {item: Modal}) {
  const [isDelete, setIsDelete] = useState(false);

  const handleUpdateStatus = (checked: boolean) => {
    console.log(checked);
  }
  return (
    <>
      <div key={item.name} className=' flex flex-col relative gap-2'>
        <div className='p-10 flex flex-col bg-white rounded-xl items-center gap-4'>
          <h3 className='text-2xl font-bold'>{item.name}</h3>
          <p className='text-sm text-gray'>{item.description}</p>
        </div>
        <div className='flex items-center justify-between'>
          <Switch id="active" checked={true} onCheckedChange={handleUpdateStatus} disabled={false} />
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