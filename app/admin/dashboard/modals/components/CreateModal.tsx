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
import { Button } from "@/components/ui/button";
import { useCreateModal } from "@/hooks/useAdminModals";
import { toast } from "sonner";
import { createModalSchema, CreateModalSchema } from "@/types/schemas";
import { Textarea } from "@/components/ui/textarea";

export default function CreateModal({
  isCreate, 
  setIsCreate, 
}: {
  isCreate: boolean;
  setIsCreate: (open: boolean) => void;
}) {
  const { mutate, isPending } = useCreateModal();
  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<CreateModalSchema>({
    resolver: zodResolver(createModalSchema),
    defaultValues: {
      name: '',
      description: '',
      enabled: true,
    },
  });

  const onSubmit = (data: CreateModalSchema) => {
    mutate({
      name: data.name,
      description: data.description,
      enabled: data.enabled,
    }, {
      onSuccess: () => {
        toast.success('Спливаюче вікно успішно створено!');
        setIsCreate(false);
        reset();
      },
      onError: (error) => {
        toast.error(`Помилка створення вікна: ${error.message}`);
      },
    });
  }

  return (
    <Dialog open={isCreate} onOpenChange={setIsCreate}>
      <DialogContent className="!max-w-[600px] !w-[calc(100%-0.5rem)] sm:!w-[calc(100%-1rem)] md:!w-[calc(100%-2rem)] lg:!w-full p-4 md:p-6 bg-white max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 !px-2 sm:!px-4 !pt-3 sm:!pt-4">
          <DialogTitle className='Poppins text-base sm:text-lg md:text-xl'>Створити спливаюче вікно</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 sm:gap-6 !px-2 !py-2 sm:!px-4 sm:!py-4 md:!px-6 md:!py-6 overflow-y-auto flex-1 scrollbar-hide'>
          <CustomInput
            label="Назва*"
            placeholder="Введіть назву вікна"
            name="name"
            register={register}
            error={errors.name?.message as string}
            type="text"
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2 relative">
                <label htmlFor="description" className="text-sm text-gray">Опис*</label>
                <Textarea
                  id="description"
                  {...field}
                  placeholder="Введіть опис вікна"
                  className={`w-full min-h-[100px] sm:min-h-[120px] border-solid rounded-xl px-2 sm:px-3 py-2 sm:py-3 ${
                    errors.description 
                      ? '!border-red text-red focus-visible:!border-red focus-visible:!ring-red/20 focus-visible:!ring-[3px]' 
                      : 'border-gray-200'
                  }`}
                />
                {errors.description && (
                  <p className="absolute -bottom-5 left-2 text-red-500 text-xs">{errors.description.message as string}</p>
                )}
              </div>
            )}
          />

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
