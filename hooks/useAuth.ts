import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from 'firebase/auth';
import { signInWithGoogle, logout, getCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export const AUTH_QUERY_KEY = ['auth', 'user'];

// Получить пользователя
export const useUser = () => {
  return useQuery<User | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5,
  });
};

// Вход
export const useSignInWithGoogle = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: signInWithGoogle,
    onSuccess: (user) => {
      // Only handle success for popup (development)
      // For redirect (production), this won't be called
      if (user) {
        queryClient.setQueryData(AUTH_QUERY_KEY, user);
        
        // Check if login was from basket page
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/basket')) {
            router.push('/profile');
          }
        }
      }
    },
    onError: (error: any) => {
      // Ignore "Redirecting..." error as it's expected
      if (error.message !== 'Redirecting...') {
        console.error('Google sign-in error:', error);
      }
    },
  });
};

// Выход
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      router.push('/');
    },
  });
};