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
          <p>
            <strong>GTM Shelf</strong> is an independent directory of AI tools for sales and marketing teams. Run by <a href="https://gptify.co" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, color: 'inherit', textDecoration: 'underline' }}>GPTify.co</a>.
          </p>
          <p style={{ marginTop: '8px', fontSize: '0.8125rem' }}>
            Rankings are editorial. Paid placements never affect finder results or organic order.
          </p>
        </div>

        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 24px', alignItems: 'center' }} aria-label="Footer navigation">
          {stages.map((s) => (
            <Link key={s.id} href={`/stage/${s.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {s.name}
            </Link>
          ))}
          <Link href="/guides" style={{ color: 'inherit', textDecoration: 'none' }}>
            Guides
          </Link>
          <Link href="/free-tools" style={{ color: 'inherit', textDecoration: 'none' }}>
            Free Tools
          </Link>
          <Link href="/custom" style={{ color: 'inherit', textDecoration: 'none' }}>
            Custom build
          </Link>
          <Link href="/advertise" style={{ color: 'inherit', textDecoration: 'none' }}>
            Advertise
          </Link>
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
