'use client';

import { useState, useEffect } from 'react';
import { AdminTool, ToolSource } from '@/lib/admin-store';
import { PricingModel, ToolStatus } from '@/lib/types';
import taxonomy from '@/starter/content/taxonomy.json';

export default function AdminToolsPage() {
  const [tools, setTools] = useState<AdminTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingTool, setEditingTool] = useState<AdminTool | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // New source inputs for editing modal
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceLabel, setNewSourceLabel] = useState('');

  useEffect(() => {
    fetchTools();
  }, [statusFilter]);

  async function fetchTools() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tools?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setTools(data.tools || []);
      }
    } catch (err) {
      console.error('Failed to load tools:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredTools = tools.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.domain.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q)
    );
  });

  async function handleMarkVerified(tool: AdminTool) {
    try {
      const res = await fetch('/api/admin/tools/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tool.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionNotice(`Stamped verified for ${tool.name}`);
        if (editingTool && editingTool.id === tool.id) {
          setEditingTool((prev) => (prev ? { ...prev, verified_at: data.tool.verified_at, verified_by: 'admin' } : null));
        }
        fetchTools();
      }
    } catch {
      setActionNotice('Failed to mark verified.');
    }
  }

  async function handleSaveTool(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTool) return;

    setSaving(true);
    setSaveError(null);

    try {
      const res = await fetch('/api/admin/tools', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTool),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save tool');
      }

      setActionNotice(`Successfully updated ${editingTool.name}`);
      setEditingTool(null);
      fetchTools();
    } catch (err: unknown) {
      const error = err as Error;
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  }

  function handleAddSource() {
    if (!newSourceUrl.trim() || !editingTool) return;
    const updatedSources: ToolSource[] = [
      ...(editingTool.sources || []),
      { url: newSourceUrl.trim(), label: newSourceLabel.trim() || 'Official documentation' },
    ];
    setEditingTool({ ...editingTool, sources: updatedSources });
    setNewSourceUrl('');
    setNewSourceLabel('');
  }

  function handleRemoveSource(index: number) {
    if (!editingTool) return;
    const updated = [...editingTool.sources];
    updated.splice(index, 1);
    setEditingTool({ ...editingTool, sources: updated });
  }

  function exportCsv() {
    const headers = ['ID', 'Slug', 'Name', 'Domain', 'Stage', 'Category', 'Pricing', 'Status', 'Verified At', 'Sources Count'];
    const rows = filteredTools.map((t) => [
      t.id,
      t.slug,
      `"${t.name.replace(/"/g, '""')}"`,
      t.domain,
      t.stage_name,
      t.category_name,
      t.pricing_model,
      t.status,
      t.verified_at || 'Unverified',
      t.sources?.length || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gtm-shelf-tools-${statusFilter}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tools Directory</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Manage listings, verification status, and source URL audits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportCsv}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors"
          >
            Export CSV
          </button>
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['all', 'published', 'draft', 'pending', 'rejected', 'archived'].map((st) => (
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

        <div className="relative">
          <input
            type="text"
            placeholder="Search tools by name, domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* Tools Table */}
      <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)] font-semibold uppercase tracking-wider">
                <th scope="col" className="p-3.5">Tool</th>
                <th scope="col" className="p-3.5">Stage & Category</th>
                <th scope="col" className="p-3.5">Pricing</th>
                <th scope="col" className="p-3.5">Sources</th>
                <th scope="col" className="p-3.5">Verification</th>
                <th scope="col" className="p-3.5">Status</th>
                <th scope="col" className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[var(--color-muted)]">
                    Loading tools...
                  </td>
                </tr>
              ) : filteredTools.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[var(--color-muted)]">
                    No tools match the selected status or search filter.
                  </td>
                </tr>
              ) : (
                filteredTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-[var(--color-surface-2)]/40 transition-colors">
                    <td className="p-3.5 font-medium text-[var(--color-text)]">
                      <div className="font-bold text-sm text-[var(--color-text)]">{tool.name}</div>
                      <div className="text-[var(--color-muted)] font-mono text-[11px]">{tool.domain}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-medium text-[var(--color-text)]">{tool.stage_name}</span>
                      <span className="text-[var(--color-muted)] block">{tool.category_name}</span>
                    </td>
                    <td className="p-3.5 capitalize font-medium">{tool.pricing_model.replace('_', ' ')}</td>
                    <td className="p-3.5">
                      {tool.sources && tool.sources.length > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[11px] bg-[var(--color-stage-prospect-tint,#e6f4ea)] text-[var(--color-success,#137333)] font-semibold">
                          {tool.sources.length} {tool.sources.length === 1 ? 'URL' : 'URLs'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-semibold">
                          0 URLs
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {tool.verified_at ? (
                        <span className="text-[11px] text-[var(--color-success,#137333)] font-semibold">
                          ✓ {new Date(tool.verified_at).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          tool.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : tool.status === 'draft'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}
                      >
                        {tool.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {!tool.verified_at && (
                        <button
                          type="button"
                          onClick={() => handleMarkVerified(tool)}
                          className="px-2 py-1 rounded bg-[var(--color-surface-2)] text-[var(--color-text)] hover:bg-[var(--color-border)] text-[11px] font-semibold"
                        >
                          Mark verified
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTool({ ...tool, sources: tool.sources || [] });
                          setSaveError(null);
                        }}
                        className="px-2.5 py-1 rounded bg-[var(--color-primary)] text-white hover:opacity-90 text-[11px] font-semibold"
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

      {/* Edit Tool Modal */}
      {editingTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl max-w-2xl w-full p-6 sm:p-8 my-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)] mb-6">
              <div>
                <h2 className="text-xl font-bold">Edit Tool: {editingTool.name}</h2>
                <p className="text-xs text-[var(--color-muted)] mt-0.5">slug: {editingTool.slug}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingTool(null)}
                className="text-[var(--color-muted)] hover:text-[var(--color-text)] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {saveError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 font-semibold leading-relaxed">
                ⚠️ {saveError}
              </div>
            )}

            <form onSubmit={handleSaveTool} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    value={editingTool.name}
                    onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Website URL</label>
                  <input
                    type="url"
                    value={editingTool.website_url}
                    onChange={(e) => setEditingTool({ ...editingTool, website_url: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">One-line Tagline</label>
                <input
                  type="text"
                  value={editingTool.tagline}
                  onChange={(e) => setEditingTool({ ...editingTool, tagline: e.target.value })}
                  className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingTool.description}
                  onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                  className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Funnel Stage</label>
                  <select
                    value={editingTool.stage_id}
                    onChange={(e) => {
                      const sid = Number(e.target.value);
                      const st = taxonomy.stages.find((s) => s.id === sid);
                      setEditingTool({
                        ...editingTool,
                        stage_id: sid,
                        stage_name: st?.name || editingTool.stage_name,
                      });
                    }}
                    className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                  >
                    {taxonomy.stages.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Pricing Model</label>
                  <select
                    value={editingTool.pricing_model}
                    onChange={(e) => setEditingTool({ ...editingTool, pricing_model: e.target.value as PricingModel })}
                    className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                  >
                    <option value="free_plan">Free plan</option>
                    <option value="paid">Paid</option>
                    <option value="custom_quote">Custom quote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Status</label>
                  <select
                    value={editingTool.status}
                    onChange={(e) => setEditingTool({ ...editingTool, status: e.target.value as ToolStatus })}
                    className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-xs font-semibold"
                  >
                    <option value="draft">Draft (unverified/hidden)</option>
                    <option value="pending">Pending review</option>
                    <option value="published">Published (live)</option>
                    <option value="rejected">Rejected</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Source URLs (Required for publish) */}
              <div className="pt-3 border-t border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold">
                    Source URLs <span className="text-red-500">*</span> (Mandatory for publication)
                  </label>
                  <span className="text-[11px] text-[var(--color-muted)]">
                    {editingTool.sources?.length || 0} attached
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {editingTool.sources && editingTool.sources.length > 0 ? (
                    editingTool.sources.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-[var(--color-surface-2)] text-xs">
                        <div className="truncate mr-2">
                          <span className="font-semibold">{s.label || 'Doc'}: </span>
                          <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] underline">
                            {s.url}
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSource(idx)}
                          className="text-red-500 hover:text-red-700 font-bold px-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[var(--color-muted)] italic">
                      No source URLs recorded yet. The database blocks publishing until at least one verified source URL is provided.
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://vendor.com/pricing"
                    value={newSourceUrl}
                    onChange={(e) => setNewSourceUrl(e.target.value)}
                    className="flex-1 p-2 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Label (e.g. Pricing page)"
                    value={newSourceLabel}
                    onChange={(e) => setNewSourceLabel(e.target.value)}
                    className="w-36 p-2 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddSource}
                    className="px-3 py-1 rounded bg-[var(--color-surface-2)] text-xs font-semibold hover:bg-[var(--color-border)]"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Verification Stamp info */}
              <div className="p-3 rounded-lg bg-[var(--color-surface-2)]/60 border border-[var(--color-border)] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold block">Verification Audit:</span>
                  <span className="text-[11px] text-[var(--color-muted)]">
                    {editingTool.verified_at
                      ? `Verified at ${new Date(editingTool.verified_at).toLocaleDateString()} by ${editingTool.verified_by || 'admin'}`
                      : 'Unverified (Cannot publish without verification timestamp)'}
                  </span>
                </div>
                {!editingTool.verified_at ? (
                  <button
                    type="button"
                    onClick={() => handleMarkVerified(editingTool)}
                    className="px-3 py-1.5 rounded bg-[var(--color-success,#137333)] text-white text-xs font-semibold"
                  >
                    Mark Verified Now
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditingTool({ ...editingTool, verified_at: null, verified_by: null })}
                    className="text-xs text-[var(--color-muted)] hover:text-red-500"
                  >
                    Clear verification
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setEditingTool(null)}
                  className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-[var(--color-primary)] text-white text-xs font-semibold hover:opacity-95 disabled:opacity-50"
                >
                  {saving ? 'Saving changes...' : 'Save Tool Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
