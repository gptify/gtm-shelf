'use client';

import { useState, useId, useMemo } from 'react';
import Link from 'next/link';

interface DirectoryToolPrice {
  id: string;
  name: string;
  stageName: string;
  pricingLabel: string;
  monthlyBasePrice: number;
  perSeatPrice: number;
  note: string;
  category: string;
}

// Real tools from the GTM Shelf directory with verified public pricing
const DIRECTORY_TOOLS: DirectoryToolPrice[] = [
  {
    id: 'apollo',
    name: 'Apollo.io',
    stageName: 'Prospect',
    category: 'Lead Database & Outreach',
    pricingLabel: 'Paid ($49/seat/mo)',
    monthlyBasePrice: 0,
    perSeatPrice: 49,
    note: 'Basic tier: $49/mo per seat (checked 2026-09-25)',
  },
  {
    id: 'clay',
    name: 'Clay',
    stageName: 'Prospect',
    category: 'Waterfall Enrichment',
    pricingLabel: 'Paid ($149/mo)',
    monthlyBasePrice: 149,
    perSeatPrice: 0,
    note: 'Starter plan: $149/mo with 2,000 credits (checked 2026-09-25)',
  },
  {
    id: 'smartlead',
    name: 'Smartlead',
    stageName: 'Engage',
    category: 'Cold Email & Deliverability',
    pricingLabel: 'Paid ($39/mo)',
    monthlyBasePrice: 39,
    perSeatPrice: 0,
    note: 'Basic plan: $39/mo for unlimited mailboxes (checked 2026-09-25)',
  },
  {
    id: 'instantly',
    name: 'Instantly',
    stageName: 'Engage',
    category: 'Email Sequencing',
    pricingLabel: 'Paid ($37/mo)',
    monthlyBasePrice: 37,
    perSeatPrice: 0,
    note: 'Growth plan: $37/mo (checked 2026-09-25)',
  },
  {
    id: 'tldv',
    name: 'tl;dv',
    stageName: 'Close',
    category: 'Meeting Intelligence',
    pricingLabel: 'Paid ($18/seat/mo)',
    monthlyBasePrice: 0,
    perSeatPrice: 18,
    note: 'Pro plan: $18/mo per recording seat (checked 2026-09-25)',
  },
  {
    id: 'fathom',
    name: 'Fathom',
    stageName: 'Close',
    category: 'AI Meeting Notes & CRM Sync',
    pricingLabel: 'Paid ($19/seat/mo)',
    monthlyBasePrice: 0,
    perSeatPrice: 19,
    note: 'Team plan: $19/mo per seat (checked 2026-09-25)',
  },
  {
    id: 'copy-ai',
    name: 'Copy.ai',
    stageName: 'Attract',
    category: 'GTM Copy Workflows',
    pricingLabel: 'Paid ($36/mo)',
    monthlyBasePrice: 36,
    perSeatPrice: 0,
    note: 'Starter plan: $36/mo (checked 2026-09-25)',
  },
  {
    id: 'surfer',
    name: 'Surfer',
    stageName: 'Attract',
    category: 'SEO Content Optimization',
    pricingLabel: 'Paid ($89/mo)',
    monthlyBasePrice: 89,
    perSeatPrice: 0,
    note: 'Essential plan: $89/mo (checked 2026-09-25)',
  },
];

