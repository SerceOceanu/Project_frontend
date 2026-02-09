import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://serceoceanu.com.pl';
const siteName = 'Серце Океану / Serce Oceanu';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  noindex?: boolean;
}

export async function generateMetadata(config: SEOConfig, locale: string): Promise<Metadata> {
  const {
    title,
    description,
    keywords,
    image = '/assets/images/logo.png',
    url,
    type = 'website',
    noindex = false,
  } = config;

  const fullTitle = `${title} | ${siteName}`;
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return {
    title: fullTitle,
    description,
    keywords,
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
      },
    },
    openGraph: {
      type: type === 'product' ? 'website' : type,
      title: fullTitle,
      description,
      url: fullUrl,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      alternateLocale: locale === 'ua' ? 'pl' : 'ua',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: fullUrl,
      languages: {
        'uk-UA': `${siteUrl}/ua${url || ''}`,
        'pl-PL': `${siteUrl}/pl${url || ''}`,
      },
    },
  };
}

export function generateStructuredData(type: 'Organization' | 'Product' | 'BreadcrumbList', data: any, locale?: string) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  switch (type) {
    case 'Organization':
      // Privacy policy URL with proper locale handling
      const privacyPolicyPath = locale === 'ua' ? '/privacy-policy' : `/${locale}/privacy-policy`;
      
      return {
        ...baseSchema,
        name: siteName,
        url: siteUrl,
        logo: `${siteUrl}/assets/images/logo.png`,
        privacyPolicy: `${siteUrl}${privacyPolicyPath}`,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+48-884-826-064',
          contactType: 'customer service',
          email: 'info@serceoceanu.com.pl',
        },
        sameAs: [
          'https://www.instagram.com/serce.oceanu.pl',
          'https://www.tiktok.com/@serce_oceanu',
          'https://t.me/Serce_Oceanu',
        ],
        ...data,
      };

    case 'Product':
      return {
        ...baseSchema,
        name: data.name,
        description: data.description,
        image: data.image,
        offers: {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: 'PLN',
          availability: 'https://schema.org/InStock',
          url: data.url,
        },
        ...data,
      };

    case 'BreadcrumbList':
      return {
        ...baseSchema,
        itemListElement: data.items.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      };

    default:
      return baseSchema;
  }
}
