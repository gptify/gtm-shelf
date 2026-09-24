'use client';

export type ViewMode = 'list' | 'grid' | 'table';

interface ToolbarProps {
  currentStageName?: string;
  filteredCount: number;
  totalCount: number;
  viewMode: ViewMode;
  onViewChange: (view: ViewMode) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  savedCount: number;
  isSavedActive: boolean;
  onToggleSaved: () => void;
  isClearVisible: boolean;
  onClearAll: () => void;
  isFiltersOpenMobile: boolean;
  onToggleFiltersMobile: () => void;
}

export function Toolbar({
  currentStageName,
  filteredCount,
  totalCount,
  viewMode,
  onViewChange,
  sortBy,
  onSortChange,
  savedCount,
  isSavedActive,
  onToggleSaved,
  isClearVisible,
  onClearAll,
  isFiltersOpenMobile,
  onToggleFiltersMobile,
}: ToolbarProps) {
  const countLabel = currentStageName
    ? `${currentStageName} stage: ${filteredCount} of ${totalCount} tools`
    : `${filteredCount} of ${totalCount} tools`;

  return (
    <div className="toolbar" id="tools-section">
      <p id="count" aria-live="polite">
        {countLabel}
      </p>

      <div className="tools-r">
        <button
          type="button"
          className="pill ftoggle"
          aria-expanded={isFiltersOpenMobile}
          onClick={onToggleFiltersMobile}
        >
          Filters
        </button>

        {isClearVisible && (
          <button
            type="button"
            className="pill plain"
            id="clear"
            onClick={onClearAll}
          >
            Clear all
          </button>
        )}

        <button
          type="button"
          className="pill"
          id="savedtoggle"
          aria-pressed={isSavedActive}
          onClick={onToggleSaved}
        >
          Saved ({savedCount})
        </button>

        <div className="seg" role="group" aria-label="View format">
          <button
            type="button"
            data-view="list"
            aria-pressed={viewMode === 'list'}
            title="List view"
            onClick={() => onViewChange('list')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <span>List</span>
          </button>
          <button
            type="button"
            data-view="grid"
            aria-pressed={viewMode === 'grid'}
            title="Grid view"
            onClick={() => onViewChange('grid')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Grid</span>
          </button>
          <button
            type="button"
            data-view="table"
            aria-pressed={viewMode === 'table'}
            title="Table view"
            onClick={() => onViewChange('table')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18" />
            </svg>
            <span>Table</span>
          </button>
        </div>

        <label htmlFor="sort" className="sr">
          Sort tools by
        </label>
        <select
          id="sort"
          className="pill"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="featured">Featured first</option>
          <option value="name">Name A to Z</option>
          <option value="stage">Funnel stage</option>
          <option value="cat">Category</option>
          <option value="price">Pricing</option>
          <option value="setup">Setup effort</option>
        </select>
      </div>
    </div>
  );
}
