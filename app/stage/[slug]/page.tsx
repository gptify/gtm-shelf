import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { STAGES, CATEGORIES, getStageBySlug, getToolsByStageId } from '@/lib/db/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ToolList } from '@/components/ToolList';

interface PageProps {
  params: { slug: string };
}

const STAGE_VERBS: Record<string, string> = {
  attract: 'attract visitors',
  prospect: 'find leads',
  engage: 'reach and convert leads',
  close: 'close deals',
  grow: 'grow revenue',
};

export async function generateStaticParams() {
  return STAGES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const stage = getStageBySlug(params.slug);
  if (!stage) return {};

  const tools = await getToolsByStageId(stage.id);
  const verb = STAGE_VERBS[stage.slug] || 'grow';
  const stageCats = CATEGORIES.filter((c) => c.stage_id === stage.id).map((c) => c.name);
  const title = `AI tools to ${verb} (${tools.length} tools)`;
  const description = `The ${tools.length} AI tools in the ${stage.name} stage of the sales and marketing funnel: ${stageCats.join(', ')}.`;

  return {
    title,
    description: description.slice(0, 155),
    alternates: {
      canonical: `/stage/${stage.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/stage/${stage.slug}`,
      siteName: 'GTM Shelf',
    },
  };
}

export default async function StagePage({ params }: PageProps) {
  const stage = getStageBySlug(params.slug);
  if (!stage) notFound();

  const tools = await getToolsByStageId(stage.id);
  const stageCats = CATEGORIES.filter((c) => c.stage_id === stage.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${stage.name} AI Tools`,
    itemListElement: tools.map((t, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: t.name,
      url: `https://gtmshelf.com/tools/${t.slug}`,
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://gtmshelf.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: stage.name,
        item: `https://gtmshelf.com/stage/${stage.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="wrap" id="main-content">
        <Header />

        <main className="page">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{stage.name}</li>
            </ol>
          </nav>

          <h1 style={{ margin: '0 0 12px' }}>{`${stage.name} tools`}</h1>
          <p className="lede">
            Stage {stage.id} of the sales and marketing funnel: {stage.hint}. {tools.length} curated AI tools.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '20px 0 32px' }}>
            <span style={{ fontWeight: 600, alignSelf: 'center', marginRight: '6px' }}>Categories:</span>
            {stageCats.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="chip"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div style={{ borderTop: '1.5px solid var(--ink)', paddingTop: '16px' }}>
            <ul className="list">
              {tools.map((tool) => (
                <li key={tool.id} className="row">
                  <div
                    className="mono"
                    style={{ '--h': 210 } as React.CSSProperties}
                    aria-hidden="true"
                  >
                    {tool.name.charAt(0)}
                  </div>
                  <div className="main">
                    <h3>
                      <Link href={`/tools/${tool.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {tool.name}
                      </Link>
                      {tool.featured && <span className="badge">Featured</span>}
                    </h3>
                    <p className="tag">{tool.tagline}</p>
                    <div className="chips">
                      <span className="chip st">{tool.stage_name}</span>
                      <span className="chip">{tool.category_name}</span>
                      {tool.integrations.length > 0 && (
                        <span className="works">
                          Works with {tool.integrations.slice(0, 3).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="side">
                    <span className="price">{tool.price_note || tool.pricing_model}</span>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="btn btn-ghost"
                      style={{ fontSize: '0.875rem', padding: '6px 14px' }}
                    >
                      Details
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>

      <Footer stages={STAGES} />
    </>
  );
}
