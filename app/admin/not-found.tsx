'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminNotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin home page
    router.push('/admin');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Сторінка не знайдена</h2>
        <p className="text-gray-600">Перенаправлення на головну админки...</p>
      </div>
    </div>
  );
}
