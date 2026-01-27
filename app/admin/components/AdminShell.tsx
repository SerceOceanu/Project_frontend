'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Menu from './Menu';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // On login page, show only children without Header/Menu
  if (isLoginPage) {
    return <>{children}</>;
  }

  // On other admin pages, show full layout
  return (
    <div className="flex flex-col min-h-screen relative">
      <main className="flex-1 bg-background flex flex-col">
        <Header />
        <section className="flex flex-1">
          <Menu />
          {children}
        </section>
      </main>
    </div>
  );
}
