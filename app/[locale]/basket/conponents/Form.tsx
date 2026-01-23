'use client';
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import CustomInput from "@/components/CustomInput";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo } from "react";
import RadioGroupComponent from "./RadioGroup";
import { PhoneInput } from "@/components/PhoneInput";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox"
import CustomSelect from "@/components/CustomSelect";
import { Textarea } from "@/components/ui/textarea";
import { useBasketStore } from "@/store/useBasketStore";

export default function Form() {
  const { order, setOrder } = useBasketStore();
  const t = useTranslations();
  // Dynamic Zod schema with i18n validation messages
  const schema = useMemo(() => 
    z.object({
      name: z.string().min(2, t('validation.name-min')),
      surname: z.string().min(2, t('validation.surname-min')),
      company: z.string().optional(),
      address: z.string().min(5, t('validation.address-min')),
      postalCode: z.string().min(4, t('validation.postal-code-min')),


      phone: z.string().min(10, t('validation.phone-min')),
      email: z.string().email(t('validation.email-invalid')),

      comment: z.string().optional(),
    }),
    [t]
  );

  type FormData = z.infer<typeof schema>;

  const { register, formState: { errors }, control, watch } = useForm<FormData>({
    defaultValues: {
      name: order.name,
      surname: order.surname,
      company: order.company,
      address: order.address,
      postalCode: order.postalCode,


      phone: order.phone,
      email: order.email,

      comment: order.comment,
    },
    resolver: zodResolver(schema),
  });

  watch(() => {
    setOrder('name', watch('name'));
    setOrder('surname', watch('surname'));
    setOrder('company', watch('company') || '');
    setOrder('address', watch('address'));
    setOrder('postalCode', watch('postalCode'));
    setOrder('phone', watch('phone'));
    setOrder('email', watch('email'));
    setOrder('comment', watch('comment') || '');
  });

  return (
    <form >
      <h2 className="font-bold w-full rubik text-[32px] mb-6"> {t('basket.main-title')} </h2>
      <p className="rubik text-gray  mb-3 "> {t('basket.main-tooltip')} </p>
      <Button type="button" variant="outline" className="w-full h-[56px] bg-white mb-5"> {t('basket.main-button-enter')} </Button>
      <div className="flex flex-col gap-5 bg-white px-6 py-7 rounded-xl">
        <h3 className="font-bold w-full rubik text-[24px]"> {t('delivery-form.title')} </h3>
        <div className="grid grid-cols-2 gap-5"> 
          <CustomInput
            label={t('delivery-form.name')} 
            placeholder={t('delivery-form.name')} 
            register={register} 
            name="name" 
            error={errors.name?.message?.toString()}
            className="col-span-1"
          />
          <CustomInput
            label={t('delivery-form.surname')} 
            placeholder={t('delivery-form.surname')} 
            register={register} 
            name="surname" 
            error={errors.surname?.message?.toString()}
            className="col-span-1"
          />
        </div>
        
        <CustomInput
          label={t('delivery-form.company')} 
          placeholder={t('delivery-form.company')} 
          register={register} 
          name="company" 
          error={errors.company?.message?.toString()}
        />
        <CustomInput
          label={t('delivery-form.address')} 
          placeholder={t('delivery-form.address')} 
          register={register} 
          name="address" 
          error={errors.address?.message?.toString()}
        />
        <CustomInput
          label={t('delivery-form.postal-code')} 
          placeholder={t('delivery-form.postal-code')} 
          register={register} 
          name="postalCode" 
          error={errors.postalCode?.message?.toString()}
        />
        <RadioGroupComponent 
          items={[{ value: 'city', label: t('delivery-form.city') }, { value: 'village', label: t('delivery-form.village') }]} 
          value={order.isCity ? 'city' : 'village'} 
          onChange={(value) => { setOrder('isCity', value === 'city') }} 
        />  
        
        <div className="relative flex flex-col gap-2">
          <label className="text-sm text-gray">{t('delivery-form.phone')}</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                {...field}
                defaultCountry="PL"
                placeholder={t('delivery-form.phone-placeholder')}
                className={cn(errors.phone && "border-red")}
              />
            )}
          />
          {errors.phone?.message && (
            <p className="absolute -bottom-5 left-2 text-red-500 text-xs">
              {errors.phone.message.toString()}
            </p>
          )}
        </div>
        <CustomInput
          label="Email Address*" 
          placeholder="Email" 
          register={register} 
          name="email" 
          error={errors.email?.message?.toString()}
        />
      </div>
      <div className="flex items-center gap-2 mt-3 mb-5 cursor-pointer">
        <Checkbox id="anotherAddress" checked={order.isAnotherAddress} onCheckedChange={(checked) => setOrder('isAnotherAddress', checked === 'indeterminate' ? false : checked)} />
        <label htmlFor="anotherAddress" className="text-sm text-gray cursor-pointer"> {t('delivery-form.another-address-checkbox')} </label>
      </div>
      <div className="flex flex-col gap-5 bg-white px-6 py-7 rounded-xl mb-3">
        <h3 className="font-bold w-full rubik text-[24px]"> {t('delivery-form.delivery-type')} </h3>
          <RadioGroupComponent 
            items={[
                { value: 'pickup', label: t('delivery-form.delivery-type-1') },
                { value: 'courier', label: t('delivery-form.delivery-type-3') },
                { value: 'locker', label: t('delivery-form.delivery-type-2') }
            ]} 
            value={order.deliveryType} 
            onChange={(value) => { setOrder('deliveryType', value) }} 
          />
          {order.deliveryType === 'locker' && <div className="relative flex flex-col gap-2">
              <label htmlFor="postBox" className="text-sm text-gray"> {t('delivery-form.post-box-title')} </label>
              <CustomSelect  
                className="w-full !border-solid shadow-none !border-gray-200"
                options={[{ label: "1177077", value: "177077" }, { label: "232323", value: "232323" }]} 
                placeholder={t('delivery-form.post-box-description')} 
                value={order.lockerNumber || ''} onChange={(value) => { setOrder('lockerNumber', value) }} 
              />
            </div>
          }
      </div>

      <div className="flex flex-col gap-5 bg-white px-6 py-7 rounded-xl mb-3">
        <h3 className="font-bold w-full rubik text-[24px]"> {t('delivery-form.payment-type')} </h3>
          <RadioGroupComponent 
            items={[
                { value: 'card', type: 'Visa' as const, label: t('delivery-form.payment-type-1') },
                { value: 'payu', type: 'PayUGo' as const, label: t('delivery-form.payment-type-2') }, 
                { value: 'blik', type: 'Blik' as const, label: t('delivery-form.payment-type-3') }
            ]} 
            value={order.paymentType} 
            onChange={(value) => { setOrder('paymentType', value) }} 
          />
      </div>
      <div className="flex flex-col gap-5 bg-white px-6 py-7 rounded-xl mb-3">
        <h3 className="font-bold w-full rubik text-[24px]"> {t('delivery-form.comment')} </h3>
        <Textarea
          {...register('comment')}
          placeholder={t('delivery-form.comment-placeholder')} 
          className="w-full h-[100px] border-solid border-gray-200" 
        />
      </div>

    </form>
  )
}