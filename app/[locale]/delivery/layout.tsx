import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import StructuredDataServer from '@/app/components/StructuredDataServer';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('seo.delivery');
  
  return generateSEOMetadata({
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    url: `/${locale}/delivery`,
  }, locale);
}

export default async function DeliveryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://serceoceanu.com.pl';
  const t = await getTranslations();
  
  // FAQ Schema для страницы доставки
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
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
      {
        '@type': 'Question',
        name: locale === 'ua'
          ? 'Як упаковуються морепродукти для доставки?'
          : 'Jak pakowane są owoce morza do dostawy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'ua'
            ? 'Ми використовуємо надійні термобокси з охолоджувальними елементами для збереження свіжості морепродуктів під час транспортування.'
            : 'Używamy niezawodnych termoboxów z chłodzącymi elementami, aby zachować świeżość owoców morza podczas transportu.',
        },
      },
      {
        '@type': 'Question',
        name: locale === 'ua'
          ? 'Скільки коштує доставка?'
          : 'Ile kosztuje dostawa?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'ua'
            ? 'InPost Paczkomaty коштує 12 zł, а кур\'єрська доставка InPost - 15 zł. Доставка доступна по всій Польщі.'
            : 'InPost Paczkomaty kosztuje 12 zł, a dostawa kurierska InPost - 15 zł. Dostawa dostępna w całej Polsce.',
        },
      },
      {
        '@type': 'Question',
        name: locale === 'ua'
          ? 'Чи є безкоштовна доставка?'
          : 'Czy jest darmowa dostawa?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'ua'
            ? 'Так, ми пропонуємо безкоштовну доставку при замовленні від певної суми. Деталі вказані на сторінці доставки.'
            : 'Tak, oferujemy darmową dostawę przy zamówieniu od określonej kwoty. Szczegóły podane na stronie dostawy.',
        },
      },
    ],
  };

  // Service Schema для доставки
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: locale === 'ua' ? 'Доставка морепродуктів' : 'Dostawa owoców morza',
    provider: {
      '@type': 'LocalBusiness',
      name: t('name'),
      url: siteUrl,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Poland',
    },
    serviceType: locale === 'ua' ? 'Доставка морепродуктів' : 'Dostawa owoców morza',
    description: t('seo.delivery.description'),
  };

  return (
    <>
      <StructuredDataServer type="Organization" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {children}
    </>
  );
}
