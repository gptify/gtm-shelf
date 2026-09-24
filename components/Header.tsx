'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  onOpenSubmit?: () => void;
}

export function Header({ onOpenSubmit }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="top">
      <Link href="/" className="brand" aria-label="GTM Shelf home">
        <svg width="28" height="24" viewBox="0 0 28 24" fill="none" aria-hidden="true">
          <rect x="0" y="8" width="8" height="12" rx="2" fill="var(--brand)" />
          <path
            d="M2.5 13.5L4.5 15.5L7 11.5"
            stroke="var(--brand-ink)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="10" y="4" width="8" height="16" rx="2" fill="var(--brand)" fillOpacity="0.4" />
          <rect x="20" y="0" width="8" height="20" rx="2" fill="var(--brand)" fillOpacity="0.2" />
          <line x1="0" y1="23" x2="28" y2="23" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>
          <b>GTM</b> Shelf
        </span>
      </Link>

      <nav className="nav" aria-label="Primary">
        <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>
          Tools
        </Link>
        <Link href="/guides" aria-current={pathname.startsWith('/guides') ? 'page' : undefined}>
          Guides
        </Link>
        <Link href="/find" aria-current={pathname === '/find' ? 'page' : undefined}>
          Find my tools
        </Link>
        <Link href="/free-tools" aria-current={pathname === '/free-tools' ? 'page' : undefined}>
          Free Tools
        </Link>
      </nav>

      {onOpenSubmit ? (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenSubmit}
        >
          Submit a tool
        </button>
      ) : (
        <Link href="/submit" className="btn btn-primary">
          Submit a tool
        </Link>
      )}
    </header>
  );
}
