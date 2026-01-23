import type { Metadata } from "next";
import { Geist, Geist_Mono, Rubik, Roboto, Inter } from "next/font/google";
import "../globals.css";
import { ReactQueryProvider } from "../providers";
import Header from "./components/Header";
import Menu from "./components/Menu";
import { Toaster } from "@/components/ui/sonner";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const rubik = Rubik({ variable: "--font-rubik", subsets: ["latin"] });
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"], weight: ["300", "400", "500", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin - Cerce Oceanu",
  description: "Admin Panel",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rubik.variable} ${roboto.variable} ${inter.variable} antialiased`}
      >
        <ReactQueryProvider>
          <div className="flex flex-col min-h-screen relative">
            <main className="flex-1 bg-background flex flex-col">
              <Header />
              <section className="flex flex-1">
                <Menu />
                {children}
              </section>
            </main>
          </div>
          <Toaster position="top-left" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
