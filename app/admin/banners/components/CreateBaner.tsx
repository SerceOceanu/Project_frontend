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
      namePL: '',
      nameUA: '',
      imagePL: null,
      imageUA: null,
    },
  });

  const onSubmit = (data: CreateBannerSchema) => {
    if (!data.imagePL || !data.imageUA) {
      return;
    }
    mutate({
      namePL: data.namePL,
      nameUA: data.nameUA,
      imagePL: data.imagePL,
      imageUA: data.imageUA,
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
      <DialogContent className="!max-w-[900px] !w-[calc(100%-0.5rem)] sm:!w-[calc(100%-1rem)] md:!w-[calc(100%-2rem)] lg:!w-full p-4 md:p-6 bg-white max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 !px-2 sm:!px-4 !pt-3 sm:!pt-4">
          <DialogTitle className='Poppins text-base sm:text-lg md:text-xl'>Створити банер</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 sm:gap-6 !px-2 !py-2 sm:!px-4 sm:!py-4 md:!px-6 md:!py-6 overflow-y-auto flex-1 scrollbar-hide'>
          <div className="flex flex-col gap-5">
            <CustomInput
              label="Назва (PL)*"
              placeholder="Введіть назву банера (PL)"
              name="namePL"
              register={register}
              error={errors.namePL?.message as string}
              type="text"
            />
            <CustomInput
              label="Назва (UA)*"
              placeholder="Введіть назву банера (UA)"
              name="nameUA"
              register={register}
              error={errors.nameUA?.message as string}
              type="text"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Фото (PL)*</label>
              <Controller
                name="imagePL"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div className="flex flex-col gap-2">
                    <LoadImage
                      value={value}
                      currentImage={undefined}
                      onChange={onChange}
                    />
                    {errors.imagePL && (
                      <p className="text-red-500 text-xs">{errors.imagePL.message as string}</p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Фото (UA)*</label>
              <Controller
                name="imageUA"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div className="flex flex-col gap-2">
                    <LoadImage
                      value={value}
                      currentImage={undefined}
                      onChange={onChange}
                    />
                    {errors.imageUA && (
                      <p className="text-red-500 text-xs">{errors.imageUA.message as string}</p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-4" 
            disabled={isPending}
          >
            {isPending ? 'Збереження...' : 'Зберегти'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
