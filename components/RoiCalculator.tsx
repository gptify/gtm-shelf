'use client';

import { useState, useId } from 'react';
import Link from 'next/link';

type Currency = 'USD' | 'EUR' | 'GBP';

interface Preset {
  id: string;
  name: string;
  tagline: string;
  hourly: number;
  people: number;
  minutes: number;
  frequency: number;
  weeks: number;
  rate: number;
  setup: number;
  software: number;
}

const PRESETS: Preset[] = [
  {
    id: 'research',
    name: 'Lead & Account Research',
    tagline: 'Prospect qualification, data enrichment & firmographics',
    hourly: 52,
    people: 6,
    minutes: 35,
    frequency: 25,
    weeks: 48,
    rate: 60,
    setup: 9000,
    software: 450,
  },
  {
    id: 'admin',
    name: 'Admin & CRM Data Entry',
    tagline: 'Meeting notes logging, pipeline hygiene & ticket triage',
    hourly: 38,
    people: 4,
    minutes: 20,
    frequency: 35,
    weeks: 48,
    rate: 65,
    setup: 5000,
    software: 180,
  },
  {
    id: 'content',
    name: 'Content & Outbound Workflow',
    tagline: 'Personalized cold email drafts, battlecards & sales collateral',
    hourly: 45,
    people: 3,
    minutes: 90,
    frequency: 8,
    weeks: 48,
    rate: 50,
    setup: 6500,
    software: 220,
  },
  {
    id: 'reporting',
    name: 'Reporting & Forecasting',
    tagline: 'Pipeline summaries, executive reporting & attribution models',
    hourly: 58,
    people: 5,
    minutes: 120,
    frequency: 3,
    weeks: 48,
    rate: 70,
    setup: 12000,
    software: 500,
  },
];

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export function RoiCalculator() {
  const formId = useId();
  const [currency, setCurrency] = useState<Currency>('USD');
  const [activePreset, setActivePreset] = useState<string>('research');

  // Input states
  const [hourlyRate, setHourlyRate] = useState<number>(52);
  const [teamMembers, setTeamMembers] = useState<number>(6);
  const [minutesPerTask, setMinutesPerTask] = useState<number>(35);
  const [frequencyPerWeek, setFrequencyPerWeek] = useState<number>(25);
  const [weeksPerYear, setWeeksPerYear] = useState<number>(48);
  const [automationRate, setAutomationRate] = useState<number>(60);
  const [setupCost, setSetupCost] = useState<number>(9000);
  const [monthlySoftware, setMonthlySoftware] = useState<number>(450);

  function applyPreset(preset: Preset) {
    setActivePreset(preset.id);
    setHourlyRate(preset.hourly);
    setTeamMembers(preset.people);
    setMinutesPerTask(preset.minutes);
    setFrequencyPerWeek(preset.frequency);
    setWeeksPerYear(preset.weeks);
    setAutomationRate(preset.rate);
    setSetupCost(preset.setup);
    setMonthlySoftware(preset.software);
  }

  // Exact math from gptify.co
  const annualHours = (minutesPerTask / 60) * frequencyPerWeek * weeksPerYear * teamMembers;
  const currentCost = annualHours * hourlyRate;
  const savedHours = annualHours * (automationRate / 100);
  const grossSavings = currentCost * (automationRate / 100);
  const annualSoftware = monthlySoftware * 12;
  const netAnnualSavings = grossSavings - annualSoftware;
  const totalInvestment = setupCost + annualSoftware;
  const yearOneBenefit = grossSavings - totalInvestment;
  const firstYearROI = totalInvestment > 0 ? (yearOneBenefit / totalInvestment) * 100 : (grossSavings > 0 ? 1000 : 0);
  const monthlyNet = (grossSavings / 12) - monthlySoftware;
  const paybackMonths = monthlyNet > 0 ? setupCost / monthlyNet : 0;
  const threeYearNetBenefit = (grossSavings * 3) - (annualSoftware * 3) - setupCost;

  const symbol = CURRENCY_SYMBOLS[currency];
  const formattedNetAnnual = Math.round(netAnnualSavings).toLocaleString();
  const formattedHours = Math.round(savedHours).toLocaleString();
  const formattedWeeklyHours = Math.round(savedHours / weeksPerYear).toLocaleString();
  const formattedThreeYear = Math.round(threeYearNetBenefit).toLocaleString();

  // Cost comparison
  const costWithAi = currentCost - grossSavings + annualSoftware;
  const maxBarCost = Math.max(currentCost, costWithAi, 1);
  const currentCostPercent = 100;
  const costWithAiPercent = Math.max(5, Math.min(100, Math.round((costWithAi / maxBarCost) * 100)));

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
      {/* Top Banner & Control Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '16px 20px',
          border: '1px solid var(--line)',
          borderRadius: '16px 16px 0 0',
          background: 'var(--ink)',
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              display: 'inline-grid',
              placeItems: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--brand)',
              color: '#fff',
              fontSize: '1rem',
            }}
          >
            ✦
          </span>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700 }}>AI Workflow ROI Engine</div>
            <div style={{ fontSize: '0.75rem', color: '#A0A5C2' }}>Client-side model • Zero data logged</div>
          </div>
        </div>

        {/* Currency Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#A0A5C2', textTransform: 'uppercase' }}>
            Currency:
          </span>
          <div
            style={{
              display: 'inline-flex',
              background: 'rgba(255,255,255,0.08)',
              padding: '2px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            {(['USD', 'EUR', 'GBP'] as Currency[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: currency === c ? 'var(--brand)' : 'transparent',
                  color: currency === c ? '#fff' : '#A0A5C2',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                {c === 'USD' ? '$ USD' : c === 'EUR' ? '€ EUR' : '£ GBP'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid Wrapper */}
      <div
        style={{
          border: '1px solid var(--line)',
          borderTop: 'none',
          borderRadius: '0 0 16px 16px',
          background: 'var(--surface)',
          padding: 'clamp(20px, 4vw, 36px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
        }}
      >
        {/* Preset Selector */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--brand)',
              marginBottom: '10px',
            }}
          >
            Quick-Start Preset Scenarios
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
            }}
          >
            {PRESETS.map((p) => {
              const isSelected = activePreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: `1.5px solid ${isSelected ? 'var(--brand)' : 'var(--line)'}`,
                    background: isSelected ? 'var(--brand-soft)' : 'var(--bg)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease, background 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: isSelected ? 'var(--brand)' : 'var(--ink)',
                      marginBottom: '4px',
                    }}
                  >
                    {p.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.35 }}>
                    {p.tagline}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Layout: Inputs on Left, Real-time Metrics on Right */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Configurable Inputs */}
          <div>
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: 800,
                margin: '0 0 16px',
                color: 'var(--ink)',
                letterSpacing: '-0.01em',
              }}
            >
              1. Team &amp; Workflow Parameters
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Hourly Rate & Team Members */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label
                    htmlFor={`${formId}-hourly`}
                    style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}
                  >
                    Avg. Hourly Cost ({symbol})
                  </label>
                  <input
                    id={`${formId}-hourly`}
                    type="number"
                    min={1}
                    max={500}
                    value={hourlyRate}
                    onChange={(e) => {
                      setHourlyRate(Math.max(1, Number(e.target.value) || 0));
                      setActivePreset('');
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--line)',
                      background: 'var(--bg)',
                      color: 'var(--ink)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                    }}
                  />
                  <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>Fully burdened labor rate</span>
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-people`}
                    style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}
                  >
                    Team Members
                  </label>
                  <input
                    id={`${formId}-people`}
                    type="number"
                    min={1}
                    max={500}
                    value={teamMembers}
                    onChange={(e) => {
                      setTeamMembers(Math.max(1, Number(e.target.value) || 0));
                      setActivePreset('');
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--line)',
                      background: 'var(--bg)',
                      color: 'var(--ink)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                    }}
                  />
                  <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>People doing this workflow</span>
                </div>
              </div>

              {/* Minutes per Task & Weekly Frequency */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label
                    htmlFor={`${formId}-minutes`}
                    style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}
                  >
                    Minutes Per Task
                  </label>
                  <input
                    id={`${formId}-minutes`}
                    type="number"
                    min={1}
                    max={1440}
                    value={minutesPerTask}
                    onChange={(e) => {
                      setMinutesPerTask(Math.max(1, Number(e.target.value) || 0));
                      setActivePreset('');
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--line)',
                      background: 'var(--bg)',
                      color: 'var(--ink)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                    }}
                  />
                  <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>Time spent per occurrence</span>
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-freq`}
                    style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}
                  >
                    Frequency / Rep / Wk
                  </label>
                  <input
                    id={`${formId}-freq`}
                    type="number"
                    min={1}
                    max={500}
                    value={frequencyPerWeek}
                    onChange={(e) => {
                      setFrequencyPerWeek(Math.max(1, Number(e.target.value) || 0));
                      setActivePreset('');
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--line)',
                      background: 'var(--bg)',
                      color: 'var(--ink)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                    }}
                  />
                  <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>Times performed per week</span>
                </div>
              </div>

              {/* Working Weeks per Year */}
              <div>
                <label
                  htmlFor={`${formId}-weeks`}
                  style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}
                >
                  Working Weeks Per Year: <strong style={{ color: 'var(--brand)' }}>{weeksPerYear} weeks</strong>
                </label>
                <input
                  id={`${formId}-weeks`}
                  type="range"
                  min={30}
                  max={52}
                  value={weeksPerYear}
                  onChange={(e) => {
                    setWeeksPerYear(Number(e.target.value));
                    setActivePreset('');
                  }}
                  style={{ width: '100%', accentColor: 'var(--brand)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--muted)' }}>
                  <span>30 weeks</span>
                  <span>48 weeks (Standard)</span>
                  <span>52 weeks</span>
                </div>
              </div>

              {/* Efficiency / Automation Rate */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--line)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label htmlFor={`${formId}-rate`} style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--ink)' }}>
                    AI Automation / Speed Lift
                  </label>
                  <span
                    style={{
                      background: 'var(--brand)',
                      color: 'var(--brand-ink)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '0.8125rem',
                    }}
                  >
                    {automationRate}%
                  </span>
                </div>
                <input
                  id={`${formId}-rate`}
                  type="range"
                  min={10}
                  max={95}
                  step={5}
                  value={automationRate}
                  onChange={(e) => {
                    setAutomationRate(Number(e.target.value));
                    setActivePreset('');
                  }}
                  style={{ width: '100%', accentColor: 'var(--brand)', cursor: 'pointer' }}
                />
                <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                  Conservative estimate of manual task time eliminated or accelerated via AI tooling and templates.
                </p>
              </div>

              {/* Investment Costs */}
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 800,
                  margin: '12px 0 4px',
                  color: 'var(--ink)',
                  letterSpacing: '-0.01em',
                }}
              >
                2. Implementation &amp; Software Costs
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label
                    htmlFor={`${formId}-setup`}
                    style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}
                  >
                    Setup &amp; Onboarding ({symbol})
                  </label>
                  <input
                    id={`${formId}-setup`}
                    type="number"
                    min={0}
                    step={500}
                    value={setupCost}
                    onChange={(e) => {
                      setSetupCost(Math.max(0, Number(e.target.value) || 0));
                      setActivePreset('');
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--line)',
                      background: 'var(--bg)',
                      color: 'var(--ink)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                    }}
                  />
                  <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>One-time configuration / audit</span>
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-software`}
                    style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}
                  >
                    Monthly Software ({symbol}/mo)
                  </label>
                  <input
                    id={`${formId}-software`}
                    type="number"
                    min={0}
                    step={50}
                    value={monthlySoftware}
                    onChange={(e) => {
                      setMonthlySoftware(Math.max(0, Number(e.target.value) || 0));
                      setActivePreset('');
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--line)',
                      background: 'var(--bg)',
                      color: 'var(--ink)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                    }}
                  />
                  <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>AI tool seat licenses</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Output Metrics & Financial Return */}
          <div>
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: 800,
                margin: '0 0 16px',
                color: 'var(--ink)',
                letterSpacing: '-0.01em',
              }}
            >
              Estimated Financial Return &amp; Impact
            </h3>

            {/* Hero ROI Card */}
            <div
              style={{
                padding: '24px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--ink) 0%, #1c2237 100%)',
                color: '#fff',
                marginBottom: '20px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
              }}
            >
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#6ee7b7',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Net Annual Value Created
              </span>
              <div
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  color: '#fff',
                  marginBottom: '10px',
                }}
              >
                {symbol}{formattedNetAnnual}
                <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#A0A5C2', marginLeft: '6px' }}>
                  / year
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#c5cee0', lineHeight: 1.5 }}>
                Net direct value after deducting ongoing software seat licenses ({symbol}{(monthlySoftware * 12).toLocaleString()}/yr).
              </p>
            </div>

            {/* Core Metrics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              {/* Annual Hours Saved */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  background: 'var(--bg)',
                }}
              >
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  Hours Reclaimed
                </div>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
                  {formattedHours} hrs
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  ≈ {formattedWeeklyHours} hrs/wk across team
                </div>
              </div>

              {/* Payback Period */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  background: 'var(--bg)',
                }}
              >
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  Payback Period
                </div>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--brand)', margin: '4px 0' }}>
                  {paybackMonths <= 0
                    ? '< 1 mo'
                    : paybackMonths > 60
                    ? '> 5 yrs'
                    : `${paybackMonths.toFixed(1)} mo`}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  To fully recoup setup cost
                </div>
              </div>

              {/* 1st Year ROI */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  background: 'var(--bg)',
                }}
              >
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  1st Year Net ROI
                </div>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#059669', margin: '4px 0' }}>
                  {firstYearROI > 999 ? '> 999%' : `${Math.round(firstYearROI)}%`}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  Total return on investment
                </div>
              </div>

              {/* 3-Year Cumulative Benefit */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  background: 'var(--bg)',
                }}
              >
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  3-Year Net Benefit
                </div>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
                  {symbol}{formattedThreeYear}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  Cumulative 36-month return
                </div>
              </div>
            </div>

            {/* Visual Before vs After Cost Comparison */}
            <div
              style={{
                padding: '20px',
                borderRadius: '14px',
                border: '1px solid var(--line)',
                background: 'var(--bg)',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '14px',
                }}
              >
                <strong style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>
                  Workflow Cost Comparison (Annual)
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Baseline vs. AI-Assisted</span>
              </div>

              {/* Current Manual Baseline */}
              <div style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8125rem',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ color: 'var(--muted)' }}>Current Manual Labor Baseline</span>
                  <strong style={{ color: 'var(--ink)' }}>{symbol}{Math.round(currentCost).toLocaleString()}</strong>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: 'var(--line)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${currentCostPercent}%`,
                      background: '#94a3b8',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>

              {/* With AI Implementation */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8125rem',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ color: 'var(--brand)', fontWeight: 600 }}>With AI (Retained Labor + Software)</span>
                  <strong style={{ color: 'var(--brand)' }}>{symbol}{Math.round(costWithAi).toLocaleString()}</strong>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: 'var(--line)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${costWithAiPercent}%`,
                      background: 'var(--brand)',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Action / Next Steps Callout */}
            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                background: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div>
                <strong style={{ fontSize: '0.9375rem', color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                  Ready to implement this workflow?
                </strong>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                  Discover benchmarked AI software on GTM Shelf, or consult with GPTify.co for custom agentic workflow implementation.
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <Link
                  href="/stage/prospect"
                  className="btn btn-primary"
                  style={{ fontSize: '0.8125rem', padding: '8px 14px' }}
                >
                  Browse Prospecting Tools →
                </Link>
                <Link
                  href="/custom"
                  className="btn btn-ghost"
                  style={{ fontSize: '0.8125rem', padding: '8px 14px' }}
                >
                  Custom AI Architecture
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Methodology & Formula Accordion / Explanation */}
        <div
          style={{
            marginTop: '36px',
            paddingTop: '24px',
            borderTop: '1px solid var(--line)',
          }}
        >
          <div
            style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'var(--bg)',
              border: '1px solid var(--line)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: '8px' }}>
              Mathematical Methodology &amp; Assumptions
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.6, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div>
                <strong style={{ color: 'var(--ink)' }}>• Annual Baseline Hours:</strong>
                <br />
                <code>(Minutes per task ÷ 60) × Frequency/week × Weeks/year × Team size</code>
              </div>
              <div>
                <strong style={{ color: 'var(--ink)' }}>• Gross Financial Savings:</strong>
                <br />
                <code>Annual Baseline Labor Cost × Automation Rate %</code>
              </div>
              <div>
                <strong style={{ color: 'var(--ink)' }}>• Net Annual Savings:</strong>
                <br />
                <code>Gross Savings - Annual Software Licensing Cost</code>
              </div>
              <div>
                <strong style={{ color: 'var(--ink)' }}>• Payback Period:</strong>
                <br />
                <code>One-time Setup Cost ÷ Monthly Net Benefit</code>
              </div>
            </div>

            {/* Verbatim Disclaimer */}
            <div
              style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid var(--line)',
                fontSize: '0.75rem',
                color: 'var(--muted)',
                fontStyle: 'italic',
              }}
            >
              <strong>Notice:</strong> This is an indicative business estimate, not a financial guarantee. Results vary depending on team adoption, process maturity, and data integration complexity.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
