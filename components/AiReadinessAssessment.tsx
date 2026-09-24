'use client';

import { useState } from 'react';
import Link from 'next/link';

type Track = 'individual' | 'company' | null;

interface Dimension {
  name: string;
  short: string;
  icon: string;
  description: string;
  questions: string[];
  action: string;
}

const SCALE = ['Not started', 'Exploring', 'Defined', 'Active', 'Scaled'];

const COMPANY_DIMENSIONS: Dimension[] = [
  {
    name: 'Strategy & Leadership',
    short: 'Strategy',
    icon: '◎',
    description: 'How clearly AI is connected to business priorities, ownership and investment.',
    questions: [
      'We have defined business outcomes that AI should support.',
      'A senior leader has clear responsibility for AI adoption.',
      'AI initiatives are prioritised against strategic value and feasibility.',
      'Budget and resources are available for experimentation and implementation.',
    ],
    action: 'Define an executive sponsor, target outcomes and a prioritised AI initiative portfolio.',
  },
  {
    name: 'People & AI Literacy',
    short: 'People',
    icon: '◇',
    description: 'Whether employees have the skills, confidence and support to use AI responsibly.',
    questions: [
      'Employees understand the opportunities and limitations of generative AI.',
      'Relevant teams receive practical, role-specific AI training.',
      'Responsibilities for human review and decision-making are understood.',
      'Leaders actively support adoption, experimentation and responsible use.',
    ],
    action: 'Build role-specific AI literacy, clarify responsibilities and support adoption through practical training.',
  },
  {
    name: 'Processes & Use Cases',
    short: 'Processes',
    icon: '↻',
    description: 'How effectively workflows are understood, prioritised and prepared for AI.',
    questions: [
      'We have identified repetitive or high-value processes suitable for AI.',
      'Processes are documented well enough to assess automation opportunities.',
      'Use cases are evaluated by value, effort, risk and data requirements.',
      'We test selected use cases through measurable pilots before scaling.',
    ],
    action: 'Map key workflows, score use cases and launch one measurable, well-bounded pilot.',
  },
  {
    name: 'Data & Knowledge',
    short: 'Data',
    icon: '▤',
    description: 'Whether useful information is accurate, accessible and ready for AI-enabled work.',
    questions: [
      'Important business data and knowledge sources are clearly identified.',
      'Teams can access current, accurate and appropriately governed information.',
      'Data quality and ownership issues are actively managed.',
      'AI solutions can connect to the knowledge and systems they require.',
    ],
    action: 'Inventory critical data and knowledge, assign ownership and address priority access or quality gaps.',
  },
  {
    name: 'Governance & Risk',
    short: 'Governance',
    icon: '✓',
    description: 'How the organisation manages acceptable use, privacy, oversight and AI risk.',
    questions: [
      'We have clear guidance or policy for acceptable employee use of AI.',
      'Confidential, personal and regulated information is protected.',
      'High-impact or customer-facing AI outputs receive appropriate human review.',
      'AI risks, incidents, vendors and changes are documented and monitored.',
    ],
    action: 'Establish an AI usage policy, risk classification, human oversight rules and incident process.',
  },
  {
    name: 'Technology & Integration',
    short: 'Technology',
    icon: '⌘',
    description: 'Whether the technical environment can support secure, reliable and scalable AI.',
    questions: [
      'Approved AI tools and purchasing criteria are defined.',
      'Security, identity and access requirements are applied to AI solutions.',
      'Current systems can support the integrations needed for priority use cases.',
      'AI solutions are monitored for reliability, cost, adoption and performance.',
    ],
    action: 'Define a secure AI architecture, approved-tool criteria and an integration plan for priority workflows.',
  },
];

