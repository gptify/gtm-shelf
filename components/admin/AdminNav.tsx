'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  const tabs = [
    { name: 'Tools', href: '/admin/tools' },
    { name: 'Submissions', href: '/admin/submissions' },
    { name: 'Custom Requests', href: '/admin/custom-requests' },
    { name: 'Leads', href: '/admin/leads' },
    { name: 'Guides', href: '/admin/guides' },
  ];

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link href="/admin/tools" className="font-bold text-lg flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[var(--color-primary)] text-white text-xs flex items-center justify-center font-black">
                G
              </span>
              <span>GTM Shelf <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-surface-2)] text-[var(--color-muted)] font-mono font-normal">ADMIN</span></span>
            </Link>

            <nav className="hidden md:flex space-x-1" aria-label="Admin Navigation">
              {tabs.map((tab) => {
                const active = pathname === tab.href || (tab.href === '/admin/tools' && pathname === '/admin');
                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[var(--color-surface-2)] text-[var(--color-text)] font-semibold'
                        : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {tab.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] flex items-center gap-1 font-medium"
            >
              <span>Live directory</span>
              <span>↗</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors font-medium text-[var(--color-muted)]"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex overflow-x-auto border-t border-[var(--color-border)] px-4 py-2 space-x-2">
        {tabs.map((tab) => {
          const active = pathname === tab.href || (tab.href === '/admin/tools' && pathname === '/admin');
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${
                active
                  ? 'bg-[var(--color-surface-2)] text-[var(--color-text)] font-semibold'
                  : 'text-[var(--color-muted)]'
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
