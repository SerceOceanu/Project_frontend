import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteBanner } from "@/hooks/useAdminBaners";


export default function DeleteAlert({
  isDelete, 
  setIsDelete, 
  id
}: {
  isDelete: boolean, 
  setIsDelete: (open: boolean) => void, 
  id: number,
}) {
  const deleteBanner = useDeleteBanner();

  const handleDelete = () => {
    deleteBanner.mutate(id, {
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
            disabled={deleteBanner.isPending}  
          >
            {deleteBanner.isPending ? 'Видалення...' : 'Видалити'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}