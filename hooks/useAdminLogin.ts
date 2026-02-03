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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const response = await fetch(`${API_URL}/auth/login-admin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
          signal: controller.signal,
        });
      
        clearTimeout(timeoutId);
      
        if (!response.ok) {
          let errorMessage = 'Failed to login';
          try {
            const error = await response.json();
            errorMessage = error.message || error.error || errorMessage;
          } catch (e) {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }
      
        const data = await response.json();
        return data;
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('Request timeout. Please check your connection and try again.');
        }
        if (error.message) {
          throw error;
        }
        throw new Error('Network error. Please check your connection and try again.');
      }
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
      
      // Redirect to admin login page
      router.push('/admin/login');
    }
  };
}
