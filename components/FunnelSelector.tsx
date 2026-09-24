'use client';

import { useEffect, useState } from 'react';
import { Stage } from '@/lib/types';

interface FunnelSelectorProps {
  stages: Stage[];
  selectedStage: number; // 0 for all stages, 1-5 for specific stage
  stageCounts: Record<number, number>;
  onSelectStage: (stageId: number) => void;
  onScrollToTools: () => void;
}

const WIDTHS = [
  [100, 100],
  [90, 94],
  [80, 88],
  [70, 82],
  [60, 76],
];

export function FunnelSelector({
  stages,
  selectedStage,
  stageCounts,
  onSelectStage,
  onScrollToTools,
}: FunnelSelectorProps) {
  const [visitedStages, setVisitedStages] = useState<Set<number>>(() => new Set([1]));
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (selectedStage > 0) {
      setVisitedStages((prev) => new Set([...prev, selectedStage]));
    }
  }, [selectedStage]);

  const handleStageClick = (id: number) => {
    setHasInteracted(true);
    if (selectedStage === id) {
      onSelectStage(0);
    } else {
      onSelectStage(id);
    }
  };

  const currentStage = stages.find((s) => s.id === selectedStage);
  const nextStageId = selectedStage > 0 ? (selectedStage % 5) + 1 : 1;
  const nextStage = stages.find((s) => s.id === nextStageId) || stages[0];

  return (
    <div>
      <p className="fq">Where does your funnel leak?</p>
      <p className="fhelp">Click a stage to narrow the shelf, or browse the full list below.</p>

      <div className="funnel" id="funnel" role="group" aria-label="Funnel stages">
        {stages.map((stage, idx) => {
          const isSelected = selectedStage === stage.id;
          const isVisited = visitedStages.has(stage.id);
          const count = stageCounts[stage.id] ?? 0;
          const isZero = count === 0 && !isSelected;
          const isNudge = stage.id === 2 && !hasInteracted;

          const wDesktop = WIDTHS[idx][0];
          const wMobile = WIDTHS[idx][1];

          return (
            <button
              key={stage.id}
              type="button"
              className={`stage ${isSelected ? '' : isVisited ? 'seen' : ''} ${isZero ? 'zero' : ''} ${isNudge ? 'nudge' : ''}`}
              style={
                {
                  '--i': idx,
                  '--w': `${wDesktop}%`,
                  '--wm': `${wMobile}%`,
                } as React.CSSProperties
              }
              aria-pressed={isSelected}
              aria-label={`${stage.name}, ${count} tools`}
              onClick={() => handleStageClick(stage.id)}
            >
              <span className="num">{stage.id}</span>
              <span className="name">{stage.name}</span>
              <span className="hint">{stage.hint}</span>
              <span className="count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="fnav">
        {currentStage && (
          <button
            type="button"
            className="btn btn-soft"
            onClick={onScrollToTools}
          >
            See the {stageCounts[currentStage.id] ?? 0} {currentStage.name} tools
          </button>
        )}

        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setHasInteracted(true);
            onSelectStage(nextStageId);
          }}
        >
          {selectedStage === 0
            ? 'Start with Attract'
            : selectedStage === 5
            ? `Back to ${nextStage.name}`
            : `Next stage: ${nextStage.name}`}
        </button>
      </div>

      {selectedStage > 0 && (
        <button
          type="button"
          className="allstages"
          onClick={() => {
            setHasInteracted(true);
            onSelectStage(0);
          }}
        >
          Show all stages
        </button>
      )}
    </div>
  );
}
