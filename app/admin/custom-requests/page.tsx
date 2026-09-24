'use client';

import { useState, useEffect } from 'react';
import { AdminCustomRequest } from '@/lib/admin-store';

export default function AdminCustomRequestsPage() {
  const [requests, setRequests] = useState<AdminCustomRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  async function fetchRequests() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/custom-requests?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Failed to load custom requests:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const res = await fetch('/api/admin/custom-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setActionNotice(`Status updated to ${newStatus}`);
        fetchRequests();
      }
    } catch {
      setActionNotice('Failed to update status.');
    }
  }

  async function handleSaveNote(id: string) {
    try {
      const res = await fetch('/api/admin/custom-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, internal_note: noteText }),
      });
      if (res.ok) {
        setActionNotice('Internal note saved.');
        setEditingNoteId(null);
        fetchRequests();
      }
    } catch {
      setActionNotice('Failed to save note.');
    }
  }

  function exportCsv() {
    const headers = ['ID', 'Name', 'Email', 'Requirements', 'Tools Used', 'Team Size', 'Budget', 'Timing', 'Language', 'Status', 'Date', 'Internal Note'];
    const rows = requests.map((r) => [
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      r.email,
      `"${r.what.replace(/"/g, '""')}"`,
      `"${(r.tools_used || '').replace(/"/g, '""')}"`,
      r.team_size || '',
      r.budget || '',
      r.timing || '',
      r.language || '',
      r.status,
      r.created_at,
      `"${(r.internal_note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gtm-shelf-custom-requests-${statusFilter}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Custom Build Requests</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Bespoke workflow requests from the finder and direct submissions
          </p>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors self-start sm:self-auto"
        >
          Export CSV
        </button>
      </div>

      {actionNotice && (
        <div className="p-3 rounded-lg bg-[var(--color-stage-prospect-tint,#e6f4ea)] border border-[var(--color-success,#137333)]/30 text-xs text-[var(--color-success,#137333)] flex items-center justify-between font-medium">
          <span>{actionNotice}</span>
          <button type="button" onClick={() => setActionNotice(null)} className="ml-2 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {['all', 'new', 'contacted', 'in_progress', 'completed', 'declined', 'spam'].map((st) => (
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

      {/* Requests List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-sm text-[var(--color-muted)] border border-dashed border-[var(--color-border)] rounded-xl">
            Loading custom requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-sm text-[var(--color-muted)] border border-dashed border-[var(--color-border)] rounded-xl">
            No custom requests in this status view.
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="p-5 sm:p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
                <div>
                  <h3 className="text-lg font-bold">{req.name}</h3>
                  <a href={`mailto:${req.email}`} className="text-xs text-[var(--color-primary)] hover:underline font-mono">
                    {req.email}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--color-muted)]">
                    {new Date(req.created_at).toLocaleDateString()}
                  </span>
                  <select
                    value={req.status}
                    onChange={(e) => handleStatusChange(req.id, e.target.value)}
                    className="p-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs font-semibold"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="declined">Declined</option>
                    <option value="spam">Spam</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs space-y-2">
                <span className="font-bold text-[var(--color-muted)] uppercase tracking-wider block text-[10px]">
                  Requirements
                </span>
                <p className="text-[var(--color-text)] leading-relaxed whitespace-pre-wrap">
                  {req.what}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[var(--color-muted)] block font-semibold">Team Size:</span>
                  <span>{req.team_size || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[var(--color-muted)] block font-semibold">Budget:</span>
                  <span>{req.budget || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[var(--color-muted)] block font-semibold">Timing:</span>
                  <span>{req.timing || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[var(--color-muted)] block font-semibold">Language:</span>
                  <span>{req.language || 'English'}</span>
                </div>
              </div>

              {req.tools_used && (
                <div className="text-xs">
                  <span className="text-[var(--color-muted)] font-semibold">Current Tools: </span>
                  <span>{req.tools_used}</span>
                </div>
              )}

              {/* Internal Notes Section */}
              <div className="pt-3 border-t border-[var(--color-border)] text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[var(--color-muted)] uppercase tracking-wider text-[10px]">
                    Internal Editorial Note
                  </span>
                  {editingNoteId !== req.id && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNoteId(req.id);
                        setNoteText(req.internal_note || '');
                      }}
                      className="text-[var(--color-primary)] font-semibold text-[11px] hover:underline"
                    >
                      {req.internal_note ? 'Edit note' : '+ Add note'}
                    </button>
                  )}
                </div>

                {editingNoteId === req.id ? (
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                      placeholder="Add internal notes about communication, estimate, or assignment..."
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingNoteId(null)}
                        className="px-2.5 py-1 rounded border border-[var(--color-border)] text-[11px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveNote(req.id)}
                        className="px-3 py-1 rounded bg-[var(--color-primary)] text-white text-[11px] font-semibold"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[var(--color-muted)] italic">
                    {req.internal_note || 'No internal note recorded.'}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
