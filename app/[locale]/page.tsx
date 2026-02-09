import SliderSection from "../components/home-page/SliderSection";
import CategorySection from "../components/home-page/CategorySection";
import { getTranslations } from "next-intl/server";
import { getBanners } from "@/services/getBanners";
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import StructuredDataServer from '@/app/components/StructuredDataServer';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('seo.home');
  
  return generateSEOMetadata({
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    url: `/${locale}`,
  }, locale);
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const banners = await getBanners();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://serceoceanu.com.pl';
  
  // Website Schema для главной страницы
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: locale === 'ua' ? 'Серце Океану' : 'Serce Oceanu',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/${locale}/catalogue?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // ItemList Schema для категорий продуктов
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: locale === 'ua' ? 'Категорії морепродуктів' : 'Kategorie owoców morza',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('header.chilled'),
        url: `${siteUrl}/${locale}/catalogue?category=chilled`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('header.frozen'),
        url: `${siteUrl}/${locale}/catalogue?category=frozen`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('header.ready'),
        url: `${siteUrl}/${locale}/catalogue?category=ready`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: t('header.marinated'),
        url: `${siteUrl}/${locale}/catalogue?category=marinated`,
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: t('header.snacks'),
        url: `${siteUrl}/${locale}/catalogue?category=snacks`,
      },
    ],
  };

  return (
    <>
      <StructuredDataServer type="Organization" locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <div className="px-4 pt-[140px] md:pt-[160px] lg:pt-0 lg:px-0 mb-10 lg:mb-20">
        <SliderSection banners={banners} />
      </div>
      
      {/* SEO Text Content - Hidden visually but accessible to search engines */}
      <section className="sr-only" aria-label="SEO Content">
        <h2>
          {t('seo.home.intro-title')}
        </h2>
        <p>
          {t('seo.home.intro-text')}{' '}
          {locale === 'ua' ? 'Перегляньте наш' : 'Zobacz nasz'}{' '}
          <a href={`/${locale}/catalogue`}>{t('header.catalogue')}</a>{' '}
          {locale === 'ua' ? 'з широким асортиментом:' : 'z szerokim asortymentem:'}{' '}
          <a href={`/${locale}/catalogue?category=chilled`}>{t('header.chilled')}</a>,{' '}
          <a href={`/${locale}/catalogue?category=frozen`}>{t('header.frozen')}</a>,{' '}
          <a href={`/${locale}/catalogue?category=ready`}>{t('header.ready')}</a>,{' '}
          <a href={`/${locale}/catalogue?category=marinated`}>{t('header.marinated')}</a>{' '}
          {locale === 'ua' ? 'та' : 'i'}{' '}
          <a href={`/${locale}/catalogue?category=snacks`}>{t('header.snacks')}</a>.
        </p>
        <div>
          <h3>{t('seo.home.why-us-title')}</h3>
          <ul>
            <li>{t('seo.home.why-us-1')}</li>
            <li>{t('seo.home.why-us-2')}</li>
            <li>{t('seo.home.why-us-3')}</li>
            <li>{t('seo.home.why-us-4')}</li>
          </ul>
        </div>
        <p>
          {locale === 'ua' ? 'Дізнайтеся більше' : 'Dowiedz się więcej'}{' '}
          <a href={`/${locale}/about-us`}>{t('header.about-us')}</a>{' '}
          {locale === 'ua' ? 'та' : 'i'}{' '}
          <a href={`/${locale}/delivery`}>{t('header.delivery')}</a>.
        </p>
      </section>
      
      <div className='flex flex-col  pb-[120px] gap-[60px]'>
        <CategorySection category="chilled" title={t('header.chilled')} href="/catalogue?category=chilled" />
        <CategorySection category="frozen" title={t('header.frozen')} href="/catalogue?category=frozen" />
        <CategorySection category="ready" title={t('header.ready')} href="/catalogue?category=ready" />
        <CategorySection category="marinated" title={t('header.marinated')} href="/catalogue?category=marinated" />
        <CategorySection category="snacks" title={t('header.snacks')} href="/catalogue?category=snacks" />
      </div>
    </> 
  );
}

