"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useUser as useFirebaseUser } from "@/hooks/useAuth";
import { useUpdateProfile } from "@/hooks/useProfile";
import { useEffect } from "react";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(2, "Ім'я має містити мінімум 2 символи"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Edit() {
  const t = useTranslations();
  const { data: firebaseUser, isLoading } = useFirebaseUser();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
      defaultValues: {
        name: "",
      },
  });

  useEffect(() => {
    if (firebaseUser) {
      const displayName = firebaseUser.displayName || "";
      
      reset({
        name: displayName,
      });
    }
  }, [firebaseUser, reset]);

  const onSubmit = (data: ProfileFormData) => {
    const [firstName = "", ...lastNameParts] = data.name.split(" ");
    const lastName = lastNameParts.join(" ");
    
      updateProfile(
        {
          firstName,
          lastName,
        },
      {
        onSuccess: () => {
          toast.success(t('profile.save-success') || 'Профіль оновлено успішно!');
          reset({
            ...data,
          });
        },
        onError: (error: any) => {
          toast.error(error.message || t('error'));
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-5">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="bg-white rounded-2xl p-5">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-red-500">{t('error')}: User not found</p>
        </div>
      </div>
    );
  }

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

        {firebaseUser?.phoneNumber && (
          <div className="space-y-2">
            <label className="rubik text-sm font-medium text-gray">
              {t('profile.phone')}
            </label>
            <Input
              type="tel"
              value={firebaseUser.phoneNumber}
              disabled
              className="h-[55px] rounded-2xl bg-gray-100 cursor-not-allowed"
            />
          </div>
        )}

        {firebaseUser?.email && (
          <div className="space-y-2">
            <label className="rubik text-sm font-medium text-gray">
              Email
            </label>
            <Input
              type="email"
              value={firebaseUser.email}
              disabled
              className="h-[55px] rounded-2xl bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray">{t('profile.email-readonly-hint') || 'Email cannot be changed'}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-[55px] bg-orange hover:bg-orange/90 text-white rounded-2xl rubik text-base font-medium disabled:opacity-50"
        >
          {isPending ? t('loading') : t('profile.save')}
        </Button>
      </form>
    </div>
  );
} 