'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Stage, Category, Integration, ToolPublic } from '@/lib/types';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { FunnelSelector } from '@/components/FunnelSelector';
import { Filters } from '@/components/Filters';
import { Toolbar, ViewMode } from '@/components/Toolbar';
import { ToolList } from '@/components/ToolList';
import { ToolGrid } from '@/components/ToolGrid';
import { ToolTable } from '@/components/ToolTable';
import { ToolDrawer } from '@/components/ToolDrawer';
import { SubmitModal } from '@/components/SubmitModal';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { Footer } from '@/components/Footer';

interface HomeDirectoryProps {
  initialTools: ToolPublic[];
  stages: Stage[];
  categories: Category[];
  integrations: Integration[];
  initialParams?: Record<string, string | undefined>;
}

const PRICING_ORDER: Record<string, number> = {
  free_plan: 0,
  'Free plan': 0,
  paid: 1,
  Paid: 1,
  custom_quote: 2,
  'Custom quote': 2,
};

export function HomeDirectory({
  initialTools,
  stages,
  categories,
  integrations,
  initialParams = {},
}: HomeDirectoryProps) {
  const router = useRouter();

  // Search and stage
  const [searchQuery, setSearchQuery] = useState(initialParams.q || '');
  const [selectedStage, setSelectedStage] = useState<number>(() => {
    if (initialParams.stage !== undefined) return Number(initialParams.stage);
    return 1; // Default to Attract (1)
  });

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(() => {
    return initialParams.category ? new Set(initialParams.category.split(',')) : new Set();
  });
  const [selectedPricing, setSelectedPricing] = useState<Set<string>>(() => {
    return initialParams.pricing ? new Set(initialParams.pricing.split(',')) : new Set();
  });
  const [selectedIntegrations, setSelectedIntegrations] = useState<Set<string>>(() => {
    return initialParams.integrations ? new Set(initialParams.integrations.split(',')) : new Set();
  });
  const [isSavedOnly, setIsSavedOnly] = useState(false);

  // View and sort
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const v = initialParams.view;
    if (v === 'grid' || v === 'table' || v === 'list') return v;
    return 'list';
  });
  const [sortBy, setSortBy] = useState(initialParams.sort || 'featured');
  const [sortDir, setSortDir] = useState(1);

  // Saved tools in localStorage
  const [savedTools, setSavedTools] = useState<Set<string>>(new Set());

  // UI modal and drawer states
  const [isFiltersOpenMobile, setIsFiltersOpenMobile] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolPublic | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize saved tools and view from localStorage on mount
  useEffect(() => {
    try {
      const storedSaved = localStorage.getItem('fi-saved');
      if (storedSaved) {
        setSavedTools(new Set(JSON.parse(storedSaved)));
      }
      const storedView = localStorage.getItem('fi-view');
      if (storedView === 'grid' || storedView === 'table' || storedView === 'list') {
        setViewMode(storedView as ViewMode);
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  // Synchronize state with URL search parameters (AC 4)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    if (selectedStage !== 1) {
      params.set('stage', String(selectedStage));
    }
    if (selectedCategories.size > 0) {
      params.set('category', Array.from(selectedCategories).join(','));
    }
    if (selectedPricing.size > 0) {
      params.set('pricing', Array.from(selectedPricing).join(','));
    }
    if (selectedIntegrations.size > 0) {
      params.set('integrations', Array.from(selectedIntegrations).join(','));
    }
    if (viewMode !== 'list') {
      params.set('view', viewMode);
    }
    if (sortBy !== 'featured') {
      params.set('sort', sortBy);
    }

    const qs = params.toString();
    const newUrl = qs ? `/?${qs}` : '/';
    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [
    searchQuery,
    selectedStage,
    selectedCategories,
    selectedPricing,
    selectedIntegrations,
    viewMode,
    sortBy,
  ]);

  // Persist saved tools
  const handleToggleSave = useCallback((toolName: string) => {
    setSavedTools((prev) => {
      const next = new Set(prev);
      if (next.has(toolName)) {
        next.delete(toolName);
      } else {
        next.add(toolName);
      }
      try {
        localStorage.setItem('fi-saved', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('fi-view', mode);
    } catch {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4200);
  };

  // Searching clears stage selection
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && selectedStage !== 0) {
      setSelectedStage(0);
    }
  };

  const handleSelectStage = (stageId: number) => {
    setSelectedStage(stageId);
    if (stageId > 0) {
      // Clear categories not belonging to the chosen stage
      const stageCats = categories.filter((c) => c.stage_id === stageId).map((c) => c.name);
      setSelectedCategories((prev) => {
        const next = new Set<string>();
        prev.forEach((cat) => {
          if (stageCats.includes(cat)) next.add(cat);
        });
        return next;
      });
    }
  };

  const handleToggleCategory = (catName: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catName)) next.delete(catName);
      else next.add(catName);
      return next;
    });
  };

  const handleTogglePricing = (priceName: string) => {
    setSelectedPricing((prev) => {
      const next = new Set(prev);
      if (next.has(priceName)) next.delete(priceName);
      else next.add(priceName);
      return next;
    });
  };

  const handleToggleIntegration = (intName: string) => {
    setSelectedIntegrations((prev) => {
      const next = new Set(prev);
      if (next.has(intName)) next.delete(intName);
      else next.add(intName);
      return next;
    });
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedStage(0);
    setSelectedCategories(new Set());
    setSelectedPricing(new Set());
    setSelectedIntegrations(new Set());
    setIsSavedOnly(false);
  };

  // Check matching helper
  const checkMatch = useCallback(
    (tool: ToolPublic, skip: ('stage' | 'category' | 'pricing' | 'integration')[] = []) => {
      if (!skip.includes('stage') && selectedStage > 0 && tool.stage_id !== selectedStage) {
        return false;
      }
      if (!skip.includes('category') && selectedCategories.size > 0 && !selectedCategories.has(tool.category_name)) {
        return false;
      }
      if (!skip.includes('pricing') && selectedPricing.size > 0) {
        const isFree = selectedPricing.has('Free plan') && tool.pricing_model === 'free_plan';
        const isPaid = selectedPricing.has('Paid') && tool.pricing_model === 'paid';
        const isQuote = selectedPricing.has('Custom quote') && tool.pricing_model === 'custom_quote';
        if (!isFree && !isPaid && !isQuote) return false;
      }
      if (!skip.includes('integration') && selectedIntegrations.size > 0) {
        for (const reqInt of Array.from(selectedIntegrations)) {
          if (!tool.integrations.includes(reqInt)) return false;
        }
      }
      if (isSavedOnly && !savedTools.has(tool.name)) {
        return false;
      }
      if (searchQuery.trim()) {
        const words = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
        const searchable = `${tool.name} ${tool.tagline} ${tool.description} ${tool.category_name} ${tool.stage_name} ${tool.integrations.join(' ')}`.toLowerCase();
        for (const w of words) {
          if (!searchable.includes(w)) return false;
        }
      }
      return true;
    },
    [selectedStage, selectedCategories, selectedPricing, selectedIntegrations, isSavedOnly, savedTools, searchQuery]
  );

  // Filtered tools
  const filteredTools = useMemo(() => {
    const list = initialTools.filter((t) => checkMatch(t));

    // Sort items
    list.sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'stage') {
        const diff = a.stage_id - b.stage_id;
        return (sortDir < 0 ? -diff : diff) || a.name.localeCompare(b.name);
      }
      if (sortBy === 'cat') {
        const diff = a.category_name.localeCompare(b.category_name);
        return (sortDir < 0 ? -diff : diff) || a.name.localeCompare(b.name);
      }
      if (sortBy === 'price') {
        const diff = (PRICING_ORDER[a.pricing_model] ?? 9) - (PRICING_ORDER[b.pricing_model] ?? 9);
        return (sortDir < 0 ? -diff : diff) || a.name.localeCompare(b.name);
      }
      if (sortBy === 'setup') {
        const diff = (a.setup_effort || 9) - (b.setup_effort || 9);
        return (sortDir < 0 ? -diff : diff) || a.name.localeCompare(b.name);
      }
      // default: name A-Z
      const diff = a.name.localeCompare(b.name);
      return sortDir < 0 ? -diff : diff;
    });

    return list;
  }, [initialTools, checkMatch, sortBy, sortDir]);

  // Faceted counts
  const stageCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    stages.forEach((s) => {
      counts[s.id] = initialTools.filter((t) => t.stage_id === s.id && checkMatch(t, ['stage', 'category'])).length;
    });
    return counts;
  }, [stages, initialTools, checkMatch]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((c) => {
      counts[c.name] = initialTools.filter((t) => t.category_name === c.name && checkMatch(t, ['category'])).length;
    });
    return counts;
  }, [categories, initialTools, checkMatch]);

  const pricingCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ['Free plan', 'Paid', 'Custom quote'].forEach((p) => {
      counts[p] = initialTools.filter((t) => {
        const matchPrice =
          (p === 'Free plan' && t.pricing_model === 'free_plan') ||
          (p === 'Paid' && t.pricing_model === 'paid') ||
          (p === 'Custom quote' && t.pricing_model === 'custom_quote');
        return matchPrice && checkMatch(t, ['pricing']);
      }).length;
    });
    return counts;
  }, [initialTools, checkMatch]);

  const integrationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    integrations.forEach((i) => {
      counts[i.name] = initialTools.filter((t) => t.integrations.includes(i.name) && checkMatch(t, ['integration'])).length;
    });
    return counts;
  }, [integrations, initialTools, checkMatch]);

  const isClearVisible = Boolean(
    searchQuery.trim() ||
    selectedStage !== 0 ||
    selectedCategories.size > 0 ||
    selectedPricing.size > 0 ||
    selectedIntegrations.size > 0 ||
    isSavedOnly
  );

  const currentStageName = selectedStage > 0 ? stages.find((s) => s.id === selectedStage)?.name : undefined;

  const handleHeaderSort = (key: string) => {
    if (sortBy === key) {
      setSortDir((d) => -d);
    } else {
      setSortBy(key);
      setSortDir(1);
    }
  };

  const scrollToTools = () => {
    const el = document.getElementById('tools-section');
    if (el) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <div className="wrap" id="main-content">
        <Header onOpenSubmit={() => setIsSubmitModalOpen(true)} />

        <Hero searchQuery={searchQuery} onSearchChange={handleSearchChange}>
          <FunnelSelector
            stages={stages}
            selectedStage={selectedStage}
            stageCounts={stageCounts}
            onSelectStage={handleSelectStage}
            onScrollToTools={scrollToTools}
          />
        </Hero>

        {/* Spotlight: GTM Use-Case Library */}
        <section
          style={{
            margin: '0 0 36px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: '16px',
            padding: '24px 28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap',
              marginBottom: '16px',
            }}
          >
            <div style={{ maxWidth: '680px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  background: 'var(--brand-soft)',
                  color: 'var(--brand)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '8px',
                }}
              >
                NEW • Operational Playbooks
              </div>
              <h2
                style={{
                  font: '700 1.25rem/1.3 var(--display)',
                  color: 'var(--ink)',
                  margin: '0 0 6px',
                  letterSpacing: '-0.015em',
                }}
              >
                Start From Your Problem: Browse 18 Battle-Tested GTM Use Cases
              </h2>
              <p
                style={{
                  font: '400 0.9375rem/1.6 var(--body)',
                  color: 'var(--muted)',
                  margin: 0,
                }}
              >
                Explore step-by-step blueprints for multi-vendor waterfall enrichment, automated meeting booking, domain deliverability guardrails, and autonomous CRM sync.
              </p>
            </div>

            <div>
              <Link
                href="/use-cases"
                className="btn btn-primary"
                style={{
                  padding: '10px 20px',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Explore All 18 Blueprints →
              </Link>
            </div>
          </div>

          {/* Quick links to top use cases */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              alignItems: 'center',
              paddingTop: '14px',
              borderTop: '1px solid var(--line)',
              fontSize: '0.8125rem',
            }}
          >
            <span style={{ color: 'var(--muted)', fontWeight: 600 }}>Popular workflows:</span>
            <Link
              href="/use-cases/crm-enrichment-waterfall"
              style={{
                color: 'var(--ink)',
                background: 'var(--bg)',
                padding: '4px 10px',
                borderRadius: '6px',
                textDecoration: 'none',
                border: '1px solid var(--line)',
                fontWeight: 500,
              }}
            >
              Waterfall Email Enrichment
            </Link>
            <Link
              href="/use-cases/signal-based-prospecting"
              style={{
                color: 'var(--ink)',
                background: 'var(--bg)',
                padding: '4px 10px',
                borderRadius: '6px',
                textDecoration: 'none',
                border: '1px solid var(--line)',
                fontWeight: 500,
              }}
            >
              Signal-Based Prospecting
            </Link>
            <Link
              href="/use-cases/call-recording-crm-sync"
              style={{
                color: 'var(--ink)',
                background: 'var(--bg)',
                padding: '4px 10px',
                borderRadius: '6px',
                textDecoration: 'none',
                border: '1px solid var(--line)',
                fontWeight: 500,
              }}
            >
              Meeting Notes to CRM Sync
            </Link>
            <Link
              href="/use-cases/high-intent-deanonymization"
              style={{
                color: 'var(--ink)',
                background: 'var(--bg)',
                padding: '4px 10px',
                borderRadius: '6px',
                textDecoration: 'none',
                border: '1px solid var(--line)',
                fontWeight: 500,
              }}
            >
              Website Visitor De-anonymization
            </Link>
          </div>
        </section>

        <section className="browse" id="tools-section">
          <Filters
            stages={stages}
            categories={categories}
            integrations={integrations}
            selectedStage={selectedStage}
            selectedCategories={selectedCategories}
            selectedPricing={selectedPricing}
            selectedIntegrations={selectedIntegrations}
            categoryCounts={categoryCounts}
            pricingCounts={pricingCounts}
            integrationCounts={integrationCounts}
            onToggleCategory={handleToggleCategory}
            onTogglePricing={handleTogglePricing}
            onToggleIntegration={handleToggleIntegration}
            isOpenMobile={isFiltersOpenMobile}
          />

          <div>
            <Toolbar
              currentStageName={currentStageName}
              filteredCount={filteredTools.length}
              totalCount={initialTools.length}
              viewMode={viewMode}
              onViewChange={handleViewChange}
              sortBy={sortBy}
              onSortChange={(s) => {
                setSortBy(s);
                setSortDir(1);
              }}
              savedCount={savedTools.size}
              isSavedActive={isSavedOnly}
              onToggleSaved={() => setIsSavedOnly((prev) => !prev)}
              isClearVisible={isClearVisible}
              onClearAll={handleClearAll}
              isFiltersOpenMobile={isFiltersOpenMobile}
              onToggleFiltersMobile={() => setIsFiltersOpenMobile((prev) => !prev)}
            />

            {/* Editorial Standard Disclosure */}
            <div
              style={{
                marginTop: '12px',
                marginBottom: '4px',
                fontSize: '0.8125rem',
                color: 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ color: 'var(--brand)', fontWeight: 600 }}>• Editor’s picks:</span>
              <span>Selected strictly for real-world workflow reliability and adoption. Zero pay-to-play.</span>
            </div>

            <div id="results" style={{ marginTop: '12px' }}>
              {filteredTools.length === 0 ? (
                <div className="empty">
                  <strong>No tools match these filters</strong>
                  Remove a filter or search for something broader. If a tool is missing, you can add it.
                  <div className="btns">
                    <button type="button" className="btn btn-primary" onClick={handleClearAll}>
                      Clear all filters
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setIsSubmitModalOpen(true)}
                    >
                      Submit a tool
                    </button>
                    <Link
                      href={`/custom?q=${encodeURIComponent(searchQuery)}`}
                      className="btn btn-ghost"
                    >
                      Request a custom build
                    </Link>
                  </div>
                </div>
              ) : viewMode === 'grid' ? (
                <ToolGrid
                  tools={filteredTools}
                  savedTools={savedTools}
                  onToggleSave={handleToggleSave}
                  onOpenTool={(t) => setActiveTool(t)}
                />
              ) : viewMode === 'table' ? (
                <ToolTable
                  tools={filteredTools}
                  savedTools={savedTools}
                  onToggleSave={handleToggleSave}
                  onOpenTool={(t) => setActiveTool(t)}
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onHeaderSort={handleHeaderSort}
                />
              ) : (
                <ToolList
                  tools={filteredTools}
                  savedTools={savedTools}
                  onToggleSave={handleToggleSave}
                  onOpenTool={(t) => setActiveTool(t)}
                />
              )}
            </div>
          </div>
        </section>

        {/* Newsletter Briefing Signup */}
        <NewsletterSignup />
      </div>

      <Footer stages={stages} />

      {/* Tool details slide-in drawer */}
      <ToolDrawer
        tool={activeTool}
        allTools={initialTools}
        isOpen={Boolean(activeTool)}
        onClose={() => setActiveTool(null)}
        savedTools={savedTools}
        onToggleSave={handleToggleSave}
        onSelectSimilarTool={(t) => setActiveTool(t)}
      />

      {/* Submit tool dialog */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        stages={stages}
        categories={categories}
        onSubmitted={(toolName) => {
          showToast(`${toolName} was added. It shows as pending until a moderator approves it.`);
        }}
      />

      {/* Toast notification */}
      <div
        className={`toast ${toastMessage ? 'show' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toastMessage}
      </div>
    </>
  );
}
