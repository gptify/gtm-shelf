'use client';

import { ToolPublic } from '@/lib/types';
import { hue, initial, pricingLabel } from '@/lib/utils';

interface ToolListProps {
  tools: ToolPublic[];
  savedTools: Set<string>;
  onToggleSave: (toolName: string) => void;
  onOpenTool: (tool: ToolPublic) => void;
}

export function ToolList({
  tools,
  savedTools,
  onToggleSave,
  onOpenTool,
}: ToolListProps) {
  return (
    <ul className="list">
      {tools.map((tool) => {
        const isSaved = savedTools.has(tool.name);
        const intCount = tool.integrations.length;
        const worksText = intCount > 0
          ? `Works with ${tool.integrations.slice(0, 3).join(', ')}${intCount > 3 ? ' and more' : ''}`
          : null;

        return (
          <li key={tool.id} className="row">
            <div
              className="mono"
              style={{ '--h': hue(tool.name) } as React.CSSProperties}
              aria-hidden="true"
            >
              {initial(tool.name)}
            </div>

            <div className="main">
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
                {worksText && <span className="works">{worksText}</span>}
              </div>
            </div>

            <div className="side">
              <span className="price">{pricingLabel(tool.pricing_model)}</span>
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
          </li>
        );
      })}
    </ul>
  );
}