export function StackCostSimulator() {
  const teamSizeId = useId();
  const hoursPerWeekId = useId();
  const hourlyRateId = useId();
  const automationRateId = useId();

  // Selected tool IDs from directory
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>(['apollo', 'smartlead', 'tldv']);

  // Editable time & team parameters
  const [teamSize, setTeamSize] = useState<number>(3);
  const [weeklyAdminHours, setWeeklyAdminHours] = useState<number>(8); // hours spent on research, CRM updates, notes per rep
  const [hourlyRate, setHourlyRate] = useState<number>(45); // fully loaded hourly rate
  const [automationRate, setAutomationRate] = useState<number>(40); // % automated

  function toggleTool(id: string) {
    if (selectedToolIds.includes(id)) {
      if (selectedToolIds.length > 1) {
        setSelectedToolIds(selectedToolIds.filter((t) => t !== id));
      }
    } else {
      setSelectedToolIds([...selectedToolIds, id]);
    }
  }

  // Calculate real tool costs based on selected tools and team seats
  const selectedTools = useMemo(() => {
    return DIRECTORY_TOOLS.filter((t) => selectedToolIds.includes(t.id));
  }, [selectedToolIds]);

  const softwareMonthlyTotal = useMemo(() => {
    return selectedTools.reduce((acc, t) => {
      return acc + t.monthlyBasePrice + t.perSeatPrice * teamSize;
    }, 0);
  }, [selectedTools, teamSize]);

  // Transparent Time-Savings Math:
  // Weekly hours saved across the team = Team Size × Admin Hours/Wk × (Automation % / 100)
  const weeklyHoursSaved = useMemo(() => {
    return (teamSize * weeklyAdminHours * (automationRate / 100));
  }, [teamSize, weeklyAdminHours, automationRate]);

  const monthlyHoursSaved = useMemo(() => {
    return Math.round(weeklyHoursSaved * 4.33);
  }, [weeklyHoursSaved]);

  const monthlyValueReclaimed = useMemo(() => {
    return Math.round(monthlyHoursSaved * hourlyRate);
  }, [monthlyHoursSaved, hourlyRate]);

  const netMonthlyValue = useMemo(() => {
    return monthlyValueReclaimed - softwareMonthlyTotal;
  }, [monthlyValueReclaimed, softwareMonthlyTotal]);

  const roiPercent = useMemo(() => {
    if (softwareMonthlyTotal <= 0) return 0;
    return Math.round((netMonthlyValue / softwareMonthlyTotal) * 100);
  }, [netMonthlyValue, softwareMonthlyTotal]);

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
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 32px' }}>
        <span className="badge-pill">Transparent Software &amp; Time Model</span>
        <h2 id="simulator-heading" style={{ fontSize: '1.625rem', fontWeight: 800, margin: '12px 0 8px', letterSpacing: '-0.02em' }}>
          B2B AI Stack Budget &amp; Capacity Simulator
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0, textWrap: 'pretty' }}>
          Model your monthly software licensing costs directly from verified directory pricing, and calculate reclaimed capacity using transparent formulas.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Interactive Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 1. Pick Real Tools in Your Stack */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ink)' }}>
                1. Select Real Tools in Your Stack:
              </label>
              <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                {selectedTools.length} selected
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', margin: '0 0 12px' }}>
              Costs pull from public pricing tables (base fee + per-seat licenses).
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '8px',
              }}
            >
              {DIRECTORY_TOOLS.map((tool) => {
                const isChecked = selectedToolIds.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => toggleTool(tool.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: isChecked ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: isChecked ? 'rgba(37, 99, 235, 0.04)' : 'var(--bg)',
                      color: 'var(--ink)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{tool.name}</span>
                      <span style={{ fontSize: '0.75rem', color: isChecked ? 'var(--primary)' : 'var(--muted)' }}>
                        {isChecked ? '✓' : '+'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                      {tool.perSeatPrice > 0 ? `$${tool.perSeatPrice}/seat/mo` : `$${tool.monthlyBasePrice}/mo`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Team Size Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label htmlFor={teamSizeId} style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ink)' }}>
                2. Team Size (Seats):
              </label>
              <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--primary)' }}>
                {teamSize} {teamSize === 1 ? 'seat' : 'seats'}
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
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px' }}>
              <span>1 (Solo)</span>
              <span>15</span>
              <span>30 (Scale)</span>
            </div>
          </div>

          {/* 3. Manual Admin Hours per Week */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label htmlFor={hoursPerWeekId} style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ink)' }}>
                3. Manual Admin / Research Hours:
              </label>
              <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--primary)' }}>
                {weeklyAdminHours} hrs/rep/wk
              </span>
            </div>
            <input
              id={hoursPerWeekId}
              type="range"
              min={2}
              max={20}
              step={1}
              value={weeklyAdminHours}
              onChange={(e) => setWeeklyAdminHours(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '4px 0 0' }}>
              Time spent writing notes, manually prospecting, and updating CRM fields.
            </p>
          </div>

          {/* 4. Hourly Rate & Automation % */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label htmlFor={hourlyRateId} style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', color: 'var(--ink)', marginBottom: '4px' }}>
                Loaded Hourly Cost:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>$</span>
                <input
                  id={hourlyRateId}
                  type="number"
                  min={15}
                  max={200}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Math.max(1, Number(e.target.value)))}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    fontSize: '0.875rem',
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>/hr</span>
              </div>
            </div>

            <div>
              <label htmlFor={automationRateId} style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', color: 'var(--ink)', marginBottom: '4px' }}>
                Est. Automation %:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  id={automationRateId}
                  type="number"
                  min={10}
                  max={90}
                  value={automationRate}
                  onChange={(e) => setAutomationRate(Math.min(90, Math.max(10, Number(e.target.value))))}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    fontSize: '0.875rem',
                  }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>%</span>
              </div>
            </div>
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
          {/* Software Cost Output */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted)' }}>
              Total Software Stack Spend
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.1, marginTop: '4px' }}>
              ${softwareMonthlyTotal.toLocaleString()}
              <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--muted)' }}> / month</span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '4px' }}>
              ~${(softwareMonthlyTotal * 12).toLocaleString()} per year across {selectedTools.length} selected tools
            </div>
          </div>

          {/* Time & Value Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                ~{monthlyHoursSaved} hrs
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginTop: '2px', color: 'var(--ink)' }}>
                Monthly Time Saved
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px', margin: 0 }}>
                {Math.round(weeklyHoursSaved)} hrs/wk across {teamSize} {teamSize === 1 ? 'rep' : 'reps'}
              </p>
            </div>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#059669' }}>
                ${monthlyValueReclaimed.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginTop: '2px', color: 'var(--ink)' }}>
                Time Value Reclaimed
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px', margin: 0 }}>
                At ${hourlyRate}/hr loaded cost
              </p>
            </div>
          </div>

          {/* Net Return Summary */}
          <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--muted)' }}>Net Monthly Value:</span>
              <strong style={{ fontSize: '1.125rem', color: netMonthlyValue >= 0 ? '#059669' : 'var(--danger)' }}>
                {netMonthlyValue >= 0 ? `+$${netMonthlyValue.toLocaleString()}` : `-$${Math.abs(netMonthlyValue).toLocaleString()}`} / mo
              </strong>
            </div>
            {roiPercent > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.75rem', color: 'var(--muted)' }}>
                <span>Estimated Payback:</span>
                <span style={{ fontWeight: 700, color: '#059669' }}>{roiPercent}% monthly return</span>
              </div>
            )}
          </div>

          <div style={{ paddingTop: '8px' }}>
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
                Need Custom Integrations? Talk to us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Model Methodology & Transparent Calculation Formula */}
      <div
        style={{
          marginTop: '36px',
          paddingTop: '24px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <details
          style={{
            cursor: 'pointer',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '16px 20px',
          }}
          open
        >
          <summary
            style={{
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: 'var(--ink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
            }}
          >
            <span>Calculation Formula &amp; Methodology</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 500 }}>
              Transparent mathematical model ▾
            </span>
          </summary>

          <div
            style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
              fontSize: '0.8125rem',
              color: 'var(--muted)',
              lineHeight: 1.5,
              cursor: 'default',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
                1. Software Cost Formula
              </div>
              <p style={{ margin: '0 0 6px' }}>
                <code>Stack Cost = Σ (Tool Base Fee + (Team Seats × Per-Seat Fee))</code>
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem' }}>
                Pulled directly from current published pricing pages for selected tools (e.g. Apollo at $49/seat, Smartlead at $39 base, tl;dv at $18/seat).
              </p>
            </div>

            <div>
              <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
                2. Capacity &amp; Time Reclaimed Formula
              </div>
              <p style={{ margin: '0 0 6px' }}>
                <code>Hours Saved = Team Size × Admin Hours/Wk × % Automated × 4.33</code>
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem' }}>
                Calculates manual hours redirected from routine copy-pasting, meeting notes, and enrichment into customer-facing selling.
              </p>
            </div>

            <div>
              <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
                3. Financial Return Formula
              </div>
              <p style={{ margin: '0 0 6px' }}>
                <code>Net Monthly Value = (Hours Saved × Hourly Rate) - Stack Cost</code>
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem' }}>
                Quantifies the direct financial impact of reclaimed operational bandwidth against software licensing costs.
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: '16px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(37, 99, 235, 0.05)',
              border: '1px solid rgba(37, 99, 235, 0.15)',
              fontSize: '0.78125rem',
              color: 'var(--ink)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>ℹ</span>
            <span>
              <strong>Indicative Estimator:</strong> This calculator provides an operational planning estimate based on user-entered parameters and public software pricing. It does not constitute a financial guarantee or legal advice.
            </span>
          </div>
        </details>
      </div>
    </section>
  );
}
