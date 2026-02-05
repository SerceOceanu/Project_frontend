'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Filter, Label, Product } from "@/types/types";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import CustomInput from "@/components/CustomInput";
import CustomSelect from "@/components/CustomSelect";
import { Textarea } from "@/components/ui/textarea";
import LoadImage from "./LoadImage";
import { Button } from "@/components/ui/button";
import { useUpdateProduct } from "@/hooks/useAdminProducts";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createProductSchema } from "@/types/schemas";
import { useEffect } from "react";

const menuItems = [
  {
    label: 'Охолоджена продукція',
    value: 'chilled' as Filter,
  },
  {
    label: 'Заморожена продукція',
    value: 'frozen' as Filter,
  },
  {
    label: 'Готова продукція',
    value: 'ready' as Filter,
  },
  {
    label: 'Марінована продукція',
    value: 'marinated' as Filter,
  },
  {
    label: 'Снеки',
    value: 'snacks' as Filter,
  },
];

const labelOptions = [
  {
    label: 'Топ',
    value: 'top',
  },
  {
    label: 'Новинка',
    value: 'new',
  },
  {
    label: 'Не вибрано',
    value: 'none',
  },
];




export default function EditDialog({
  isEdit, 
  setIsEdit, 
  item
}: {
  isEdit: boolean;
  setIsEdit: (open: boolean) => void;
    item: Product;
}) {
  const { mutate, isPending } = useUpdateProduct();
  const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      namePL: '',
      nameUA: '',
      category: 'chilled' as Filter,
      descriptionPL: '',
      descriptionUA: '',
      price: '0',
      gramsPerServing: 0,
      quantityPerServing: 0,
      label: 'none' as Label,
      filePL: null as File | null,
      fileUA: null as File | null,
    },
  });

  // Заполняем поля при открытии диалога
  useEffect(() => {
    if (isEdit) {
      reset({
        namePL: typeof item.name === 'string' ? item.name : item.name.pl || '',
        nameUA: typeof item.name === 'string' ? item.name : item.name.ua || '',
        category: item.category || 'chilled' as Filter,
        descriptionPL: typeof item.description === 'string' ? item.description : item.description.pl || '',
        descriptionUA: typeof item.description === 'string' ? item.description : item.description.ua || '',
        price: String(item.price || 0),
        gramsPerServing: item.gramsPerServing || 0,
        quantityPerServing: item.quantityPerServing || 0,
        label: item.label || 'none' as Label,
        filePL: null as File | null,
        fileUA: null as File | null,
      });
    }
  }, [isEdit, item, reset]);

  const onSubmit = (data: any) => {
    const formData = {
      name: { pl: data.namePL, ua: data.nameUA },
      category: data.category,
      description: { pl: data.descriptionPL, ua: data.descriptionUA },
      price: typeof data.price === 'string' 
        ? parseFloat(data.price.replace(',', '.')) 
        : Number(data.price),
      gramsPerServing: Number(data.gramsPerServing) || 0,
      quantityPerServing: Number(data.quantityPerServing) || 0,
      label: data.label === 'none' ? 'none' : data.label,
      filePL: data.filePL || undefined,
      fileUA: data.fileUA || undefined,
    };
    
    mutate(
      { id: item.id, productData: formData },
      {
        onSuccess: () => {
          toast.success('Товар успішно оновлено!');
          setIsEdit(false);
        },
        onError: (error) => {
          toast.error(`Помилка оновлення товару: ${error.message}`);
        },
      }
    );
  }

  return (
    <Dialog open={isEdit} onOpenChange={setIsEdit}>
      <DialogContent className="!max-w-[1000px] !w-full bg-white">
        <DialogHeader>
          <DialogTitle className='Poppins text-xl'>
            Редагувати товар "{typeof item.name === 'string' ? item.name : `${item.name.pl} / ${item.name.ua}`}"
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-6'>
          <div className="grid grid-cols-2 gap-5 mb-3">
            <div className="flex flex-col gap-5">
              <CustomInput
                label="Назва (PL)*"
                placeholder="Введіть назву товару (PL)"
                name="namePL"
                register={register}
                error={errors.namePL?.message as string}
                type="text"
              />
              <CustomInput
                label="Назва (UA)*"
                placeholder="Введіть назву товару (UA)"
                name="nameUA"
                register={register}
                error={errors.nameUA?.message as string}
                type="text"
              />
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <div className="relative flex flex-col gap-2">
                    <label className="text-sm text-gray">Категорія*</label>
                    <CustomSelect
                      options={menuItems.map(item => ({ label: item.label, value: item.value }))}
                      placeholder="Оберіть категорію"
                      value={field.value || ''}
                      onChange={field.onChange}
                      className={`w-full bg-transparent !border rounded-xl ${errors.category ? '!border-red' : ''}`}
                    />
                    {errors.category && (
                      <p className="absolute -bottom-5 left-2 text-red-500 text-xs">{errors.category.message}</p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="descriptionPL"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-2 relative">
                    <label htmlFor="descriptionPL" className="text-sm text-gray">Опис (PL)*</label>
                    <Textarea
                      id="descriptionPL"
                      {...field}
                      placeholder="Введіть опис товару (PL)"
                      className={`w-full min-h-[120px] border-solid rounded-xl ${
                        errors.descriptionPL 
                          ? '!border-red text-red focus:border-red !ring-red/20 !focus:ring-red' 
                          : 'border-gray-200'
                      }`}
                    />
                    {errors.descriptionPL && (
                      <p className="absolute -bottom-5 left-2 text-red-500 text-xs">{errors.descriptionPL.message as string}</p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="descriptionUA"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-2 relative">
                    <label htmlFor="descriptionUA" className="text-sm text-gray">Опис (UA)*</label>
                    <Textarea
                      id="descriptionUA"
                      {...field}
                      placeholder="Введіть опис товару (UA)"
                      className={`w-full min-h-[120px] border-solid rounded-xl ${
                        errors.descriptionUA 
                          ? '!border-red text-red focus:border-red !ring-red/20 !focus:ring-red' 
                          : 'border-gray-200'
                      }`}
                    />
                    {errors.descriptionUA && (
                      <p className="absolute -bottom-5 left-2 text-red-500 text-xs">{errors.descriptionUA.message as string}</p>
                    )}
                  </div>
                )}
              />
              <CustomInput
                label="Вага порції (г)*"
                placeholder="Введіть вагу в грамах"
                name="gramsPerServing"
                register={register}
                error={errors.gramsPerServing?.message}
                type="number"
              />
              <CustomInput
                label="Кількість в 1 порції*"
                placeholder="Введіть кількість штук"
                name="quantityPerServing"
                register={register}
                error={errors.quantityPerServing?.message}
                type="number"
              />
              <div className="flex flex-col gap-2 relative">
                <label className="text-sm text-gray">Ціна (zl)*</label>
                <Input
                  type="text"
                  placeholder="Введіть ціну"
                  {...register('price')}
                  onKeyDown={(e) => {
                    // Разрешаем: цифры, точку, запятую, Backspace, Delete, Tab, стрелки
                    if (
                      !/^[0-9.,]$/.test(e.key) && 
                      !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) &&
                      !(e.ctrlKey || e.metaKey) // Разрешаем Ctrl/Cmd комбинации (копировать, вставить и т.д.)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.price 
                      ? 'border-red text-red focus:border-red ring-red/20 focus:ring-red' 
                      : 'border-gray-200 focus:ring-orange/20'
                  }`}
                />
                {errors.price && (
                  <p className="absolute -bottom-5 left-2 text-red-500 text-xs">{errors.price.message as string}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <Controller
                name="label"
                control={control}
                render={({ field }) => (
                  <div className="relative flex flex-col gap-2">
                    <label className="text-sm text-gray">Лейбл</label>
                    <CustomSelect
                      options={labelOptions.map(item => ({ label: item.label, value: item.value}))}
                      placeholder="Оберіть лейбл"
                      value={field.value || 'none'}
                      onChange={field.onChange}
                      className="w-full bg-transparent !border rounded-xl"
                    />
                  </div>
                )}
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Фото (PL)*</label>
                <Controller
                  name="filePL"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <LoadImage
                      value={value}
                      currentImage={typeof item.imageUrl === 'object' && item.imageUrl !== null && 'pl' in item.imageUrl ? item.imageUrl.pl : (typeof item.imageUrl === 'string' ? item.imageUrl : '')}
                      onChange={onChange}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Фото (UA)*</label>
                <Controller
                  name="fileUA"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <LoadImage
                      value={value}
                      currentImage={typeof item.imageUrl === 'object' && item.imageUrl !== null && 'ua' in item.imageUrl ? item.imageUrl.ua : (typeof item.imageUrl === 'string' ? item.imageUrl : '')}
                      onChange={onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <Button 
            type="submit" 
            className="self-end"
            disabled={isPending}
          >
            {isPending ? 'Збереження...' : 'Зберегти'}
          </Button>
        </form>
        
      </DialogContent>
    </Dialog>
  )
}