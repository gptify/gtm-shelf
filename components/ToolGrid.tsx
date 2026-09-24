'use client';

import { ToolPublic } from '@/lib/types';
import { hue, initial, pricingLabel, setupLabel } from '@/lib/utils';

interface ToolGridProps {
  tools: ToolPublic[];
  savedTools: Set<string>;
  onToggleSave: (toolName: string) => void;
  onOpenTool: (tool: ToolPublic) => void;
}

export function ToolGrid({
  tools,
  savedTools,
  onToggleSave,
  onOpenTool,
}: ToolGridProps) {
  return (
    <ul className="tgrid">
      {tools.map((tool) => {
        const isSaved = savedTools.has(tool.name);

        return (
          <li key={tool.id} className="card">
            <div className="card-top">
              <div
                className="mono"
                style={{ '--h': hue(tool.name) } as React.CSSProperties}
                aria-hidden="true"
              >
                {initial(tool.name)}
              </div>
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
            </div>

            <h3>
              <button
                type="button"
                className="open"
                onClick={() => onOpenTool(tool)}
              >
                {tool.name}
              </button>
              {tool.featured && <span className="badge">Featured</span>}
              {tool.sponsored && <span className="badge">Sponsored</span>}
            </h3>

            <p className="tag">{tool.tagline}</p>

            <div className="chips">
              <span className="chip st">{tool.stage_name}</span>
              <span className="chip">{tool.category_name}</span>
            </div>

            <div className="card-foot">
              <span className="price">{pricingLabel(tool.pricing_model)}</span>
              {tool.setup_effort && (
                <span className="setup">{setupLabel(tool.setup_effort)}</span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
