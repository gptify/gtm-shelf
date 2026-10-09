import Link from 'next/link';
import { Stage } from '@/lib/types';
import { STAGES } from '@/lib/db/data';

interface FooterProps {
  stages?: Stage[];
}

export function Footer({ stages = STAGES }: FooterProps) {
  return (
    <footer className="foot">
      <div className="wrap">
        <div>
          <p style={{ lineHeight: 1.6 }}>
            <strong>GTM Shelf</strong> is an independent directory of AI tools for sales and marketing teams.
          </p>
          <p style={{ marginTop: '8px', fontSize: '0.8125rem' }}>
            Rankings are editorial. Paid placements never affect finder results or organic order. Some links may be affiliate links; GTMShelf may earn a commission from qualifying purchases at no additional cost to you. Commercial relationships do not determine our independent recommendations.
          </p>
        </div>

        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 20px', alignItems: 'center' }} aria-label="Footer navigation">
          {stages.map((s) => (
            <Link key={s.id} href={`/stage/${s.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {s.name}
            </Link>
          ))}
          <Link href="/build-my-stack" style={{ color: 'inherit', textDecoration: 'none' }}>
            Build My Stack
          </Link>
          <Link href="/use-cases" style={{ color: 'inherit', textDecoration: 'none' }}>
            Use Cases
          </Link>
          <Link href="/stacks" style={{ color: 'inherit', textDecoration: 'none' }}>
            Stacks
          </Link>
          <Link href="/guides" style={{ color: 'inherit', textDecoration: 'none' }}>
            Guides
          </Link>
          <Link href="/free-tools" style={{ color: 'inherit', textDecoration: 'none' }}>
            Free Tools
          </Link>
          <Link href="/partners" style={{ color: 'inherit', textDecoration: 'none' }}>
            Partners
          </Link>
          <Link href="/gptify" style={{ color: 'inherit', textDecoration: 'none' }}>
            GPTify Readers
          </Link>
          <Link href="/custom" style={{ color: 'inherit', textDecoration: 'none' }}>
            Talk to us
          </Link>
          <Link href="/advertise" style={{ color: 'inherit', textDecoration: 'none' }}>
            Advertise
          </Link>
          <a
            href="https://gptify.co/newsletter-and-resources-2/?utm_source=gtmshelf&utm_medium=footer&utm_campaign=newsletter"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Newsletter ↗
          </a>
          <Link href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>
            About
          </Link>
          <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>
            Privacy
          </Link>
          <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>
            Terms
          </Link>
          <Link href="/imprint" style={{ color: 'inherit', textDecoration: 'none' }}>
            Imprint
          </Link>
        </nav>
      </div>
    </footer>
  );
}
