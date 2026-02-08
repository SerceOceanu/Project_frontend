import type { Metadata } from "next";
import { Geist, Geist_Mono, Rubik, Roboto, Inter } from "next/font/google";
import "../globals.css";
import { ReactQueryProvider } from "../providers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthRedirectHandler from "../components/AuthRedirectHandler";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import { Toaster } from "@/components/ui/sonner";
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import StructuredDataServer from '../components/StructuredDataServer';
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const rubik = Rubik({ variable: "--font-rubik", subsets: ["latin"] });
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"], weight: ["300", "400", "500", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('seo.home');
  
  return generateSEOMetadata({
    title: t('title'),
    description: t('description'),
    keywords: 'морепродукти, риба, доставка, Польща, свіжі морепродукти, охолоджена продукція, заморозка',
    url: `/${locale}`,
  }, locale);
}

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
      <head>
        <StructuredDataServer type="Organization" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rubik.variable} ${roboto.variable} ${inter.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ReactQueryProvider>
            <AuthRedirectHandler />
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

