'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip check for login page
    if (pathname === '/admin/login') {
      return;
    }

    // Check if admin token exists
    const token = localStorage.getItem('admin-token');
    
    if (!token) {
      console.log('🔒 No admin token, redirecting to login');
      router.push('/admin/login');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
