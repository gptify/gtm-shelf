'use client';

import { useState, useEffect } from 'react';
import { Guide } from '@/lib/types';
import Link from 'next/link';

interface GuideWithStatus extends Guide {
  published: boolean;
}

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<GuideWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGuide, setEditingGuide] = useState<GuideWithStatus | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGuides();
  }, []);

  async function fetchGuides() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/guides');
      if (res.ok) {
        const data = await res.json();
        setGuides(data.guides || []);
      }
    } catch (err) {
      console.error('Failed to load guides:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleTogglePublish(guide: GuideWithStatus) {
    try {
      const res = await fetch('/api/admin/guides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: guide.slug, published: !guide.published }),
      });
      if (res.ok) {
        setActionNotice(`Updated publish status for "${guide.title}"`);
        fetchGuides();
      }
    } catch {
      setActionNotice('Failed to update guide status.');
    }
  }

  async function handleSaveGuide(e: React.FormEvent) {
    e.preventDefault();
    if (!editingGuide) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/guides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGuide),
      });

      if (res.ok) {
        setActionNotice(`Successfully saved changes to "${editingGuide.title}"`);
        setEditingGuide(null);
        fetchGuides();
      }
    } catch {
      setActionNotice('Failed to save guide.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Guides Management</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Edit guide editorial content, filter criteria, and publication status
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 rounded-lg bg-[var(--color-stage-prospect-tint,#e6f4ea)] border border-[var(--color-success,#137333)]/30 text-xs text-[var(--color-success,#137333)] flex items-center justify-between font-medium">
          <span>{actionNotice}</span>
          <button type="button" onClick={() => setActionNotice(null)} className="ml-2 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Guides Table */}
      <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)] font-semibold uppercase tracking-wider">
                <th scope="col" className="p-3.5">Guide</th>
                <th scope="col" className="p-3.5">Type</th>
                <th scope="col" className="p-3.5">Category / Tools</th>
                <th scope="col" className="p-3.5">Publication</th>
                <th scope="col" className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--color-muted)]">
                    Loading guides...
                  </td>
                </tr>
              ) : guides.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--color-muted)]">
                    No guides found.
                  </td>
                </tr>
              ) : (
                guides.map((guide) => (
                  <tr key={guide.slug} className="hover:bg-[var(--color-surface-2)]/40 transition-colors">
                    <td className="p-3.5 font-medium text-[var(--color-text)]">
                      <div className="font-bold text-sm">{guide.title}</div>
                      <div className="text-[var(--color-muted)] font-mono text-[11px]">/guides/{guide.slug}</div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          guide.type === 'vs'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {guide.type === 'vs' ? 'Comparison' : 'Buyer Guide'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {guide.type === 'vs' ? (
                        <span>{guide.a} vs {guide.b}</span>
                      ) : (
                        <span>{guide.cat || 'General'}</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(guide)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                          guide.published
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                      >
                        {guide.published ? '✓ Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <Link
                        href={`/guides/${guide.slug}`}
                        target="_blank"
                        className="px-2.5 py-1 rounded border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] text-[11px] font-medium"
                      >
                        View ↗
                      </Link>
                      <button
                        type="button"
                        onClick={() => setEditingGuide(guide)}
                        className="px-3 py-1 rounded bg-[var(--color-primary)] text-white hover:opacity-90 text-[11px] font-semibold"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Guide Modal */}
      {editingGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl max-w-2xl w-full p-6 sm:p-8 my-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)] mb-6">
              <div>
                <h2 className="text-xl font-bold">Edit Guide: {editingGuide.title}</h2>
                <p className="text-xs text-[var(--color-muted)] mt-0.5">slug: {editingGuide.slug}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingGuide(null)}
                className="text-[var(--color-muted)] hover:text-[var(--color-text)] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGuide} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={editingGuide.title}
                  onChange={(e) => setEditingGuide({ ...editingGuide, title: e.target.value })}
                  className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description (Meta summary)</label>
                <input
                  type="text"
                  value={editingGuide.desc}
                  onChange={(e) => setEditingGuide({ ...editingGuide, desc: e.target.value })}
                  className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Introductory Text</label>
                <textarea
                  rows={3}
                  value={editingGuide.intro || ''}
                  onChange={(e) => setEditingGuide({ ...editingGuide, intro: e.target.value })}
                  className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                />
              </div>

              {editingGuide.type === 'best' && (
                <div>
                  <label className="block text-xs font-semibold mb-1">Evaluation Criteria Note</label>
                  <input
                    type="text"
                    value={editingGuide.crit || ''}
                    onChange={(e) => setEditingGuide({ ...editingGuide, crit: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs font-mono"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="guide_published"
                  checked={editingGuide.published}
                  onChange={(e) => setEditingGuide({ ...editingGuide, published: e.target.checked })}
                  className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)]"
                />
                <label htmlFor="guide_published" className="text-xs font-semibold">
                  Published on public site
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setEditingGuide(null)}
                  className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-[var(--color-primary)] text-white text-xs font-semibold hover:opacity-95 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Guide Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
