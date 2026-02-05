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
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className='Poppins text-xl'>Створити спливаюче вікно</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
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
                  className={`w-full min-h-[120px] border-solid rounded-xl ${
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
