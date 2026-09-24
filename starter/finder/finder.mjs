// @ts-check
/**
 * GTM Shelf finder: adaptive questions with weighted scoring.
 * Pure functions, no DOM, no network. Ported one-to-one from the prototype
 * (reference/gtm-shelf-prototype.html). finder.test.mjs replays 80 recorded prototype runs
 * (fixtures/prototype-runs.json) and requires identical questions, picks, and reasons.
 *
 * @typedef {Object} FinderTool
 * @property {string} id
 * @property {string} name
 * @property {number} stage            1..5
 * @property {string} cat              category name, must match a name in NEED
 * @property {'Free plan'|'Paid'|'Custom quote'} price
 * @property {string[]} ints           integration names, e.g. ['HubSpot','Slack']
 * @property {number} setup            1 quick, 2 some setup, 3 needs admin or technical help
 * @property {boolean} feat            featured
 * @property {boolean} [published]     omit or true for live tools
 *
 * @typedef {Object} Answers
 * @property {number} [goal]           1..5, or 0 while the person is unsure
 * @property {string} [need]           category name
 * @property {string} [budget]         'free'|'low'|'mid'|'high'
 * @property {string} [size]           'solo'|'small'|'mid'|'large'
 * @property {string} [crm]            'HubSpot'|'Salesforce'|'Google Workspace'|'none'
 * @property {string} [tech]           'easy'|'some'|'pro'
 * @property {string} [must]           'Slack'|'Zapier'|'none'
 * @property {string} [priority]       'price'|'speed'|'depth'
 *
 * @typedef {Object} State
 * @property {Answers} A
 * @property {string[]} order          ids of questions answered so far, in order
 * @property {string} note             set when the fallback path was used
 */

export const STAGES = [
  { id: 1, name: 'Attract', hint: 'Content, SEO, ads, social' },
  { id: 2, name: 'Prospect', hint: 'Find and enrich leads' },
  { id: 3, name: 'Engage', hint: 'Outreach, SDR agents, chat' },
  { id: 4, name: 'Close', hint: 'Calls, meetings, CRM' },
  { id: 5, name: 'Grow', hint: 'Lifecycle and forecasting' },
];

/** Adaptive questions, in the fixed order used to break ties. */
export const ADAPT = ['budget', 'size', 'crm', 'tech', 'must', 'priority'];
export const MAX_QUESTIONS = 10;

/** "What should the tool help you do?" options per stage: [label, category name]. */
export const NEED = {
  1: [['Write content and copy', 'Content writing'], ['Rank higher in search', 'SEO'], ['Make ads and visuals', 'Ad creative'], ['Schedule and manage social posts', 'Social media']],
  2: [['Find contact details for people to reach', 'Lead data'], ['Know which companies are ready to buy', 'Intent signals']],
  3: [['Send outreach emails at scale', 'Email outreach'], ['Let AI agents handle outreach', 'AI SDR agents'], ['Talk to website visitors', 'Chat and conversion']],
  4: [['Learn from recorded sales calls', 'Call intelligence'], ['Capture meeting notes automatically', 'Meeting notes'], ['Keep deals and contacts organized', 'CRM']],
  5: [['Send lifecycle emails and messages', 'Email and lifecycle'], ['Forecast revenue and inspect the pipeline', 'Revenue forecasting']],
};

/** Phrase used in the reason "Focused on ..." for each category. */
export const CATP = {
  'Content writing': 'writing marketing content', 'SEO': 'improving search rankings', 'Ad creative': 'making ad creative',
  'Social media': 'managing social media', 'Lead data': 'finding contact data', 'Intent signals': 'spotting buying intent',
  'Email outreach': 'sending outreach emails', 'AI SDR agents': 'automated outbound with AI agents',
  'Chat and conversion': 'chatting with website visitors', 'Call intelligence': 'analyzing sales calls',
  'Meeting notes': 'capturing meeting notes', 'CRM': 'managing contacts and deals',
  'Email and lifecycle': 'lifecycle email and messaging', 'Revenue forecasting': 'forecasting revenue',
};

