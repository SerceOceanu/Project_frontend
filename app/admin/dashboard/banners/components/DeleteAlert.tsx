import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteBanner } from "@/hooks/useAdminBaners";
import { toast } from "sonner";


export default function DeleteAlert({
  isDelete, 
  setIsDelete, 
  id
}: {
  isDelete: boolean, 
  setIsDelete: (open: boolean) => void, 
  id: string,
}) {
  const deleteBanner = useDeleteBanner();

  const handleDelete = () => {
    deleteBanner.mutate(id, {
      onSuccess: () => {
        toast.success('Банер успішно видалено!');
        setIsDelete(false);
      },
      onError: (error) => {
        toast.error(`Помилка видалення банера: ${error.message}`);
      },
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!deleteBanner.isPending) {
      setIsDelete(open);
    }
  };

  return (
    <AlertDialog open={isDelete} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Підтвердження видалення</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteBanner.isPending}>
            Скасувати
          </AlertDialogCancel>
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