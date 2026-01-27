'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import CustomInput from '@/components/CustomInput';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminLogin } from '@/hooks/useAdminLogin';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useAdminLogin();

  const onSubmit = async (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        console.log('✅ Login successful, response:', response);
        
        // Get token from response: response.tokens.accessToken
        const token = response?.tokens?.accessToken || response?.token || response?.accessToken;
        
        if (!token) {
          console.error('❌ No token in response!', response);
          alert('Ошибка: токен не получен от сервера');
          return;
        }
        
        // Save token to localStorage
        localStorage.setItem('admin-token', token);
        console.log('💾 Token saved to localStorage:', token.substring(0, 20) + '...');
        
        // Verify token was saved
        const savedToken = localStorage.getItem('admin-token');
        if (savedToken === token) {
          console.log('✅ Token verified in localStorage');
        } else {
          console.error('❌ Token verification failed!');
        }
        
        router.push('/admin');
      },
      onError: (error) => {
        console.error('❌ Login error:', error);
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col items-center pt-[50px] bg-[url('/assets/images/login-bg.svg')] bg-cover bg-center bg-no-repeat w-full flex-1 bg-white">
      <Image 
        src="/assets/images/logo.svg" 
        alt="Cerce Oceanu" 
        width={185} 
        height={140} 
      />
      <h1 className="Rubik font-[300] text-[30px] text-dark mt-3 mb-8">Admin panel</h1>
      <div className='flex flex-col p-8 rounded-xl shadow bg-white w-full max-w-[550px]'>
        <h2 className="Popipins font-semibold text-xl text-dark mb-11">Login</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="relative flex flex-col gap-2">
            <CustomInput
              label="Email"
              placeholder="Enter your email"
              name="email"
              register={register}
              error={loginMutation.error?.message || errors.email?.message}
              type="email"
            />
            
          </div>
          
          <CustomInput
            label="Password"
            placeholder="Enter your password"
            name="password"
            register={register}
            error={errors.password?.message}
            type="password"
          />
          
          <Button 
            type="submit" 
            disabled={loginMutation.isPending}
            className={cn(
              "self-end h-9 text-base bg-orange text-white rounded hover:bg-orange/90",
              loginMutation.isPending && "opacity-50 cursor-not-allowed"
            )}
          >
            {loginMutation.isPending ? 'Чекай...' : 'Увійти'}
          </Button>
        </form>
      </div>
    </div>
  );
}
