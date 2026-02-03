'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://145.239.30.37:3000';

async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/products?limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    
    if (response.status === 401) {
      return false;
    }
    
    return response.ok || response.status === 403;
  } catch (error) {
    return true;
  }
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Skip check for login page
      if (pathname === '/admin/login') {
        setIsChecking(false);
        setIsAuthenticated(true);
        return;
      }

      setIsChecking(true);
      
      // Check if admin token exists
      const token = localStorage.getItem('admin-token');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsChecking(false);
        router.replace('/admin/login');
        return;
      }

      // Validate token with server
      const isValid = await validateToken(token);
      
      if (!isValid) {
        // Token is invalid, remove it and redirect
        localStorage.removeItem('admin-token');
        setIsAuthenticated(false);
        setIsChecking(false);
        router.replace('/admin/login');
        return;
      }

      setIsAuthenticated(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Перевірка авторизації...</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated or on login page
  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  return <>{children}</>;
}
