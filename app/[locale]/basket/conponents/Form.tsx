'use client';
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import CustomInput from "@/components/CustomInput";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo, useEffect } from "react";
import RadioGroupComponent from "./RadioGroup";
import { PhoneInput } from "@/components/PhoneInput";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea";
import { useBasketStore } from "@/store/useBasketStore";
import { useStatesStore } from "@/store/useStatesStore";
import { useUser as useFirebaseUser } from "@/hooks/useAuth";
import { useDeliveryAddress } from "@/hooks/useDeliveryAddress";
import InpostLockerSearch from "@/components/InpostLockerSearch";

export default function Form() {
  const { order, setOrder } = useBasketStore();
  const { setIsLoginOpen } = useStatesStore();
  const { data: firebaseUser, isLoading: isLoadingUser } = useFirebaseUser();
  const { data: deliveryAddress, isLoading: isLoadingAddress } = useDeliveryAddress();
  const t = useTranslations();
  // Dynamic Zod schema with i18n validation messages
  const schema = useMemo(() => 
    z.object({
      name: z.string().min(2, t('validation.name-min')),
      surname: z.string().min(2, t('validation.surname-min')),
      company: z.string().optional(),
      address: z.string().min(5, t('validation.address-min')),
      postalCode: z.string().min(4, t('validation.postal-code-min')),
      locality: z.string().min(2, t('validation.locality-min') || 'Locality must be at least 2 characters'),
      phone: z.string().min(10, t('validation.phone-min')),
      email: z.string().email(t('validation.email-invalid')),
      comment: z.string().optional(),
      billAddress: z.string().optional(),
      billPostalCode: z.string().optional(),
      billLocality: z.string().optional(),
    }).superRefine((data, ctx) => {
      if (order.isWaybillToAnotherAddress) {
        if (!data.billAddress || data.billAddress.length < 5) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('validation.address-min'),
            path: ['billAddress'],
          });
        }
        if (!data.billPostalCode || data.billPostalCode.length < 4) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('validation.postal-code-min'),
            path: ['billPostalCode'],
          });
        }
        if (!data.billLocality || data.billLocality.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('validation.locality-min') || 'Locality must be at least 2 characters',
            path: ['billLocality'],
          });
        }
      }
    }),
    [t, order.isWaybillToAnotherAddress]
  );

  type FormData = z.infer<typeof schema>;

  const { register, formState: { errors }, control, watch, reset } = useForm<FormData>({
    defaultValues: {
      name: order.name,
      surname: order.surname,
      company: order.company,
      address: order.address,
      postalCode: order.postalCode,
      locality: order.locality,
      phone: order.phone,
      email: order.email,
      comment: order.comment,
      billAddress: order.billAddress,
      billPostalCode: order.billPostalCode,
      billLocality: order.billLocality,
    },
    resolver: zodResolver(schema),
  });

  watch(() => {
    setOrder('name', watch('name'));
    setOrder('surname', watch('surname'));
    setOrder('company', watch('company') || '');
    setOrder('address', watch('address'));
    setOrder('postalCode', watch('postalCode'));
    setOrder('locality', watch('locality'));
    setOrder('phone', watch('phone'));
    setOrder('email', watch('email'));
    setOrder('comment', watch('comment') || '');
    setOrder('billAddress', watch('billAddress') || '');
    setOrder('billPostalCode', watch('billPostalCode') || '');
    setOrder('billLocality', watch('billLocality') || '');
  });

  // Sync form with store when data is loaded from localStorage
  useEffect(() => {
    // Wait for store to hydrate from localStorage
    if (order.name || order.surname || order.address || order.phone || order.email) {
      reset({
        name: order.name,
        surname: order.surname,
        company: order.company,
        address: order.address,
        postalCode: order.postalCode,
        locality: order.locality,
        phone: order.phone,
        email: order.email,
        comment: order.comment,
        billAddress: order.billAddress,
        billPostalCode: order.billPostalCode,
        billLocality: order.billLocality,
      });
    }
  }, [order.name, order.surname, order.address, order.phone, order.email, order.company, order.postalCode, order.locality, order.comment, order.billAddress, order.billPostalCode, order.billLocality, reset]);

  // Auto-fill from Firebase User and saved delivery address
  useEffect(() => {
    if (!firebaseUser) return;
    
    const displayName = firebaseUser.displayName || '';
    const [firstName = '', ...lastNameParts] = displayName.split(' ');
    const lastName = lastNameParts.join(' ');
    
    // Auto-fill user data if fields are empty
    const hasEmptyNameFields = !order.name || !order.surname;
    const hasEmptyEmail = !order.email;
    const hasEmptyPhone = !order.phone;
    
    if (hasEmptyNameFields && firstName) {
      setOrder('name', firstName);
    }
    
    if (hasEmptyNameFields && lastName) {
      setOrder('surname', lastName);
    }
    
    if (hasEmptyEmail && firebaseUser.email) {
      setOrder('email', firebaseUser.email);
    }
    
    if (hasEmptyPhone && firebaseUser.phoneNumber) {
      setOrder('phone', firebaseUser.phoneNumber);
    }
    
    // Auto-fill delivery address if available
    if (deliveryAddress) {
      const hasEmptyAddressFields = !order.address || !order.postalCode;
      
      if (hasEmptyAddressFields) {
        setOrder('address', deliveryAddress.address);
        setOrder('postalCode', deliveryAddress.postalCode);
        setOrder('locality', deliveryAddress.locality);
        setOrder('deliveryType', deliveryAddress.deliveryType);
        
        if (deliveryAddress.lockerNumber) {
          setOrder('lockerNumber', deliveryAddress.lockerNumber);
        }
      }
    }
    
    // Update form with current order state
    reset({
      name: order.name || firstName || '',
      surname: order.surname || lastName || '',
      company: order.company,
      address: order.address,
      postalCode: order.postalCode,
      locality: order.locality,
      phone: order.phone || firebaseUser.phoneNumber || '',
      email: order.email || firebaseUser.email || '',
      comment: order.comment,
      billAddress: order.billAddress,
      billPostalCode: order.billPostalCode,
      billLocality: order.billLocality,
    });
  }, [firebaseUser, deliveryAddress, reset]);

  // Auto-switch to payu payment when courier or locker is selected
  useEffect(() => {
    if ((order.deliveryType === 'courier' || order.deliveryType === 'locker') && order.paymentType === 'cash') {
      setOrder('paymentType', 'payu');
    }
  }, [order.deliveryType, order.paymentType, setOrder]);

  return (
    <form >
      <h2 className="font-bold w-full rubik text-[32px] mb-6"> {t('basket.main-title')} </h2>
      {!firebaseUser && (
      <>
      <p className="rubik text-gray  mb-3 "> {t('basket.main-tooltip')} </p>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full h-[56px] bg-white mb-5"
          onClick={() => setIsLoginOpen(true)}
        > 
          {t('basket.main-button-enter')} 
        </Button>
      </>
      )}
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
          label={t('delivery-form.locality')} 
          placeholder={t('delivery-form.locality-placeholder')} 
          register={register} 
          name="locality" 
          error={errors.locality?.message?.toString()}
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
        
        <div className="relative flex flex-col gap-2">
          <label className="text-sm text-gray">
            {t('delivery-form.phone').split('*').map((part, index, array) => (
              index === array.length - 1 ? part : (
                <span key={index}>
                  {part}
                  <span className="text-red-500">*</span>
                </span>
              )
            ))}
          </label>
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
        <Checkbox id="anotherAddress" checked={order.isWaybillToAnotherAddress} onCheckedChange={(checked) => setOrder('isWaybillToAnotherAddress', checked === 'indeterminate' ? false : checked)} />
        <label htmlFor="anotherAddress" className="text-sm text-gray cursor-pointer"> {t('delivery-form.another-address-checkbox')} </label>
      </div>
      
      {order.isWaybillToAnotherAddress && (
        <div className="flex flex-col gap-5 bg-white px-6 py-7 rounded-xl mb-3">
          <h3 className="font-bold w-full rubik text-[24px]"> {t('delivery-form.another-address-title')} </h3>
          <CustomInput
            label={t('delivery-form.address')} 
            placeholder={t('delivery-form.address')} 
            register={register} 
            name="billAddress" 
            error={errors.billAddress?.message?.toString()}
          />
          <CustomInput
            label={t('delivery-form.postal-code')} 
            placeholder={t('delivery-form.postal-code')} 
            register={register} 
            name="billPostalCode" 
            error={errors.billPostalCode?.message?.toString()}
          />
          <CustomInput
            label={t('delivery-form.locality')} 
            placeholder={t('delivery-form.locality-placeholder')} 
            register={register} 
            name="billLocality" 
            error={errors.billLocality?.message?.toString()}
          />
        </div>
      )}
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
              <InpostLockerSearch
                value={order.lockerNumber || ''}
                onChange={(lockerId, lockerData) => {
                  // Сохраняем ID локера
                  setOrder('lockerNumber', lockerId);
                  
                  // Если есть полные данные адреса, заполняем форму
                  if (lockerData) {
                    if (lockerData.address) {
                      setOrder('address', lockerData.address);
                      reset({
                        ...watch(),
                        address: lockerData.address,
                      });
                    }
                    if (lockerData.postalCode) {
                      setOrder('postalCode', lockerData.postalCode);
                      reset({
                        ...watch(),
                        postalCode: lockerData.postalCode,
                      });
                    }
                    if (lockerData.locality) {
                      setOrder('locality', lockerData.locality);
                    }
                  }
                }}
                placeholder={t('delivery-form.post-box-description')}
                className="w-full !border-solid shadow-none !border-gray-200"
              />
            </div>
          }
      </div>

      <div className="flex flex-col gap-5 bg-white px-6 py-7 rounded-xl mb-3">
        <h3 className="font-bold w-full rubik text-[24px]"> {t('delivery-form.payment-type')} </h3>
          <RadioGroupComponent 
              items={
                order.deliveryType === 'pickup'
                  ? [
                { value: 'payu', type: 'PayUGo' as const, label: t('delivery-form.payment-type-2') }, 
                      { value: 'cash', label: t('delivery-form.payment-type-cash') }
                    ]
                : [{ value: 'payu', type: 'PayUGo' as const, label: t('delivery-form.payment-type-2') }]
              }
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