const INDIVIDUAL_DIMENSIONS: Dimension[] = [
  {
    name: 'AI Literacy & Understanding',
    short: 'AI Literacy',
    icon: '◉',
    description: 'How well you understand what AI can do, where it can fail and when it should not be used.',
    questions: [
      'I understand the main capabilities and limitations of generative AI.',
      'I can recognise when an AI answer requires stronger evidence or verification.',
      'I understand the privacy and security risks of sharing information with AI tools.',
      'I know when a task should not be delegated to AI.',
    ],
    action: 'Strengthen your AI foundations, including limitations, privacy, verification and appropriate-use decisions.',
  },
  {
    name: 'Daily Use & Productivity',
    short: 'Daily Use',
    icon: '↗',
    description: 'How consistently you turn suitable everyday work into faster, higher-quality AI-assisted workflows.',
    questions: [
      'I can identify repetitive or time-consuming tasks where AI could help.',
      'I regularly use AI for work such as research, writing, planning or analysis.',
      'I have reusable templates or workflows for tasks I perform repeatedly.',
      'I track whether AI improves my time, quality or results.',
    ],
    action: 'Select two recurring tasks, create reusable AI-assisted workflows and measure the time or quality gained.',
  },
  {
    name: 'Prompting & Interaction',
    short: 'Prompting',
    icon: '✦',
    description: 'How effectively you give AI context, direction, constraints and feedback.',
    questions: [
      'I clearly state the objective, context and intended audience in my instructions.',
      'I specify useful constraints, quality criteria and the required output format.',
      'I refine prompts and follow up when the first response is not good enough.',
      'I know how to use examples, source material or reference content to improve results.',
    ],
    action: 'Build a simple prompt framework and save reusable prompts for your most valuable recurring tasks.',
  },
  {
    name: 'Role-Specific Workflows',
    short: 'Workflows',
    icon: '↻',
    description: 'How well AI is integrated into the real processes, tools and decisions in your role.',
    questions: [
      'I have identified high-value AI use cases that are specific to my role.',
      'I can move AI outputs into the tools and processes where work continues.',
      'I standardise successful AI workflows instead of starting from scratch each time.',
      'I keep clear human ownership and approval points in AI-assisted work.',
    ],
    action: 'Map one end-to-end role-specific workflow, define human checkpoints and turn it into a repeatable process.',
  },
  {
    name: 'Verification & Judgement',
    short: 'Verification',
    icon: '✓',
    description: 'How reliably you review AI output using evidence, expertise and critical thinking.',
    questions: [
      'I verify important facts, sources, calculations and claims before using AI output.',
      'I check AI output for bias, missing context and unsupported assumptions.',
      'I edit AI output using my own professional knowledge and judgement.',
      'I know when to escalate a decision or involve a qualified person.',
    ],
    action: 'Create a verification checklist for high-impact work and define what always requires expert or human review.',
  },
  {
    name: 'Responsible Growth',
    short: 'Growth',
    icon: '◇',
    description: 'How safely and deliberately you develop your AI capability over time.',
    questions: [
      'I follow my employer or client rules for acceptable AI use.',
      'I avoid entering confidential, personal or restricted information into unapproved tools.',
      'I regularly test new AI methods and keep my knowledge current.',
      'I share useful lessons, prompts or workflows with colleagues when appropriate.',
    ],
    action: 'Set a monthly learning routine, follow approved-use rules and document useful experiments for continuous improvement.',
  },
];