/** Question copy. `o` is [label, value]. `need` options depend on the goal, see NEED. */
export const QUESTIONS = {
  goal: { t: 'What do you want more of right now?', h: 'Pick the closest match. You can go back at any time.', o: [['More people finding us', 1], ['A list of the right people to contact', 2], ['More replies and booked calls', 3], ['More deals closed', 4], ['More revenue from current customers, or a clearer forecast', 5], ['I am not sure', 0]] },
  unsure: { t: 'Which of these sounds most like your week?', h: 'No problem. Pick the situation that feels closest.', o: [['We publish and post, but traffic and leads stay flat', 1], ['We do not know who to contact', 2], ['We contact people, but few answer', 3], ['We have opportunities, but they stall', 4], ['New customers arrive, but growth stalls after that', 5], ['None of these fit', -1]] },
  need: { t: 'What should the tool help you do?', h: 'These options match the goal you picked.' },
  budget: { t: 'What can you spend on this tool each month?', h: 'Pricing in the directory is a rough guide. Check each vendor for current plans.', o: [['Nothing, free only', 'free'], ['Up to about $100', 'low'], ['$100 to $500', 'mid'], ['$500 or more, or I can ask for a quote', 'high']] },
  size: { t: 'How many people will use it?', h: 'Team size changes how much setup and admin makes sense.', o: [['Just me', 'solo'], ['2 to 10 people', 'small'], ['11 to 50 people', 'mid'], ['More than 50', 'large']] },
  crm: { t: 'Which system holds your customer records?', h: 'Tools that connect to it move data without copy and paste.', o: [['HubSpot', 'HubSpot'], ['Salesforce', 'Salesforce'], ['Mostly Google Sheets and Gmail', 'Google Workspace'], ['Something else, or nothing yet', 'none']] },
  tech: { t: 'How much setup are you comfortable with?', h: 'Some tools work in minutes. Others need an admin.', o: [['I want to sign up and start today', 'easy'], ['I can configure some workflows', 'some'], ['I have technical or admin help', 'pro']] },
  must: { t: 'Does it need to connect with Slack or Zapier?', h: 'Pick the one that matters most to you.', o: [['Slack', 'Slack'], ['Zapier', 'Zapier'], ['Neither', 'none']] },
  priority: { t: 'If you had to pick one, what matters most?', h: 'This breaks ties between good options.', o: [['The lowest price', 'price'], ['The fastest start', 'speed'], ['The deepest features', 'depth']] },
};

export const FALLBACK_NOTE = 'Nothing stood out, so we started with a CRM. Most other sales tools plug into one.';

const has = (list, x) => list.indexOf(x) >= 0;
const stageName = (id) => (STAGES.find((s) => s.id === id) || { name: '' }).name;

/**
 * @param {FinderTool[]} allTools
 */
