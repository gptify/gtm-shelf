'use client';

import { useState, useEffect } from 'react';
import { AdminSubmission } from '@/lib/admin-store';
import Link from 'next/link';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  async function fetchSubmissions() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: string, action: 'accept' | 'reject' | 'spam') {
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionNotice(
          action === 'accept'
            ? `Submission accepted! Created new draft tool (${data.tool?.name}).`
            : `Submission marked as ${action}.`
        );
        fetchSubmissions();
      }
    } catch {
      setActionNotice('Failed to update submission.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Submissions Queue</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Review community and vendor suggestions before adding them as draft tools
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

      {/* Status Filter */}
      <div className="flex items-center gap-2 overflow-x-auto p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {['all', 'new', 'accepted', 'rejected', 'spam'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
              statusFilter === st
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-sm text-[var(--color-muted)] border border-dashed border-[var(--color-border)] rounded-xl">
            Loading submissions...
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center text-sm text-[var(--color-muted)] border border-dashed border-[var(--color-border)] rounded-xl">
            No submissions in this filter queue.
          </div>
        ) : (
          submissions.map((sub) => (
            <div
              key={sub.id}
              className="p-5 sm:p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{sub.name}</h3>
                  <a
                    href={sub.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--color-primary)] hover:underline"
                  >
                    {sub.website_url} ↗
                  </a>
                  {sub.is_vendor && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      Vendor Rep
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-muted)]">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      sub.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : sub.status === 'new'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-zinc-100 text-zinc-800'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[var(--color-muted)] block font-semibold">Category:</span>
                  <span>{sub.category_name || 'Not categorized'}</span>
                </div>
                <div>
                  <span className="text-[var(--color-muted)] block font-semibold">Pricing:</span>
                  <span>{sub.pricing_model}</span>
                </div>
                <div>
                  <span className="text-[var(--color-muted)] block font-semibold">Submitter Contact:</span>
                  <span className="font-mono">{sub.contact_email}</span>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <p className="font-semibold text-[var(--color-text)]">Summary: {sub.tagline}</p>
                {sub.description && (
                  <p className="text-[var(--color-muted)] leading-relaxed">{sub.description}</p>
                )}
              </div>

              {sub.status === 'new' && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => handleAction(sub.id, 'spam')}
                    className="px-3 py-1.5 rounded text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    Mark Spam
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(sub.id, 'reject')}
                    className="px-3 py-1.5 rounded text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-surface-2)]"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(sub.id, 'accept')}
                    className="px-4 py-1.5 rounded bg-[var(--color-primary)] text-white text-xs font-semibold hover:opacity-95"
                  >
                    Accept as Draft Tool →
                  </button>
                </div>
              )}

              {sub.status === 'accepted' && sub.tool_id && (
                <div className="text-xs text-[var(--color-success,#137333)] font-medium pt-1">
                  ✓ Converted to draft tool. View in <Link href="/admin/tools" className="underline font-bold">Tools Directory</Link> to audit sources and verify.
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
