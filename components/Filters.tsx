'use client';

import { Stage, Category, Integration } from '@/lib/types';

interface FiltersProps {
  stages: Stage[];
  categories: Category[];
  integrations: Integration[];
  selectedStage: number;
  selectedCategories: Set<string>;
  selectedPricing: Set<string>;
  selectedIntegrations: Set<string>;
  categoryCounts: Record<string, number>;
  pricingCounts: Record<string, number>;
  integrationCounts: Record<string, number>;
  onToggleCategory: (catName: string) => void;
  onTogglePricing: (pricingName: string) => void;
  onToggleIntegration: (intName: string) => void;
  isOpenMobile: boolean;
}

const PRICING_OPTIONS = ['Free plan', 'Paid', 'Custom quote'];

export function Filters({
  stages,
  categories,
  integrations,
  selectedStage,
  selectedCategories,
  selectedPricing,
  selectedIntegrations,
  categoryCounts,
  pricingCounts,
  integrationCounts,
  onToggleCategory,
  onTogglePricing,
  onToggleIntegration,
  isOpenMobile,
}: FiltersProps) {
  const visibleStages = selectedStage > 0
    ? stages.filter((s) => s.id === selectedStage)
    : stages;

  return (
    <aside className={`filters ${isOpenMobile ? 'open' : ''}`} id="filters" aria-label="Filters">
      <fieldset>
        <legend>Category</legend>
        {visibleStages.map((st) => {
          const stageCats = categories.filter((c) => c.stage_id === st.id);
          return (
            <div key={st.id}>
              {selectedStage === 0 && <p className="group-h">{st.name}</p>}
              {stageCats.map((cat) => {
                const checked = selectedCategories.has(cat.name);
                const count = categoryCounts[cat.name] ?? 0;
                const isOff = count === 0 && !checked;
                return (
                  <label key={cat.id} className={`opt ${isOff ? 'off' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleCategory(cat.name)}
                    />
                    <span>{cat.name}</span>
                    <span className="n">{count}</span>
                  </label>
                );
              })}
            </div>
          );
        })}
      </fieldset>

      <fieldset>
        <legend>Pricing</legend>
        {PRICING_OPTIONS.map((price) => {
          const checked = selectedPricing.has(price);
          const count = pricingCounts[price] ?? 0;
          const isOff = count === 0 && !checked;
          return (
            <label key={price} className={`opt ${isOff ? 'off' : ''}`}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onTogglePricing(price)}
              />
              <span>{price}</span>
              <span className="n">{count}</span>
            </label>
          );
        })}
      </fieldset>

      <fieldset>
        <legend>Works with</legend>
        {integrations.map((intg) => {
          const checked = selectedIntegrations.has(intg.name);
          const count = integrationCounts[intg.name] ?? 0;
          const isOff = count === 0 && !checked;
          return (
            <label key={intg.id} className={`opt ${isOff ? 'off' : ''}`}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleIntegration(intg.name)}
              />
              <span>{intg.name}</span>
              <span className="n">{count}</span>
            </label>
          );
        })}
      </fieldset>
    </aside>
  );
}