export function createFinder(allTools) {
  const tools = allTools.filter((t) => t.published !== false);

  /** @param {string} id @param {Answers} A @returns {Array<[string, any]>} */
  function optsFor(id, A) {
    if (id === 'need') return NEED[/** @type {number} */ (A.goal)].map((o) => [o[0], o[1]]);
    return /** @type {any} */ (QUESTIONS)[id].o;
  }

  /** Score one tool for the answers so far. Higher is better. */
  function scoreTool(t, A) {
    let s = 0;
    const why = [];
    const watch = [];
    const W = (x) => { if (!has(why, x)) why.push(x); };
    const K = (x) => { if (!has(watch, x)) watch.push(x); };

    if (A.need) {
      if (t.cat === A.need) { s += 80; W('Focused on ' + CATP[t.cat]); }
      else { s += 8; W('A related option at the ' + stageName(t.stage).toLowerCase() + ' stage'); }
    }
    if (t.feat) s += 3;

    const b = A.budget;
    if (b === 'free') {
      if (t.price === 'Free plan') { s += 20; W('Has a free plan'); }
      else if (t.price === 'Paid') { s -= 25; K('No free plan listed'); }
      else { s -= 40; K('Pricing is by quote'); }
    } else if (b === 'low') {
      if (t.price === 'Free plan') { s += 15; W('Free plan to start with'); }
      else if (t.price === 'Paid') { s += 10; K('Paid plans, so check the price fits your budget'); }
      else { s -= 30; K('Pricing is by quote, so it may exceed your budget'); }
    } else if (b === 'mid') {
      if (t.price === 'Free plan') s += 5;
      else if (t.price === 'Paid') s += 15;
      else { s -= 10; K('Pricing is by quote'); }
    } else if (b === 'high') {
      if (t.price === 'Custom quote') { s += 15; W('Quote-based pricing fits a larger budget'); }
      else if (t.price === 'Paid') s += 5;
    }

    const z = A.size;
    if (z === 'solo') {
      if (t.setup === 1) { s += 10; W('Quick to set up, which suits a one-person team'); }
      else if (t.setup === 3) { s -= 15; K('Aimed at larger teams and may be heavy for one person'); }
      if (t.price === 'Custom quote') s -= 10;
    } else if (z === 'small') {
      if (t.setup && t.setup <= 2) { s += 5; W('Manageable setup for a small team'); }
      else if (t.setup === 3) s -= 5;
    } else if (z === 'large') {
      if (t.price === 'Custom quote') { s += 8; W('Suited to larger teams'); }
      if (t.setup === 3) s += 8; else if (t.setup === 1) s -= 3;
    }

    const c = A.crm;
    if (c === 'HubSpot' || c === 'Salesforce') {
      if (has(t.ints, c) || t.name === c) { s += 15; W(t.name === c ? 'It is the ' + c + ' CRM you already use' : 'Works with ' + c); }
      else { s -= 6; K('No ' + c + ' integration listed'); }
    } else if (c === 'Google Workspace') {
      if (has(t.ints, c)) { s += 8; W('Works with Google Workspace'); }
    }

    const h = A.tech;
    if (h === 'easy') {
      if (t.setup === 1) { s += 12; W('Quick to set up'); }
      else if (t.setup === 3) { s -= 18; K('Needs admin or technical setup'); }
    } else if (h === 'some') {
      if (t.setup === 1) s += 4; else if (t.setup === 2) s += 6;
      else if (t.setup === 3) { s -= 5; K('Needs admin or technical setup'); }
    } else if (h === 'pro') {
      if (t.setup === 3) s += 8; else if (t.setup === 2) s += 4;
    }

    const m = A.must;
    if (m === 'Slack' || m === 'Zapier') {
      if (has(t.ints, m)) { s += 10; W('Connects with ' + m); }
      else { s -= 10; K('No ' + m + ' integration listed'); }
    }

    const p = A.priority;
    if (p === 'price') {
      if (t.price === 'Free plan') s += 10; else if (t.price === 'Paid') s += 4; else s -= 8;
    } else if (p === 'speed') {
      if (t.setup === 1) { s += 10; W('Quick to set up'); }
      else if (t.setup === 2) s += 3; else if (t.setup === 3) s -= 8;
    } else if (p === 'depth') {
      if (t.price === 'Custom quote' || t.setup === 3) s += 8;
      if (t.feat) s += 2;
    }

    if (!why.length) W('Listed at the ' + stageName(t.stage).toLowerCase() + ' stage');
    return { s, why, watch };
  }

  /**
   * Rank the tools in the chosen stage. The best tool in the exact category
   * always makes the top three, even when budget or team size count against it.
   * @param {Answers} A
   */
  function rank(A) {
    const out = tools
      .filter((t) => t.stage === A.goal)
      .map((t) => ({ tool: t, ...scoreTool(t, A) }))
      .sort((a, b) => b.s - a.s || (b.tool.feat ? 1 : 0) - (a.tool.feat ? 1 : 0) || a.tool.name.localeCompare(b.tool.name, 'en'));
    if (A.need) {
      const isCat = (o) => o.tool.cat === A.need;
      if (!out.slice(0, 3).some(isCat)) {
        let k = -1;
        for (let j = 3; j < out.length; j++) { if (isCat(out[j])) { k = j; break; } }
        if (k >= 0) { const item = out.splice(k, 1)[0]; out.splice(2, 0, item); }
      }
    }
    return out;
  }

  const sig = (A) => rank(A).slice(0, 3).map((o) => o.tool.id).join(',');

  /** How many different top-three results could this question produce? 1 means it would not change anything. */
  function distinct(id, A) {
    const seen = {};
    optsFor(id, A).forEach((o) => { seen[sig({ ...A, [id]: o[1] })] = 1; });
    return Object.keys(seen).length;
  }

  /** Number of remaining questions that could still change the top three. */
  function relevantRemaining(A) {
    return ADAPT.filter((id) => A[id] === undefined && distinct(id, A) > 1).length;
  }

  /** @returns {State} */
  function start() { return { A: {}, order: [], note: '' }; }

  /**
   * The next question id, or null when the result is ready.
   * Rules: goal, then unsure (if goal is 0), then need, then the adaptive question
   * whose answer could change the top three the most. At least one adaptive
   * question is always asked (3 questions minimum), at most MAX_QUESTIONS in total.
   * @param {State} st
   * @returns {string|null}
   */
  function nextQuestion(st) {
    const A = st.A;
    if (A.goal === undefined) return 'goal';
    if (A.goal === 0) return 'unsure';
    if (!A.need) return 'need';
    if (st.order.length >= MAX_QUESTIONS) return null;
    const rem = ADAPT.filter((id) => A[id] === undefined);
    if (!rem.length) return null;
    let best = null; let bestN = 1;
    rem.forEach((id) => { const n = distinct(id, A); if (n > bestN) { best = id; bestN = n; } });
    if (best) return best;
    const asked = st.order.filter((id) => has(ADAPT, id)).length;
    return asked === 0 ? rem[0] : null;
  }

  /**
   * Apply one answer and return the new state (does not mutate).
   * For 'unsure', pass -1 for "None of these fit": it falls back to goal 4, need 'CRM'.
   * @param {State} st @param {string} id @param {any} value @returns {State}
   */
  function answer(st, id, value) {
    const A = { ...st.A };
    let note = st.note;
    if (id === 'unsure' && value === -1) { A.goal = 4; A.need = 'CRM'; note = FALLBACK_NOTE; }
    else if (id === 'unsure') A.goal = value;
    else /** @type {any} */ (A)[id] = value;
    return { A, order: [...st.order, id], note };
  }

  /**
   * Everything the results page needs.
   * @param {State} st
   */
  function results(st) {
    const A = st.A;
    const ranked = rank(A);
    const remaining = ADAPT.filter((id) => A[id] === undefined).length;
    return {
      picks: ranked.slice(0, 3),
      alternatives: ranked.slice(3, 6),
      exactCategoryCount: ranked.filter((o) => o.tool.cat === A.need).length,
      questionsAsked: st.order.length,
      stoppedEarly: remaining > 0 && st.order.length < MAX_QUESTIONS,
      note: st.note,
      summaryPhrase: A.need ? CATP[A.need] : '',
      stage: stageName(/** @type {number} */ (A.goal)),
    };
  }

  return { optsFor, scoreTool, rank, start, nextQuestion, answer, results, relevantRemaining };
}
