'use client';

import { useEffect, useRef } from 'react';
import { ToolPublic } from '@/lib/types';
import { hue, initial, pricingLabel, setupLabel } from '@/lib/utils';

interface ToolDrawerProps {
  tool: ToolPublic | null;
  allTools: ToolPublic[];
  isOpen: boolean;
  onClose: () => void;
  savedTools: Set<string>;
  onToggleSave: (toolName: string) => void;
  onSelectSimilarTool: (tool: ToolPublic) => void;
}

export function ToolDrawer({
  tool,
  allTools,
  isOpen,
  onClose,
  savedTools,
  onToggleSave,
  onSelectSimilarTool,
}: ToolDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && tool) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      if (!dialog.open) {
        dialog.showModal();
      }
      setTimeout(() => {
        titleRef.current?.focus();
      }, 50);
    } else {
      if (dialog.open) {
        dialog.close();
      }
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen, tool]);

  const isSaved = tool ? savedTools.has(tool.name) : false;

  // Up to 3 similar tools (same category first, then same stage)
  const similarCategory = tool
    ? allTools.filter((t) => t.id !== tool.id && t.category_id === tool.category_id)
    : [];
  const similarStage = tool
    ? allTools.filter(
        (t) =>
          t.id !== tool.id &&
          t.stage_id === tool.stage_id &&
          t.category_id !== tool.category_id
      )
    : [];
  const similarTools = [...similarCategory, ...similarStage].slice(0, 3);

  return (
    <dialog
      ref={dialogRef}
      id="drawer"
      aria-labelledby="dw-title"
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="dw">
        {tool ? (
          <>
            <div className="dw-top">
          <button
            type="button"
            className="close"
            aria-label="Close details"
            onClick={onClose}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="dw-head">
          <div
            className="mono big"
            style={{ '--h': hue(tool.name) } as React.CSSProperties}
            aria-hidden="true"
          >
            {initial(tool.name)}
          </div>
          <div>
            <h2 id="dw-title" ref={titleRef} tabIndex={-1}>
              {tool.name}
            </h2>
            <a
              className="site"
              href={tool.website_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tool.domain}
            </a>
          </div>
        </div>

        <p className="dw-tag">{tool.tagline}</p>
        <p>{tool.description}</p>

        <dl className="facts">
          <div>
            <dt>Funnel stage</dt>
            <dd>
              {tool.stage_id}. {tool.stage_name}
            </dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{tool.category_name}</dd>
          </div>
          <div>
            <dt>Pricing</dt>
            <dd>{pricingLabel(tool.pricing_model)}</dd>
          </div>
          {tool.setup_effort && (
            <div>
              <dt>Setup</dt>
              <dd>{setupLabel(tool.setup_effort)}</dd>
            </div>
          )}
          <div>
            <dt>Works with</dt>
            <dd>
              {tool.integrations.length
                ? tool.integrations.join(', ')
                : 'None listed'}
            </dd>
          </div>
          {tool.best_for && (
            <div>
              <dt>Best for</dt>
              <dd>{tool.best_for}</dd>
            </div>
          )}
          {tool.verified_at && (
            <div>
              <dt>Verified</dt>
              <dd>{tool.verified_at}</dd>
            </div>
          )}
        </dl>

        <div className="dw-actions">
          <a
            className="btn btn-primary"
            href={tool.website_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit {tool.domain}
          </a>
          <button
            type="button"
            className={`btn ${isSaved ? 'btn-primary' : 'btn-ghost'}`}
            aria-pressed={isSaved}
            onClick={() => onToggleSave(tool.name)}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>

        {similarTools.length > 0 && (
          <div>
            <h3>Similar tools</h3>
            <ul className="sim">
              {similarTools.map((st) => (
                <li key={st.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSimilarTool(st);
                      setTimeout(() => titleRef.current?.focus(), 50);
                    }}
                  >
                    <span
                      className="mono"
                      style={{ '--h': hue(st.name) } as React.CSSProperties}
                      aria-hidden="true"
                    >
                      {initial(st.name)}
                    </span>
                    <span>
                      <b>{st.name}</b>
                      <span className="t">{st.tagline}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
          </>
        ) : null}
      </div>
    </dialog>
  );
}
