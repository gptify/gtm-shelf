'use client';

import { useState, useEffect } from 'react';
import { LeadRecord } from '@/lib/leads';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'unsubscribed'>('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredLeads = leads.filter((lead) => {
    if (filter === 'confirmed') return lead.confirmed_at && !lead.unsubscribed_at;
    if (filter === 'pending') return !lead.confirmed_at && !lead.unsubscribed_at;
    if (filter === 'unsubscribed') return lead.unsubscribed_at;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads & Double Opt-in List</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Finder tool recommendations and newsletter subscribers
          </p>
        </div>

        <div className="text-xs px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 font-medium">
          🛡️ Read-only verification. Bulk emailing disabled per privacy guidelines.
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {(['all', 'confirmed', 'pending', 'unsubscribed'] as const).map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
              filter === st
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {st} ({leads.filter((l) => {
              if (st === 'confirmed') return l.confirmed_at && !l.unsubscribed_at;
              if (st === 'pending') return !l.confirmed_at && !l.unsubscribed_at;
              if (st === 'unsubscribed') return l.unsubscribed_at;
              return true;
            }).length})
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)] font-semibold uppercase tracking-wider">
                <th scope="col" className="p-3.5">Email Address</th>
                <th scope="col" className="p-3.5">Source</th>
                <th scope="col" className="p-3.5">Double Opt-in Status</th>
                <th scope="col" className="p-3.5">Picks Attached</th>
                <th scope="col" className="p-3.5">Consent Recorded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--color-muted)]">
                    Loading subscriber records...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--color-muted)]">
                    No leads recorded under this status.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isConfirmed = Boolean(lead.confirmed_at);
                  const isUnsubscribed = Boolean(lead.unsubscribed_at);

                  return (
                    <tr key={lead.id} className="hover:bg-[var(--color-surface-2)]/40 transition-colors">
                      <td className="p-3.5 font-mono text-[var(--color-text)] font-medium">
                        {lead.email}
                      </td>
                      <td className="p-3.5 capitalize">{lead.source}</td>
                      <td className="p-3.5">
                        {isUnsubscribed ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                            Unsubscribed
                          </span>
                        ) : isConfirmed ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            ✓ Confirmed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Pending Opt-in
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {lead.pick_tool_ids && lead.pick_tool_ids.length > 0 ? (
                          <span className="font-semibold">{lead.pick_tool_ids.length} tools</span>
                        ) : (
                          <span className="text-[var(--color-muted)]">None</span>
                        )}
                      </td>
                      <td className="p-3.5 text-[var(--color-muted)]">
                        {new Date(lead.consent_at || lead.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