export function AiReadinessAssessment() {
  const [track, setTrack] = useState<Track>(null);
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<(number | null)[][]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const dimensions = track === 'individual' ? INDIVIDUAL_DIMENSIONS : COMPANY_DIMENSIONS;

  function startTrack(selectedTrack: 'individual' | 'company') {
    const dims = selectedTrack === 'individual' ? INDIVIDUAL_DIMENSIONS : COMPANY_DIMENSIONS;
    setTrack(selectedTrack);
    setStep(0);
    setAnswers(dims.map(() => Array(4).fill(null)));
    setErrorMsg(null);
    setIsFinished(false);
  }

  function resetToTrackSelect() {
    setTrack(null);
    setStep(0);
    setAnswers([]);
    setErrorMsg(null);
    setIsFinished(false);
  }

  function handleSelectOption(questionIndex: number, value: number) {
    setErrorMsg(null);
    setAnswers((prev) => {
      const copy = prev.map((arr) => [...arr]);
      copy[step][questionIndex] = value;
      return copy;
    });
  }

  function handleNext() {
    const currentStepAnswers = answers[step] || [];
    if (currentStepAnswers.some((val) => val === null)) {
      setErrorMsg('Please select an option for each question before continuing.');
      return;
    }
    setErrorMsg(null);
    if (step < dimensions.length - 1) {
      setStep(step + 1);
    } else {
      setIsFinished(true);
    }
  }

  function handleBack() {
    if (step > 0) {
      setErrorMsg(null);
      setStep(step - 1);
    }
  }

  // Calculate scores
  const dimensionScores = answers.map((arr) => {
    const sum = arr.reduce((acc: number, val) => acc + (val ?? 0), 0);
    return Math.round((sum / 16) * 100);
  });

  const overallScore =
    dimensionScores.length > 0
      ? Math.round(dimensionScores.reduce((acc, s) => acc + s, 0) / dimensionScores.length)
      : 0;

  // Maturity classification
  let maturityLevel = '';
  let maturityCopy = '';
  let subject = track === 'individual' ? 'You' : 'Your organisation';

  if (track === 'individual') {
    if (overallScore < 25) {
      maturityLevel = 'starting your AI journey';
      maturityCopy = 'Begin with core AI literacy, safe-use habits and one simple daily workflow.';
    } else if (overallScore < 50) {
      maturityLevel = 'building your foundations';
      maturityCopy = 'You have useful early experience. Focus on repeatable workflows, stronger prompting and consistent verification.';
    } else if (overallScore < 70) {
      maturityLevel = 'a capable AI practitioner';
      maturityCopy = 'Your foundations are working. Close your priority gaps and apply AI more consistently to role-specific work.';
    } else if (overallScore < 85) {
      maturityLevel = 'a confident AI user';
      maturityCopy = 'You are ready to standardise successful workflows, measure results and help others adopt responsible practices.';
    } else {
      maturityLevel = 'ready to lead with AI';
      maturityCopy = 'Your capability is advanced. Keep improving, share proven methods and focus on high-value, responsible innovation.';
    }
  } else {
    if (overallScore < 25) {
      maturityLevel = 'at the exploring stage';
      maturityCopy = 'Build a clear foundation before investing in larger AI initiatives.';
    } else if (overallScore < 50) {
      maturityLevel = 'emerging';
      maturityCopy = 'Early activity exists, but stronger coordination, skills and governance are needed.';
    } else if (overallScore < 70) {
      maturityLevel = 'developing';
      maturityCopy = 'Good foundations are forming. Focus on closing priority gaps and proving value through measured pilots.';
    } else if (overallScore < 85) {
      maturityLevel = 'operational';
      maturityCopy = 'Your organisation is positioned to scale successful use cases with stronger measurement and consistency.';
    } else {
      maturityLevel = 'ready to scale';
      maturityCopy = 'AI capabilities are well developed. Focus on continuous improvement, assurance and enterprise-wide value.';
    }
  }

  // Priorities: 3 lowest dimension scores
  const ranked = dimensionScores
    .map((score, index) => ({ score, index }))
    .sort((a, b) => a.score - b.score);
  const topPriorities = ranked.slice(0, 3);
  const phases = ['First 30 days', 'Days 31–60', 'Days 61–90'];

  const answeredCount = answers.flat().filter((x) => x !== null).length;
  const totalQuestions = dimensions.length * 4;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
      {/* Top Bar Header */}
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
            <div style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
              {track ? `${track === 'individual' ? 'Individual' : 'Company'} AI Readiness Workspace` : 'AI Readiness Diagnostic'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#A0A5C2' }}>Client-side assessment • Answers stay in your browser</div>
          </div>
        </div>

        {track && (
          <button
            type="button"
            onClick={resetToTrackSelect}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ECEEF9',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Switch Track ↺
          </button>
        )}
      </div>

      {/* Main Container */}
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
        {/* Step 0: Track Selection */}
        {!track && (
          <div>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--brand)',
                  marginBottom: '8px',
                }}
              >
                Choose Your Assessment Track
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  margin: '0 0 12px',
                  color: 'var(--ink)',
                }}
              >
                What would you like to evaluate?
              </h2>
              <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                Both tracks take about 5–8 minutes and generate a tailored readiness score, dimension breakdown, priority gaps, and a practical 90-day action plan.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px',
              }}
            >
              {/* Individual Track */}
              <div
                style={{
                  padding: '32px',
                  borderRadius: '16px',
                  border: '1.5px solid var(--line)',
                  background: 'var(--bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'var(--brand-soft)',
                      color: 'var(--brand)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '1.5rem',
                      marginBottom: '20px',
                    }}
                  >
                    ◇
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand)', marginBottom: '6px' }}>
                    For Professionals &amp; Knowledge Workers
                  </div>
                  <h3 style={{ fontSize: '1.375rem', fontWeight: 800, margin: '0 0 10px', color: 'var(--ink)' }}>
                    Individual AI Readiness
                  </h3>
                  <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Assess your personal AI literacy, daily productivity, prompt engineering skills, role-specific workflows, verification rigour, and responsible growth habits.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li style={{ fontSize: '0.8125rem', color: 'var(--muted)', display: 'flex', gap: '8px' }}>
                      <span style={{ color: 'var(--brand)', fontWeight: 'bold' }}>✓</span> 6 practical individual dimensions
                    </li>
                    <li style={{ fontSize: '0.8125rem', color: 'var(--muted)', display: 'flex', gap: '8px' }}>
                      <span style={{ color: 'var(--brand)', fontWeight: 'bold' }}>✓</span> Personal prompt &amp; workflow recommendations
                    </li>
                    <li style={{ fontSize: '0.8125rem', color: 'var(--muted)', display: 'flex', gap: '8px' }}>
                      <span style={{ color: 'var(--brand)', fontWeight: 'bold' }}>✓</span> 100% private in-browser evaluation
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => startTrack('individual')}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px 18px', fontSize: '0.9375rem' }}
                >
                  Start Individual Assessment →
                </button>
              </div>

              {/* Company Track */}
              <div
                style={{
                  padding: '32px',
                  borderRadius: '16px',
                  border: '1.5px solid var(--line)',
                  background: 'var(--bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'var(--brand-soft)',
                      color: 'var(--brand)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '1.5rem',
                      marginBottom: '20px',
                    }}
                  >
                    ▦
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand)', marginBottom: '6px' }}>
                    For Teams, Founders &amp; RevOps Leaders
                  </div>
                  <h3 style={{ fontSize: '1.375rem', fontWeight: 800, margin: '0 0 10px', color: 'var(--ink)' }}>
                    Company AI Readiness
                  </h3>
                  <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    Assess enterprise strategy &amp; leadership, workforce AI literacy, process mapping, data foundation, governance &amp; compliance, and integration infrastructure.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li style={{ fontSize: '0.8125rem', color: 'var(--muted)', display: 'flex', gap: '8px' }}>
                      <span style={{ color: 'var(--brand)', fontWeight: 'bold' }}>✓</span> 6 organizational maturity pillars
                    </li>
                    <li style={{ fontSize: '0.8125rem', color: 'var(--muted)', display: 'flex', gap: '8px' }}>
                      <span style={{ color: 'var(--brand)', fontWeight: 'bold' }}>✓</span> 90-day executive roadmap output
                    </li>
                    <li style={{ fontSize: '0.8125rem', color: 'var(--muted)', display: 'flex', gap: '8px' }}>
                      <span style={{ color: 'var(--brand)', fontWeight: 'bold' }}>✓</span> Shareable &amp; printable executive audit
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => startTrack('company')}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px 18px', fontSize: '0.9375rem' }}
                >
                  Start Company Assessment →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 1-6: Question Flow */}
        {track && !isFinished && (
          <div>
            {/* Dimension Progress Indicator */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '12px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--brand)',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Dimension {step + 1} of {dimensions.length}
                </span>
                <strong style={{ fontSize: '1.125rem', color: 'var(--ink)' }}>
                  {dimensions[step].name}
                </strong>
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--muted)' }}>
                {progressPercent}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                height: '8px',
                borderRadius: '4px',
                background: 'var(--line)',
                overflow: 'hidden',
                marginBottom: '28px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${((step) / dimensions.length) * 100}%`,
                  background: 'var(--brand)',
                  borderRadius: '4px',
                  transition: 'width 0.25s ease',
                }}
              />
            </div>

            {/* Dimension Header Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                borderRadius: '12px',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                marginBottom: '28px',
              }}
            >
              <span
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'var(--brand-soft)',
                  color: 'var(--brand)',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  flexShrink: 0,
                }}
              >
                {dimensions[step].icon}
              </span>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.125rem', fontWeight: 700, color: 'var(--ink)' }}>
                  {dimensions[step].name}
                </h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                  {dimensions[step].description}
                </p>
              </div>
            </div>

            {/* 4 Questions for current dimension */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {dimensions[step].questions.map((question, qIdx) => {
                const currentAnswer = answers[step]?.[qIdx];
                return (
                  <div
                    key={qIdx}
                    style={{
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid var(--line)',
                      background: 'var(--bg)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: 'var(--ink)',
                        lineHeight: 1.45,
                        marginBottom: '16px',
                      }}
                    >
                      {qIdx + 1}. {question}
                    </div>

                    {/* Scale choices (0 to 4) */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                        gap: '8px',
                      }}
                    >
                      {SCALE.map((label, scaleValue) => {
                        const isChecked = currentAnswer === scaleValue;
                        return (
                          <button
                            key={scaleValue}
                            type="button"
                            onClick={() => handleSelectOption(qIdx, scaleValue)}
                            style={{
                              padding: '10px 8px',
                              borderRadius: '8px',
                              border: `1.5px solid ${isChecked ? 'var(--brand)' : 'var(--line)'}`,
                              background: isChecked ? 'var(--brand)' : 'var(--surface)',
                              color: isChecked ? 'var(--brand-ink)' : 'var(--ink)',
                              fontSize: '0.8125rem',
                              fontWeight: isChecked ? 700 : 500,
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Error Message if not all selected */}
            {errorMsg && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#dc2626',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* Navigation buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1px solid var(--line)',
              }}
            >
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 0}
                className="btn btn-ghost"
                style={{
                  padding: '10px 20px',
                  fontSize: '0.875rem',
                  opacity: step === 0 ? 0.4 : 1,
                  cursor: step === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                ← Previous Dimension
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
                style={{
                  padding: '10px 24px',
                  fontSize: '0.875rem',
                }}
              >
                {step === dimensions.length - 1 ? 'Calculate My Results →' : 'Continue to Next Dimension →'}
              </button>
            </div>
          </div>
        )}

        {/* Step Final: Results & 90-Day Action Plan */}
        {track && isFinished && (
          <div>
            {/* Results Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '32px',
                alignItems: 'center',
                paddingBottom: '32px',
                borderBottom: '1px solid var(--line)',
                marginBottom: '32px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--brand)',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Diagnostic Audit Results
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)',
                    fontWeight: 800,
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                    margin: '0 0 12px',
                    color: 'var(--ink)',
                  }}
                >
                  {subject} is <span style={{ color: 'var(--brand)' }}>{maturityLevel}</span>.
                </h2>
                <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                  {maturityCopy}
                </p>
              </div>

              {/* Circular Overall Score Card */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    background: `conic-gradient(var(--brand) ${overallScore * 3.6}deg, var(--line) 0deg)`,
                    padding: '12px',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: 'var(--surface)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>
                      {overallScore}
                    </span>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.05em' }}>
                      OUT OF 100
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2-Column Breakdown: Dimension Scores & Priority Focus Areas */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px',
                marginBottom: '32px',
              }}
            >
              {/* Left Column: Dimension Scores */}
              <div
                style={{
                  padding: '24px',
                  borderRadius: '14px',
                  border: '1px solid var(--line)',
                  background: 'var(--bg)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--ink)' }}>Readiness by Dimension</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Score (0–100)</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {dimensions.map((d, i) => {
                    const score = dimensionScores[i];
                    return (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{d.name}</span>
                          <strong style={{ color: 'var(--brand)' }}>{score}</strong>
                        </div>
                        <div style={{ height: '8px', borderRadius: '4px', background: 'var(--line)', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${score}%`,
                              background: 'var(--brand)',
                              borderRadius: '4px',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Top Priorities */}
              <div
                style={{
                  padding: '24px',
                  borderRadius: '14px',
                  border: '1px solid var(--line)',
                  background: 'var(--bg)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--ink)' }}>Top Priority Focus Areas</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Lowest scoring pillars</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {topPriorities.map((item, n) => {
                    const d = dimensions[item.index];
                    return (
                      <div
                        key={item.index}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          padding: '12px',
                          borderRadius: '10px',
                          background: 'var(--surface)',
                          border: '1px solid var(--line)',
                        }}
                      >
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: 'var(--brand-soft)',
                            color: 'var(--brand)',
                            fontSize: '0.8125rem',
                            fontWeight: 800,
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                          }}
                        >
                          0{n + 1}
                        </span>
                        <div>
                          <strong style={{ fontSize: '0.875rem', color: 'var(--ink)', display: 'block', marginBottom: '2px' }}>
                            {d.name} (Score: {item.score})
                          </strong>
                          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                            {d.action}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 90-Day Action Plan Grid */}
            <div
              style={{
                padding: '28px',
                borderRadius: '16px',
                border: '1px solid var(--line)',
                background: 'var(--bg)',
                marginBottom: '32px',
              }}
            >
              <div style={{ marginBottom: '20px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--brand)',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Tailored Implementation Sequence
                </span>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)' }}>
                  Your 90-Day Action Plan
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '16px',
                }}
              >
                {topPriorities.map((item, idx) => {
                  const d = dimensions[item.index];
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '20px',
                        borderRadius: '12px',
                        background: 'var(--surface)',
                        border: '1px solid var(--line)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: 'var(--brand)',
                            display: 'block',
                            marginBottom: '8px',
                          }}
                        >
                          {phases[idx]}
                        </span>
                        <h4 style={{ margin: '0 0 8px', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--ink)' }}>
                          {d.name}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                          {d.action}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contextual CTA Box */}
            <div
              style={{
                padding: '24px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, var(--ink) 0%, #1c2237 100%)',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                marginBottom: '28px',
              }}
            >
              <div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '4px' }}>
                  {track === 'individual'
                    ? 'Want to accelerate your AI workflow adoption?'
                    : 'Want an expert review of your organizational readiness?'}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#c5cee0', lineHeight: 1.45 }}>
                  {track === 'individual'
                    ? 'Talk to us about tailored workflow training, prompting frameworks, and task automation.'
                    : 'Talk to us to validate your priority gaps, audit your data readiness, and build your 90-day roadmap.'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href="#talk-to-us"
                  className="btn btn-primary"
                  style={{ fontSize: '0.875rem' }}
                >
                  Talk to us ↓
                </a>
              </div>
            </div>

            {/* Action Bar (Print, Retake, Switch Track) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                paddingTop: '16px',
                borderTop: '1px solid var(--line)',
              }}
            >
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-ghost"
                style={{ fontSize: '0.875rem' }}
              >
                Print / Save PDF Plan
              </button>
              <button
                type="button"
                onClick={() => startTrack(track)}
                className="btn btn-ghost"
                style={{ fontSize: '0.875rem' }}
              >
                Retake This Track
              </button>
              <button
                type="button"
                onClick={resetToTrackSelect}
                className="btn btn-ghost"
                style={{ fontSize: '0.875rem' }}
              >
                Choose Another Track
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Verbatim Disclaimer & Footnote */}
      <div
        style={{
          marginTop: '24px',
          padding: '20px',
          borderRadius: '12px',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.8125rem',
          color: 'var(--muted)',
        }}
      >
        <div style={{ maxWidth: '820px', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--ink)' }}>How to use this result:</strong> This is an indicative self-assessment, not a certification or compliance determination. Discuss responses with relevant leaders and employees, validate the evidence behind each rating, and revisit the assessment as your organisation develops.
        </div>
        <Link href="/free-tools" style={{ color: 'var(--brand)', fontWeight: 700 }}>
          Explore More Free Tools →
        </Link>
      </div>
    </div>
  );
}
