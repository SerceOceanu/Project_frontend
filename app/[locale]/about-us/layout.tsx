import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import StructuredDataServer from '@/app/components/StructuredDataServer';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('seo.about');
  
  return generateSEOMetadata({
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    url: `/${locale}/about-us`,
  }, locale);
}

export default async function AboutUsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://serceoceanu.com.pl';
  const t = await getTranslations();
  
  // LocalBusiness Schema для SEO
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: t('name'),
    image: `${siteUrl}/assets/images/logo.png`,
    '@id': siteUrl,
    url: siteUrl,
    telephone: '+48-884-826-064',
    email: 'info@serceoceanu.com.pl',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ul. Leonidasa 76',
      addressLocality: 'Warszawa',
      postalCode: '02-239',
      addressCountry: 'PL',
    },
    openingHours: 'Mo-Fr 10:00-22:00',
    priceRange: '$$',
    servesCuisine: 'Seafood',
    description: t('seo.about.description'),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '42000',
    },
    foundingDate: '2025-02-04',
  };

  // FAQ Schema для страницы "О нас"
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: locale === 'ua' 
          ? 'Що таке Серце Океану?'
          : 'Czym jest Serce Oceanu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('about-us.description'),
        },
      },
      {
        '@type': 'Question',
        name: locale === 'ua'
          ? 'Які морепродукти ви пропонуєте?'
          : 'Jakie owoce morza oferujecie?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'ua'
            ? 'Ми пропонуємо широкий асортимент свіжих морепродуктів: охолоджена продукція, заморозка, готова продукція, маринована продукція та снеки.'
            : 'Oferujemy szeroki asortyment świeżych owoców morza: produkty chłodzone, mrożone, gotowe, marynowane i przekąski.',
        },
      },
      {
        '@type': 'Question',
        name: locale === 'ua'
          ? 'Як швидко доставляються морепродукти?'
          : 'Jak szybko dostarczane są owoce morza?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'ua'
            ? 'Доставка займає всього 1 день. Ми використовуємо InPost Paczkomaty та кур\'єрську доставку для швидкої та зручної доставки по всій Польщі.'
            : 'Dostawa zajmuje tylko 1 dzień. Używamy InPost Paczkomaty i dostawę kurierską dla szybkiej i wygodnej dostawy w całej Polsce.',
        },
      },
    ],
  };

  return (
    <>
      <StructuredDataServer 
        type="Organization" 
        locale={locale}
        data={{
          name: 'Serce Oceanu',
          url: siteUrl,
          logo: `${siteUrl}/assets/images/logo.png`,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+48-884-826-064',
            contactType: 'customer service',
            email: 'info@serceoceanu.com.pl',
          },
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
