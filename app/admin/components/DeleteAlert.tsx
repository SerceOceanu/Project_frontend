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
import { useDeleteProduct } from "@/hooks/useAdminProducts";
import { toast } from "sonner";

export default function DeleteAlert({isDelete, setIsDelete, id, name}: {isDelete: boolean, setIsDelete: (open: boolean) => void, id: string, name: string}) {
  const deleteProduct = useDeleteProduct();

  const handleDelete = () => {
    deleteProduct.mutate(id, {
      onSuccess: () => {
        toast.success('Товар успішно видалено!');
        setIsDelete(false);
      },
      onError: (error) => {
        toast.error(`Помилка видалення товару: ${error.message}`);
        setIsDelete(false);
      },
    });
  };

  const handleOpenChange = (open: boolean) => {
    // Не позволяем закрывать окно во время загрузки
    if (!deleteProduct.isPending) {
      setIsDelete(open);
    }
  };

  return (
    <AlertDialog open={isDelete} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Підтвердження видалення</AlertDialogTitle>
          <AlertDialogDescription>
            Ви впевнені, що хочете видалити товар <strong>"{name}"</strong>? Цю дію неможливо скасувати.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteProduct.isPending}>
            Скасувати
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
            disabled={deleteProduct.isPending}
          >
            {deleteProduct.isPending ? 'Видалення...' : 'Видалити'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}