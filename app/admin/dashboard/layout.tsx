'use client';

import Header from '../components/Header';
import Menu from '../components/Menu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
