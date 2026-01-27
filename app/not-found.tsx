'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page
    router.push('/');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen w-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Сторінка не знайдена</h2>
        <p className="text-gray-600">Перенаправлення на головну...</p>
      </div>
    </div>
  );
}
