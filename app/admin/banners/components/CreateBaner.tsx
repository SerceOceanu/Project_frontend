'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "@/components/CustomInput";
import LoadImage from "@/app/admin/components/LoadImage";
import { Button } from "@/components/ui/button";
import { useCreateBanner } from "@/hooks/useAdminBaners";
import { toast } from "sonner";
import { createBannerSchema, CreateBannerSchema } from "@/types/schemas";

export default function CreateDialog({
  isCreate, 
  setIsCreate, 
}: {
  isCreate: boolean;
  setIsCreate: (open: boolean) => void;
}) {
  const { mutate, isPending } = useCreateBanner();
  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<CreateBannerSchema>({
    resolver: zodResolver(createBannerSchema),
    defaultValues: {
      name: '',
      image: null,
    },
  });

  const onSubmit = (data: CreateBannerSchema) => {
    if (!data.image) {
      return;
    }
    mutate({
      name: data.name,
      image: data.image,
    }, {
      onSuccess: () => {
        toast.success('Банер успішно створено!');
        setIsCreate(false);
        reset();
      },
      onError: (error) => {
        toast.error(`Помилка створення банера: ${error.message}`);
      },
    });
  }

  return (
    <Dialog open={isCreate} onOpenChange={setIsCreate}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className='Poppins text-xl'>Створити банер</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <CustomInput
            label="Назва*"
            placeholder="Введіть назву банера"
            name="name"
            register={register}
            error={errors.name?.message as string}
            type="text"
          />
          <Controller
            name="image"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="flex flex-col gap-2">
                <LoadImage
                  value={value}
                  currentImage={undefined}
                  onChange={onChange}
                />
                {errors.image && (
                  <p className="text-red-500 text-xs">{errors.image.message as string}</p>
                )}
              </div>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isPending}
          >
            {isPending ? 'Збереження...' : 'Зберегти'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
