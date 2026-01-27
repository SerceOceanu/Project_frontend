import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "../../globals.css";
import { ReactQueryProvider } from "../../providers";

const rubik = Rubik({variable: "--font-rubik",subsets: ["latin"]});
export const metadata: Metadata = {title: "Admin Login - Cerce Oceanu",description: "Admin Panel Login"};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ua">
      <body
        className={`${rubik.variable} antialiased h-screen flex`}
      >
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
