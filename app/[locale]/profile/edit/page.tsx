"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";

const profileSchema = z.object({
  name: z.string().min(2, "Ім'я має містити мінімум 2 символи"),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Невірний формат телефону"),
  password: z.string().min(6, "Пароль має містити мінімум 6 символів").optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Паролі не співпадають",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Edit() {
  const t = useTranslations();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "John Week",
      phone: "+48884826064",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log("Form data:", data);
  };

  return (
    <div className="bg-white rounded-2xl p-5">
      <h2 className="header text-black mb-6">{t('profile.edit')}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="rubik text-sm font-medium text-gray">
            {t('profile.name')}
          </label>
          <Input
            {...register("name")}
            type="text"
            placeholder={t('profile.name')}
            className="h-[55px] rounded-2xl"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="rubik text-sm font-medium text-gray">
            {t('profile.phone')}
          </label>
          <Input
            {...register("phone")}
            type="tel"
            placeholder="+48 884 826 064"
            className="h-[55px] rounded-2xl"
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="rubik text-sm font-medium text-gray">
            {t('profile.password')}
          </label>
          <Input
            {...register("password")}
            type="password"
            placeholder={t('profile.password-placeholder')}
            className="h-[55px] rounded-2xl"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="rubik text-sm font-medium text-gray">
            {t('profile.confirm-password')}
          </label>
          <Input
            {...register("confirmPassword")}
            type="password"
            placeholder={t('profile.confirm-password-placeholder')}
            className="h-[55px] rounded-2xl"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
          <p className="text-xs text-gray">{t('profile.password-hint')}</p>
        </div>

        <Button
          type="submit"
          className="w-full h-[55px] bg-orange hover:bg-orange/90 text-white rounded-2xl rubik text-base font-medium"
        >
          {t('profile.save')}
        </Button>
      </form>
    </div>
  );
} 