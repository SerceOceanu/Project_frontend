import type { Metadata } from "next";
import { Geist, Geist_Mono, Rubik, Roboto, Inter } from "next/font/google";
import "../globals.css";
import { ReactQueryProvider } from "../providers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import { Toaster } from "@/components/ui/sonner";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const rubik = Rubik({ variable: "--font-rubik", subsets: ["latin"] });
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"], weight: ["300", "400", "500", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cerce Oceanu",
  description: "Церце Океану",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rubik.variable} ${roboto.variable} ${inter.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ReactQueryProvider>
            <div className="flex flex-col min-h-screen relative">
              <Header />  
              <main className="flex-1 bg-background flex flex-col">
                {children}
              </main>
              <Footer />
              <Toaster position="top-left" />

            </div>
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

