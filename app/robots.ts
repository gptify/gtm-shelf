import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV?.includes('preview');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gtmshelf.com';

  if (!isProduction) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/out/', '/*?*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
