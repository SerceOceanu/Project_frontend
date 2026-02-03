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
import { useTranslations } from "next-intl";


export default function DeleteAlert({
  isDelete, 
  setIsDelete, 
  id
}: {
  isDelete: boolean, 
  setIsDelete: (open: boolean) => void, 
  id: string,
}) {
  const t = useTranslations();
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
          <AlertDialogTitle>{t('confirm-delete')}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
            disabled={deleteBanner.isPending}  
          >
            {deleteBanner.isPending ? t('deleting') : t('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}