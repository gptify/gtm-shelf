// Run with: node --test
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createFinder, QUESTIONS, ADAPT, MAX_QUESTIONS, FALLBACK_NOTE } from './finder.mjs';

const read = (p) => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), 'utf8'));
const tools = read('./fixtures/tools.json').map((t) => ({
  id: t.id, name: t.name, stage: t.stage, cat: t.cat, price: t.price, ints: t.ints, setup: t.setup, feat: t.feat,
}));
const finder = createFinder(tools);
const idOfTitle = Object.fromEntries(Object.entries(QUESTIONS).map(([id, q]) => [q.t, id]));

/** Play a list of [questionId, value] and return the final state. Asserts the asked question matches. */
function play(steps) {
  let st = finder.start();
  for (const [id, value] of steps) {
    assert.equal(finder.nextQuestion(st), id, `expected next question ${id}`);
    st = finder.answer(st, id, value);
  }
  return st;
}
const names = (list) => list.map((o) => o.tool.name);

test('golden: 80 recorded runs of the prototype produce identical questions, picks, and reasons', () => {
  const runs = read('./fixtures/prototype-runs.json');
  for (const [i, r] of runs.entries()) {
    let st = finder.start();
    for (const step of r.path) {
      const id = finder.nextQuestion(st);
      assert.equal(id, idOfTitle[step.title], `run ${i}: question`);
      const opts = finder.optsFor(id, st.A);
      assert.equal(opts.length, step.n, `run ${i}: option count for ${id}`);
      st = finder.answer(st, id, opts[step.k][1]);
    }
    assert.equal(finder.nextQuestion(st), null, `run ${i}: should be finished`);
    const res = finder.results(st);
    assert.deepEqual(names(res.picks), r.picks, `run ${i}: picks`);
    assert.deepEqual(names(res.alternatives), r.alts, `run ${i}: alternatives`);
    res.picks.forEach((o, k) => {
      assert.deepEqual(o.why.slice(0, 3), r.reasons[k].why, `run ${i}: reasons for pick ${k + 1}`);
      const watch = o.watch.length ? 'Keep in mind: ' + o.watch.slice(0, 2).join('; ') + '.' : '';
      assert.equal(watch, r.reasons[k].watch, `run ${i}: watch line for pick ${k + 1}`);
    });
  }
});

test('starts with the goal question, and asks the follow-up when the person is unsure', () => {
  let st = finder.start();
  assert.equal(finder.nextQuestion(st), 'goal');
  st = finder.answer(st, 'goal', 0);
  assert.equal(finder.nextQuestion(st), 'unsure');
  st = finder.answer(st, 'unsure', 3);
  assert.equal(st.A.goal, 3);
  assert.equal(finder.nextQuestion(st), 'need');
});

test('"None of these fit" falls back to a CRM and explains why', () => {
  let st = finder.start();
  st = finder.answer(st, 'goal', 0);
  st = finder.answer(st, 'unsure', -1);
  assert.equal(st.A.goal, 4);
  assert.equal(st.A.need, 'CRM');
  assert.equal(st.note, FALLBACK_NOTE);
  assert.notEqual(finder.nextQuestion(st), 'need');
});

test('cold email for a solo user stops after 3 questions with lemlist, Instantly, Smartlead', () => {
  const st = play([['goal', 3], ['need', 'Email outreach'], ['size', 'solo']]);
  assert.equal(finder.nextQuestion(st), null);
  const res = finder.results(st);
  assert.deepEqual(names(res.picks), ['lemlist', 'Instantly', 'Smartlead']);
  assert.equal(res.questionsAsked, 3);
  assert.equal(res.stoppedEarly, true);
});

test('meeting notes with a large budget stops after 3 questions', () => {
  const st = play([['goal', 4], ['need', 'Meeting notes'], ['budget', 'high']]);
  assert.equal(finder.nextQuestion(st), null);
  assert.deepEqual(names(finder.results(st).picks), ['Fireflies', 'Fathom', 'Otter']);
});

test('a tool in the exact category always makes the top three, even against a free-only budget', () => {
  // The order of adaptive questions depends on the answers, so answer whatever is asked.
  const values = { budget: 'free', size: 'solo', crm: 'HubSpot', tech: 'easy', must: 'Slack', priority: 'price' };
  let st = finder.answer(finder.answer(finder.start(), 'goal', 4), 'need', 'Call intelligence');
  for (let id = finder.nextQuestion(st); id; id = finder.nextQuestion(st)) st = finder.answer(st, id, values[id]);
  assert.ok(st.A.budget === 'free' && st.A.size === 'solo', 'budget and team size should have been asked');
  const top = finder.results(st).picks;
  assert.ok(names(top).includes('Gong'), 'Gong is the only call-intelligence tool and must be shown');
  const gong = top.find((o) => o.tool.name === 'Gong');
  assert.ok(gong.watch.length > 0, 'and it should carry a warning about price or team size');
});

test('at least one adaptive question is always asked before the result (3 questions minimum)', () => {
  for (const goal of [1, 2, 3, 4, 5]) {
    for (const [, cat] of ({ 1: [['', 'SEO']], 2: [['', 'Intent signals']], 3: [['', 'Chat and conversion']], 4: [['', 'CRM']], 5: [['', 'Revenue forecasting']] })[goal]) {
      let st = finder.start();
      st = finder.answer(st, 'goal', goal);
      st = finder.answer(st, 'need', cat);
      assert.ok(ADAPT.includes(finder.nextQuestion(st)), `goal ${goal}: an adaptive question must follow the need question`);
    }
  }
});

test('never asks more than the maximum number of questions', () => {
  let st = finder.start();
  st = finder.answer(st, 'goal', 3);
  st = finder.answer(st, 'need', 'Email outreach');
  let guard = 0;
  for (let id = finder.nextQuestion(st); id; id = finder.nextQuestion(st)) {
    st = finder.answer(st, id, finder.optsFor(id, st.A)[0][1]);
    assert.ok(++guard < 20);
  }
  assert.ok(st.order.length <= MAX_QUESTIONS);
});

test('unpublished tools are never recommended', () => {
  const withDraft = createFinder([...tools, { id: 'draft', name: 'AAA Draft Tool', stage: 3, cat: 'Email outreach', price: 'Free plan', ints: [], setup: 1, feat: true, published: false }]);
  let st = withDraft.start();
  st = withDraft.answer(st, 'goal', 3);
  st = withDraft.answer(st, 'need', 'Email outreach');
  const all = withDraft.rank(st.A).map((o) => o.tool.name);
  assert.ok(!all.includes('AAA Draft Tool'));
});

test('ranking is deterministic and does not mutate the answers', () => {
  const A = { goal: 1, need: 'SEO', budget: 'low', size: 'small' };
  const copy = JSON.stringify(A);
  const a = names(finder.rank(A));
  const b = names(finder.rank(A));
  assert.deepEqual(a, b);
  assert.equal(JSON.stringify(A), copy);
});
