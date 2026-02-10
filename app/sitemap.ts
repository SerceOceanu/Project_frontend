import { MetadataRoute } from 'next';
import { getProductsByCategory } from '@/services/getProducts';
import { locales } from '@/i18n/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://serceoceanu.com.pl';
  
  // Static pages
  const staticPages = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];
  
  // Localized static pages
  const localizedPages = locales.flatMap((locale) => [
    {
      url: `${siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/${locale}/catalogue`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/${locale}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/${locale}/delivery`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/${locale}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ]);
  
  // Product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getProductsByCategory();
    productPages = locales.flatMap((locale) =>
      products.map((product) => ({
        url: `${siteUrl}/${locale}/catalogue/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    );
  } catch (error) {
    console.error('Error generating product sitemap:', error);
  }
  
  return [...staticPages, ...localizedPages, ...productPages];
}
