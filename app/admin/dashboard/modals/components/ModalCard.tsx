import { BsTrash3 } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import DeleteAlert from "./DeleteAlert";
import { useState } from "react";
import { useDeleteModal, useUpdatePopupStatus } from "@/hooks/useAdminModals";
import { Switch } from "@/components/ui/switch";
import { Popup } from "@/hooks/usePopups";
import { toast } from "sonner";

export default function ModalCard({popup}: {popup: Popup}) {
  const deleteModal = useDeleteModal();
  const updateStatus = useUpdatePopupStatus();
  const [isDelete, setIsDelete] = useState(false);

  const handleDelete = () => {
    deleteModal.mutate(popup.id, {
      onSuccess: () => {
        setIsDelete(true);
      },
    });
  }

  const handleUpdateStatus = (checked: boolean) => {
    console.log(checked, 'checked');
    updateStatus.mutate({
      popUpId: popup.id,
      active: checked,
    }, {
      onSuccess: () => {
        toast.success(`Попап ${checked ? 'увімкнено' : 'вимкнено'}`);
      },
      onError: (error) => {
        toast.error(`Помилка оновлення статусу: ${error.message}`);
      },
    });
  }

  return (
    <>
      <div key={popup.id} className=' flex flex-col relative gap-2'>
        <div className='p-10 flex flex-col bg-white rounded-xl items-center gap-4'>
          <h3 className='text-2xl font-bold'>{popup.title}</h3>
          <p className='text-sm text-gray'>{popup.description}</p>
        </div>
        <div className='flex items-center justify-between'>
          <Switch 
            id={`active-${popup.id}`} 
            checked={popup.active} 
            onCheckedChange={handleUpdateStatus} 
            disabled={updateStatus.isPending} 
          />
          <Button 
            variant='outline' 
            className='h-10 bg-white border-none w-14' 
            onClick={() => setIsDelete(true)}
            disabled={deleteModal.isPending}
          >
            <BsTrash3 className='size-5' />
          </Button>
        </div>
      </div>
      <DeleteAlert
        isDelete={isDelete} 
        setIsDelete={setIsDelete} 
        id={popup.id} 
      />
    </>
  )
}