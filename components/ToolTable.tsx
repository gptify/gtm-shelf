'use client';

import { ToolPublic } from '@/lib/types';
import { hue, initial, pricingLabel, setupShort } from '@/lib/utils';

interface ToolTableProps {
  tools: ToolPublic[];
  savedTools: Set<string>;
  onToggleSave: (toolName: string) => void;
  onOpenTool: (tool: ToolPublic) => void;
  sortBy: string;
  sortDir: number; // 1 for asc, -1 for desc
  onHeaderSort: (key: string) => void;
}

const COLS: [string, string][] = [
  ['name', 'Tool'],
  ['stage', 'Funnel stage'],
  ['cat', 'Category'],
  ['price', 'Pricing'],
  ['setup', 'Setup'],
];

export function ToolTable({
  tools,
  savedTools,
  onToggleSave,
  onOpenTool,
  sortBy,
  sortDir,
  onHeaderSort,
}: ToolTableProps) {
  return (
    <div className="tw">
      <table className="dt">
        <caption className="sr">Tools. Use the column headings to sort.</caption>
        <thead>
          <tr>
            {COLS.map(([key, label]) => {
              const isActive = sortBy === key;
              const ariaSort = isActive
                ? sortDir > 0
                  ? 'ascending'
                  : 'descending'
                : 'none';
              const arrow = isActive ? (sortDir > 0 ? ' ↑' : ' ↓') : '';

              return (
                <th key={key} scope="col" aria-sort={ariaSort}>
                  <button
                    type="button"
                    className="sortb"
                    onClick={() => onHeaderSort(key)}
                  >
                    {label}
                    <span className="arr" aria-hidden="true">
                      {arrow}
                    </span>
                  </button>
                </th>
              );
            })}
            <th scope="col">Works with</th>
            <th scope="col">
              <span className="sr">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool) => {
            const isSaved = savedTools.has(tool.name);
            const intCount = tool.integrations.length;
            const worksText = intCount > 0 ? (
              <>
                {tool.integrations.slice(0, 2).join(', ')}
                {intCount > 2 && <span className="dim"> +{intCount - 2}</span>}
              </>
            ) : (
              <span className="dim">None listed</span>
            );

            return (
              <tr
                key={tool.id}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (!target.closest('a, button')) {
                    onOpenTool(tool);
                  }
                }}
              >
                <td>
                  <div className="tcell">
                    <div
                      className="mono"
                      style={{ '--h': hue(tool.name) } as React.CSSProperties}
                      aria-hidden="true"
                    >
                      {initial(tool.name)}
                    </div>
                    <div>
                      <button
                        type="button"
                        className="tname"
                        onClick={() => onOpenTool(tool)}
                      >
                        {tool.name}
                      </button>
                      {tool.featured && <span className="badge">Featured</span>}
                      {tool.sponsored && <span className="badge">Sponsored</span>}
                      <div className="ttag">{tool.tagline}</div>
                    </div>
                  </div>
                </td>
                <td>{tool.stage_name}</td>
                <td>{tool.category_name}</td>
                <td>{pricingLabel(tool.pricing_model)}</td>
                <td>
                  {tool.setup_effort ? (
                    setupShort(tool.setup_effort)
                  ) : (
                    <span className="dim">Not rated</span>
                  )}
                </td>
                <td>{worksText}</td>
                <td className="act">
                  <a
                    className="vis"
                    href={tool.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit<span className="sr"> {tool.name}</span>
                  </a>
                  <button
                    type="button"
                    className="save"
                    aria-pressed={isSaved}
                    aria-label={`Save ${tool.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(tool.name);
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
