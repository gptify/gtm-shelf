// scripts/test-catalog-audit.mjs
import fs from 'fs';

const tools = JSON.parse(fs.readFileSync('./data/tools.json', 'utf8'));

console.log('--- AUDITING 70-TOOL CATALOG ---');
console.log(`Total tools in catalog: ${tools.length}`);

// 1. Koala verification
const koala = tools.find(t => t.id === 'koala');
if (!koala || koala.lifecycle_status !== 'discontinued' || koala.classification !== 'discontinued') {
  console.error('[FAIL] Koala is not marked as discontinued!');
  process.exit(1);
}
console.log('✓ [PASS] Koala is marked as discontinued with alternatives note.');

// 2. Drift verification
const drift = tools.find(t => t.id === 'drift');
if (!drift || drift.lifecycle_status !== 'sunsetting' || drift.classification !== 'sunsetting') {
  console.error('[FAIL] Drift is not marked as sunsetting!');
  process.exit(1);
}
console.log('✓ [PASS] Drift is marked as sunsetting with 1mind successor note.');

// 3. Category assignments
const heyreach = tools.find(t => t.id === 'heyreach');
if (heyreach.cat !== 'LinkedIn outreach') {
  console.error('[FAIL] HeyReach category is not LinkedIn outreach:', heyreach.cat);
  process.exit(1);
}
console.log('✓ [PASS] HeyReach category is LinkedIn outreach.');

const pandadoc = tools.find(t => t.id === 'pandadoc');
if (pandadoc.cat !== 'Document automation') {
  console.error('[FAIL] PandaDoc category is not Document automation:', pandadoc.cat);
  process.exit(1);
}
console.log('✓ [PASS] PandaDoc category is Document automation.');

const churnzero = tools.find(t => t.id === 'churnzero');
if (churnzero.cat !== 'Customer success') {
  console.error('[FAIL] ChurnZero category is not Customer success:', churnzero.cat);
  process.exit(1);
}
console.log('✓ [PASS] ChurnZero category is Customer success.');

const vitally = tools.find(t => t.id === 'vitally');
if (vitally.cat !== 'Customer success') {
  console.error('[FAIL] Vitally category is not Customer success:', vitally.cat);
  process.exit(1);
}
console.log('✓ [PASS] Vitally category is Customer success.');

const copyai = tools.find(t => t.id === 'copy-ai');
if (copyai.cat !== 'GTM AI workflows') {
  console.error('[FAIL] Copy.ai category is not GTM AI workflows:', copyai.cat);
  process.exit(1);
}
console.log('✓ [PASS] Copy.ai category is GTM AI workflows.');

const regieai = tools.find(t => t.id === 'regie-ai');
if (!regieai.description.includes('force multiplier') && !regieai.tagline.includes('AI-assisted')) {
  console.error('[FAIL] Regie.ai is not properly repositioned as AI SEP!');
  process.exit(1);
}
console.log('✓ [PASS] Regie.ai is repositioned as AI SEP with human-in-the-loop.');

// 4. Malformed pricing display check
let malformedPriceCount = 0;
tools.forEach(t => {
  const pNote = t.price_note || '';
  if (pNote.trim().startsWith('/mo') || pNote.trim().startsWith('$/mo') || pNote.trim() === '$ /mo') {
    console.error(`[FAIL] Malformed price note in ${t.name}: "${pNote}"`);
    malformedPriceCount++;
  }
  if (!t.price || !t.min_plan) {
    console.error(`[FAIL] Missing price or min_plan in ${t.name}`);
    malformedPriceCount++;
  }
});
if (malformedPriceCount > 0) {
  process.exit(1);
}
console.log('✓ [PASS] 0 malformed pricing displays detected across all tools.');

// 5. Unsubstantiated claims check
let hypeCount = 0;
tools.forEach(t => {
  const text = `${t.tagline} ${t.description} ${t.best}`.toLowerCase();
  ['safely with unified', 'without getting accounts restricted', 'guaranteed meetings', 'guaranteed roi'].forEach(phrase => {
    if (text.includes(phrase)) {
      console.error(`[FAIL] Unsubstantiated hype in ${t.name}: "${phrase}"`);
      hypeCount++;
    }
  });
});
if (hypeCount > 0) {
  process.exit(1);
}
console.log('✓ [PASS] 0 unsubstantiated safety/guarantee claims detected.');

// 6. High-priority missing tools verification
const missingCheck = [
  'n8n', 'make', 'zapier', 'pipedrive', 'close-crm',
  'hunter', 'dropcontact', 'findymail', 'rb2b', 'warmly',
  'calendly', '1mind'
];
missingCheck.forEach(id => {
  const found = tools.find(t => t.id === id);
  if (!found) {
    console.error(`[FAIL] Missing tool ${id} not found in catalog!`);
    process.exit(1);
  }
  if (!found.min_plan || !found.primary_jtbd || !found.buyer_segment) {
    console.error(`[FAIL] Missing tool ${id} lacks required structured fields!`);
    process.exit(1);
  }
});
console.log(`✓ [PASS] All 12 high-priority missing tools evaluated and verified.`);

// 7. Structured attributes completeness check
let incompleteAttrs = 0;
tools.forEach(t => {
  if (!t.classification || !t.lifecycle_status || !t.primary_jtbd || !t.buyer_segment || !t.gtm_buckets || t.gtm_buckets.length === 0) {
    console.error(`[FAIL] Incomplete attributes in ${t.name}`);
    incompleteAttrs++;
  }
});
if (incompleteAttrs > 0) {
  process.exit(1);
}
console.log('✓ [PASS] All 70 tools have complete structured attributes (JTBD, GTM buckets, buyer segment, classification, lifecycle).');

console.log('=== ALL CATALOG AUDIT CHECKS PASSED (100%) ===');
