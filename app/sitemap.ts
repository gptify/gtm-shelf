import { MetadataRoute } from 'next';
import { getTools, STAGES, CATEGORIES } from '@/lib/db/data';
import guidesData from '@/starter/content/guides.json';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gtmshelf.com';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/find',
    '/custom',
    '/submit',
    '/guides',
    '/free-tools',
    '/roi-calculator',
    '/ai-readiness',
    '/advertise',
    '/about',
    '/privacy',
    '/terms',
    '/imprint',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const stageRoutes: MetadataRoute.Sitemap = STAGES.map((s) => ({
    url: `${baseUrl}/stage/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const tools = await getTools();
  const toolRoutes: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${baseUrl}/tools/${t.slug}`,
    lastModified: t.verified_at ? new Date(t.verified_at) : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guidesData.map((g) => ({
    url: `${baseUrl}/guides/${g.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...stageRoutes,
    ...categoryRoutes,
    ...toolRoutes,
    ...guideRoutes,
  ];
}
