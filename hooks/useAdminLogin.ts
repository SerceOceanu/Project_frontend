import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://145.239.30.37:3000';

interface LoginCredentials {
  email: string;
  password: string;
}

export function useAdminLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch(`${API_URL}/auth/login-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
    
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to login');
      }
    
      const data = await response.json();
      return data;
    },
  });
}

export function useAdminLogout() {
  const router = useRouter();
  
  return {
    logout: () => {
      // Очищаем токен из localStorage
      localStorage.removeItem('admin-token');
      console.log('🚪 Logged out, token removed from localStorage');
      
      // Перенаправляем на страницу логина
      router.push('/login');
    }
  };
}
