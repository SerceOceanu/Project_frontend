import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://serceoceanu.com.pl';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/basket/success', '/success'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
