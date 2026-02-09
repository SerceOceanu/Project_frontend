import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteModal } from "@/hooks/useAdminModals";


export default function DeleteAlert({
  isDelete, 
  setIsDelete, 
  id
}: {
  isDelete: boolean, 
  setIsDelete: (open: boolean) => void, 
  id: string,
}) {
  const deleteModal = useDeleteModal();

  const handleDelete = () => {
    deleteModal.mutate(id, {
      onSuccess: () => {
        setIsDelete(false);
      },
    });
  };
  return (
    <AlertDialog open={isDelete} onOpenChange={setIsDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Підтвердження видалення</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Скасувати</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
            disabled={deleteModal.isPending}  
          >
            {deleteModal.isPending ? 'Видалення...' : 'Видалити'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}