'use client';

import { useState, useId } from 'react';
import Link from 'next/link';

type StackTier = 'starter' | 'growth' | 'enterprise';

interface StageOption {
  id: string;
  name: string;
  slug: string;
  defaultChecked: boolean;
  exampleTools: string;
}

const STAGES_AVAILABLE: StageOption[] = [
  {
    id: 'prospect',
    name: 'Lead Data & Account Research',
    slug: 'prospect',
    defaultChecked: true,
    exampleTools: 'Clay, Apollo, ZoomInfo',
  },
  {
    id: 'engage',
    name: 'Outreach & Engagement',
    slug: 'engage',
    defaultChecked: true,
    exampleTools: 'Smartlead, Instantly, Customer.io',
  },
  {
    id: 'close',
    name: 'Meeting Intelligence & CRM Sync',
    slug: 'close',
    defaultChecked: true,
    exampleTools: 'tl;dv, Fathom, HubSpot AI',
  },
];

export function StackCostSimulator() {
  const teamSizeId = useId();
  const [teamSize, setTeamSize] = useState<number>(5);
  const [tier, setTier] = useState<StackTier>('growth');
  const [selectedStages, setSelectedStages] = useState<string[]>(['prospect', 'engage', 'close']);

  function toggleStage(id: string) {
    if (selectedStages.includes(id)) {
      if (selectedStages.length > 1) {
        setSelectedStages(selectedStages.filter((s) => s !== id));
      }
    } else {
      setSelectedStages([...selectedStages, id]);
    }
  }

  // Cost calculation based strictly on commercial software licensing tiers
  const tierCostPerUser: Record<StackTier, number> = {
    starter: 40,
    growth: 85,
    enterprise: 160,
  };

  const stageMultiplier = 0.6 + selectedStages.length * 0.25;
  const estimatedMonthlyBudget = Math.round(teamSize * tierCostPerUser[tier] * stageMultiplier);
  const estimatedAnnualBudget = estimatedMonthlyBudget * 12;

  // Workflow capacity multiplier (how much more pipeline volume existing reps can support)
  const capacityMultipliers: Record<number, number> = {
    1: 1.5,
    2: 2.2,
    3: 2.8,
  };
  const baseMultiplier = capacityMultipliers[selectedStages.length] || 2.0;
  const finalCapacityMultiplier = tier === 'enterprise' ? (baseMultiplier + 0.3).toFixed(1) : baseMultiplier.toFixed(1);

  // Administrative hours redirected per month across team (e.g. eliminating manual CRM data entry and research)
  const hoursReclaimedPerUserPerWeek = selectedStages.length * 2.2;
  const totalMonthlyHoursRedirected = Math.round(teamSize * hoursReclaimedPerUserPerWeek * 4.2);

  return (
    <section
      style={{
        margin: '36px auto 56px',
        padding: '36px 32px',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        background: 'var(--surface)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
      }}
      aria-labelledby="simulator-heading"
    >
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 32px' }}>
        <span className="badge-pill">Interactive Estimator</span>
        <h2 id="simulator-heading" style={{ fontSize: '1.625rem', fontWeight: 800, margin: '12px 0 8px', letterSpacing: '-0.02em' }}>
          B2B AI Stack Budget &amp; Capacity Simulator
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
          Model your monthly software budget and workflow velocity. Designed to help revenue leaders plan software spend and eliminate manual administrative friction.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Sliders and Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Team Size Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label htmlFor={teamSizeId} style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ink)' }}>
                Active Team Size (Seats):
              </label>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  padding: '2px 10px',
                  background: 'var(--bg)',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                }}
              >
                {teamSize} {teamSize === 1 ? 'user' : 'users'}
              </span>
            </div>
            <input
              id={teamSizeId}
              type="range"
              min={1}
              max={30}
              step={1}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                accentColor: 'var(--primary)',
                cursor: 'pointer',
              }}
              aria-label="Active team size in seats"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px' }}>
              <span>1 user (Solo / Founder)</span>
              <span>15 users</span>
              <span>30 users (Growth Team)</span>
            </div>
          </div>

          {/* Funnel Stage Coverage Toggles */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '10px', color: 'var(--ink)' }}>
              Funnel Stages to Automate:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {STAGES_AVAILABLE.map((stage) => {
                const isChecked = selectedStages.includes(stage.id);
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => toggleStage(stage.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border)'}`,
                      background: isChecked ? 'rgba(37, 99, 235, 0.04)' : 'var(--bg)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink)' }}>
                        {stage.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '2px' }}>
                        e.g., {stage.exampleTools}
                      </div>
                    </div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border)'}`,
                        background: isChecked ? 'var(--primary)' : 'transparent',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {isChecked ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stack Tier Selector */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '8px', color: 'var(--ink)' }}>
              Software Stack Profile:
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '6px',
                padding: '4px',
                background: 'var(--bg)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
              }}
            >
              <button
                type="button"
                onClick={() => setTier('starter')}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: tier === 'starter' ? 'var(--surface)' : 'transparent',
                  color: tier === 'starter' ? 'var(--ink)' : 'var(--muted)',
                  fontWeight: tier === 'starter' ? 700 : 500,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  boxShadow: tier === 'starter' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                Starter
              </button>
              <button
                type="button"
                onClick={() => setTier('growth')}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: tier === 'growth' ? 'var(--surface)' : 'transparent',
                  color: tier === 'growth' ? 'var(--ink)' : 'var(--muted)',
                  fontWeight: tier === 'growth' ? 700 : 500,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  boxShadow: tier === 'growth' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                Growth
              </button>
              <button
                type="button"
                onClick={() => setTier('enterprise')}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: tier === 'enterprise' ? 'var(--surface)' : 'transparent',
                  color: tier === 'enterprise' ? 'var(--ink)' : 'var(--muted)',
                  fontWeight: tier === 'enterprise' ? 700 : 500,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  boxShadow: tier === 'enterprise' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                Scale
              </button>
            </div>
            <p style={{ fontSize: '0.78125rem', color: 'var(--muted)', marginTop: '6px', margin: '6px 0 0' }}>
              {tier === 'starter' && 'Free tiers & light utility plans. Best for bootstrapped startups.'}
              {tier === 'growth' && 'Professional plans with verified CRM integrations & outbound mailboxes.'}
              {tier === 'enterprise' && 'High-volume enrichment, autonomous AI SDR pipelines & custom webhooks.'}
            </p>
          </div>
        </div>

        {/* Right Column: Real-Time Dynamic Outputs */}
        <div
          style={{
            padding: '28px',
            borderRadius: '12px',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.78125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted)' }}>
              Estimated Monthly Stack Budget
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.1, marginTop: '4px' }}>
              ${estimatedMonthlyBudget.toLocaleString()}
              <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--muted)' }}> / month</span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '4px' }}>
              ~${estimatedAnnualBudget.toLocaleString()} per year across {selectedStages.length} funnel stages
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                {finalCapacityMultiplier}x
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginTop: '2px', color: 'var(--ink)' }}>
                Pipeline Capacity
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px', margin: 0 }}>
                More qualified accounts engaged with current team
              </p>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>
                ~{totalMonthlyHoursRedirected} hrs
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginTop: '2px', color: 'var(--ink)' }}>
                Admin Work Reclaimed
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px', margin: 0 }}>
                Monthly manual CRM entry redirected to active selling
              </p>
            </div>
          </div>

          <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
              Recommended Next Steps:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link
                href="/find"
                className="btn btn-primary"
                style={{ textAlign: 'center', padding: '10px 16px', fontSize: '0.875rem', textDecoration: 'none' }}
              >
                Match Stack in Tool Finder →
              </Link>
              <Link
                href="/custom"
                className="btn btn-secondary"
                style={{ textAlign: 'center', padding: '10px 16px', fontSize: '0.875rem', textDecoration: 'none' }}
              >
                Need Custom API Connectors? Ask GPTify.co
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
