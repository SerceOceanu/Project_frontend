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
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
      router.push('/profile');
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