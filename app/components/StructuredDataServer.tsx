import { generateStructuredData } from '@/lib/seo';

interface StructuredDataServerProps {
  type: 'Organization' | 'Product' | 'BreadcrumbList';
  data?: any;
  locale?: string;
}

export default function StructuredDataServer({ type, data = {}, locale = 'pl' }: StructuredDataServerProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://serceoceanu.com.pl';
  
  let schema;
  
  if (type === 'Organization') {
    schema = generateStructuredData('Organization', {
      name: 'Serce Oceanu',
      url: siteUrl,
      logo: `${siteUrl}/assets/images/logo.png`,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+48-884-826-064',
        contactType: 'customer service',
        email: 'info@serceoceanu.com.pl',
      },
    }, locale);
  } else if (type === 'Product' && data) {
    schema = generateStructuredData('Product', {
      name: data.name,
      description: data.description,
      image: data.image?.startsWith('http') ? data.image : `${siteUrl}${data.image}`,
      offers: {
        '@type': 'Offer',
        price: data.price,
        priceCurrency: 'PLN',
        availability: 'https://schema.org/InStock',
        url: `${siteUrl}${data.url || ''}`,
      },
    }, locale);
  } else if (type === 'BreadcrumbList' && data.items) {
    schema = generateStructuredData('BreadcrumbList', {
      items: data.items.map((item: any, index: number) => ({
        name: item.name,
        url: item.url?.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
      })),
    }, locale);
  }

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
