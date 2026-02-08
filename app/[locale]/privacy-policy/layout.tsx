import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();
  
  const title = locale === 'ua' 
    ? 'Політика конфіденційності - Серце Океану'
    : 'Polityka Prywatności - Serce Oceanu';
  
  const description = locale === 'ua'
    ? 'Політика конфіденційності та Cookies Серце Океану. Інформація про обробку персональних даних, права користувачів та використання cookies.'
    : 'Polityka prywatności i Cookies Serce Oceanu. Informacje o przetwarzaniu danych osobowych, prawach użytkowników i wykorzystaniu cookies.';
  
  return generateSEOMetadata({
    title,
    description,
    keywords: locale === 'ua'
      ? 'політика конфіденційності, cookies, RODO, захист даних, персональні дані'
      : 'polityka prywatności, cookies, RODO, ochrona danych, dane osobowe',
    url: `/${locale}/privacy-policy`,
    noindex: true, // Privacy policy обычно не индексируется
  }, locale);
}

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
