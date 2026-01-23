'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { PhoneInput } from "@/components/PhoneInput";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { phoneSchema } from "@/types/schemas";
import { IoChevronBack } from "react-icons/io5";
import { OTPInput } from "./OTPInput";
import { Checkbox } from "@/components/ui/checkbox";
import { useStatesStore } from "@/store/useStatesStore";
import { useSignInWithGoogle } from "@/hooks/useAuth";
import { setupRecaptcha, sendPhoneVerification, verifyPhoneCode, cleanupRecaptcha } from "@/lib/auth";
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AUTH_QUERY_KEY } from '@/hooks/useAuth';
import type { ConfirmationResult } from 'firebase/auth';

declare global {  
  interface Window {
    recaptchaVerifier?: any;
  }
}

type FormValues = {
  phone: string;
};

export default function LoginForm() {
  const { isCodeSent } = useStatesStore();
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  return (
    <div className='w-full max-w-[460px] absolute top-16 right-2.5 bg-white rounded-xl shadow-xl p-10'>
      {/* Один общий контейнер для reCAPTCHA */}
      <div id="recaptcha-container"></div>
      
      <div style={{ display: isCodeSent ? 'none' : 'block' }}>
        <PhoneForm setConfirmationResult={setConfirmationResult} />
      </div>
      <div style={{ display: isCodeSent ? 'block' : 'none' }}>  
        <VerificationCode confirmationResult={confirmationResult} setConfirmationResult={setConfirmationResult} />
      </div>
    </div>
  );
}

const PhoneForm = ({ setConfirmationResult }: { setConfirmationResult: (result: ConfirmationResult) => void }) => {
  const t = useTranslations();
  const signIn = useSignInWithGoogle();
  const { setIsLoginOpen, setIsCodeSent, setPhoneNumber } = useStatesStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError('');
    
    try {
      const phoneNumber = data.phone.startsWith('+') ? data.phone : `+${data.phone}`;
      console.log('Sending to:', phoneNumber);
      
      // Подождите, чтобы DOM был готов
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Проверьте, существует ли элемент
      const container = document.getElementById('recaptcha-container');
      if (!container) {
        throw new Error('reCAPTCHA container not found');
      }
      
      // Очистите старый verifier
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          console.warn('Clear error:', e);
        }
        window.recaptchaVerifier = undefined;
      }
      
      // Создайте новый
      const verifier = await setupRecaptcha('recaptcha-container');
      
      const confirmation = await  sendPhoneVerification(phoneNumber, verifier);
      setConfirmationResult(confirmation);
      setPhoneNumber(phoneNumber);
      setIsCodeSent(true);
    } catch (err: any) {
      console.error('Error sending code:', err);
      
      // Более детальная обработка ошибок
      if (err.code === 'auth/invalid-phone-number') {
        setError(t('invalid-phone-number'));
      } else if (err.code === 'auth/invalid-app-credential') {
        setError('reCAPTCHA error. Please reload the page.');
      } else if (err.code === 'auth/too-many-requests') {
        setError(t('too-many-requests'));
      } else {
        setError(err.message || t('error-sending-code'));
      }
      
      // Очистка при ошибке
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = undefined;
        } catch (e) {
          console.warn('Error clearing recaptcha', e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col ">
        <h1 className="Poppins font-semibold text-xl mb-6">{t("login")}</h1>

        <div className="relative flex flex-col gap-2 mb-5">
          <label className="text-sm text-gray">
            {t("delivery-form.phone")}
          </label>

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                {...field}
                defaultCountry="PL"
                placeholder={t("delivery-form.phone-placeholder")}
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
        
        {error && (
          <p className="text-red-500 text-sm mb-2">
            {error}
          </p>
        )}
        
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-10 text-base bg-orange text-white rounded hover:bg-orange/90"
        >
          {loading ? t('sending-code') : t('login-button')}
        </Button>
      </form>
      
      <Separator />
      
      <Button 
        onClick={() => {
          signIn.mutate(undefined, {
            onSuccess: () => {
              setIsLoginOpen(false);
            },
          });
        }}
        disabled={signIn.isPending}
        className="w-full h-10 text-base bg-[#333] text-white rounded hover:bg-[#444]"
      >
        <FcGoogle className="size-5" />
        {signIn.isPending ? t('loading') : t('login-with-google')}
      </Button>
    </div>
  );
};

const VerificationCode = ({ 
  confirmationResult, 
  setConfirmationResult 
}: { 
  confirmationResult: ConfirmationResult | null;
  setConfirmationResult: (result: ConfirmationResult) => void;
}) => {
  const t = useTranslations();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { phoneNumber, setIsCodeSent, setPhoneNumber, setIsLoginOpen } = useStatesStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleVerify = async () => {
    if (!confirmationResult) return;
    
    setLoading(true);
    setError('');
    
    try {
      const user = await verifyPhoneCode(confirmationResult, code);
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
      setIsLoginOpen(false);
      router.push('/profile');
    } catch (err: any) {
      console.error('Error verifying code:', err);
      if (err.code === 'auth/invalid-verification-code') {
        setError(t('invalid-code'));
      } else if (err.code === 'auth/code-expired') {
        setError(t('code-expired'));
      } else {
        setError(t('invalid-code'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Очистите старый verifier
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
      
      // Очистите контейнер
      const container = document.getElementById('recaptcha-container');
      if (container) {
        container.innerHTML = '';
      }
      
      // Подождите немного
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const verifier = await setupRecaptcha('recaptcha-container');
      const confirmation = await sendPhoneVerification(phoneNumber, verifier);
      setConfirmationResult(confirmation);
      setCode('');
    } catch (err: any) {
      console.error('Error resending code:', err);
      setError(t('error-sending-code'));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Очистка
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      } catch (e) {
        console.warn('Error clearing recaptcha', e);
      }
    }
    const container = document.getElementById('recaptcha-container');
    if (container) {
      container.innerHTML = '';
    }
    setIsCodeSent(false);
    setCode('');
    setError('');
  };

  return (
    <div>
      <div 
        onClick={handleBack} 
        className="flex items-center rubik text-orange text-[16px] mb-2.5 cursor-pointer"
      >
        <IoChevronBack size={20} /> {t('change-phone')}
      </div>
      
      <p className="Rubik text-gray mb-2.5">{t('enter-code')}</p>
      <div className="Poppins font-semibold text-xl mb-6">{phoneNumber}</div>
      
      <OTPInput value={code} onChange={setCode} />
      
      {error && (
        <p className="text-red-500 text-sm my-2">
          {error}
        </p>
      )}
      
      <div className="flex items-start gap-2 my-5 cursor-pointer">
        <Checkbox 
          className="mt-1"
          id="accept-terms" 
          checked={acceptTerms} 
          onCheckedChange={(checked) => setAcceptTerms(checked === 'indeterminate' ? false : checked)} 
        /> 
        <label 
          htmlFor="accept-terms" 
          className="Rubik text-gray cursor-pointer"
        >
          {t('accept-terms')}
        </label>
      </div>
      
      <div className="flex flex-col gap-2">
        <Button 
          onClick={handleVerify}
          disabled={loading || code.length !== 6 || !acceptTerms}
          className="w-full h-10 text-base bg-orange text-white rounded hover:bg-orange/90"
        > 
          {loading ? t('verifying') : t('login-button')} 
        </Button>
        <Button 
          onClick={handleResend}
          disabled={loading}
          variant="outline" 
          className="w-full h-10 text-base border-orange text-orange rounded hover:bg-orange/10"
        > 
          {t('send-again')} 
        </Button>
      </div>
    </div>
  );
};