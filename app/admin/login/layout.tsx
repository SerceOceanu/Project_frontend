import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - Cerce Oceanu",
  description: "Admin Panel Login"
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex">
      {children}
    </div>
  );
}
