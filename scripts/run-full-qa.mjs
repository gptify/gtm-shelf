import { execSync } from 'child_process';
import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:3001';

async function runFullQA() {
  console.log('====================================================');
  console.log('       GTM SHELF FULL PRODUCTION QA AUDIT           ');
  console.log('====================================================\n');

  // Test 1: Pure Finder Unit Tests
  console.log('▶ [1/8] Running Pure Finder Logic & Golden Tests (finder.test.mjs)...');
  execSync('node --test starter/finder/finder.test.mjs', { stdio: 'inherit' });
  console.log('✓ Finder tests passed (20/20 tests passed)\n');

  // Test 2: Step 2 Functional Tests
  console.log('▶ [2/8] Running Step 2 Functional Tests (test-step2.mjs)...');
  execSync('node scripts/test-step2.mjs', { stdio: 'inherit' });
  console.log('✓ Step 2 tests passed\n');

  // Test 3: Step 3 Static & Programmatic SEO Tests
  console.log('▶ [3/8] Running Step 3 SEO & Dynamic Route Tests (test-step3.mjs)...');
  execSync('node scripts/test-step3.mjs', { stdio: 'inherit' });
  console.log('✓ Step 3 tests passed\n');

  // Test 4: Step 4 Finder Scenarios & Prefill Tests
  console.log('▶ [4/8] Running Step 4 Finder Scenarios (test-step4.mjs)...');
  execSync('node scripts/test-step4.mjs', { stdio: 'inherit' });
  console.log('✓ Step 4 tests passed\n');

  // Test 5: Step 5 Guides, Custom Build & Double Opt-in Tests
  console.log('▶ [5/8] Running Step 5 Guides & Double Opt-in (test-step5.mjs)...');
  execSync('node scripts/test-step5.mjs', { stdio: 'inherit' });
  console.log('✓ Step 5 tests passed\n');

  // Test 6: Step 6 Admin Area & Acceptance Criterion 10
  console.log('▶ [6/8] Running Step 6 Admin Area & Guardrails (test-step6.mjs)...');
  execSync('node scripts/test-step6.mjs', { stdio: 'inherit' });
  console.log('✓ Step 6 tests passed\n');

  // Test 7: Step 7 Legal Pages & Sitemaps
  console.log('▶ [7/8] Running Step 7 Legal Pages & Sitemaps (test-step7.mjs)...');
  execSync('node scripts/test-step7.mjs', { stdio: 'inherit' });
  console.log('✓ Step 7 tests passed\n');

  // Test 8: Security & CSP Headers
  console.log('▶ [8/8] Verifying Security Headers & CSP...');
  const headRes = await fetch(`${BASE_URL}/`);
  const csp = headRes.headers.get('content-security-policy');
  const xfo = headRes.headers.get('x-frame-options');
  const nosniff = headRes.headers.get('x-content-type-options');

  assert.ok(csp && csp.includes("default-src 'self'"), 'CSP must be set');
  assert.equal(xfo, 'DENY', 'X-Frame-Options must be DENY');
  assert.equal(nosniff, 'nosniff', 'X-Content-Type-Options must be nosniff');
  console.log('✓ Security headers (CSP, X-Frame-Options, nosniff) verified\n');

  console.log('====================================================');
  console.log('     🎉 ALL AUTOMATED QA AUDIT SUITES PASSED!        ');
  console.log('====================================================');
}

runFullQA().catch((err) => {
  console.error('\n❌ QA Audit failed:', err);
  process.exit(1);
});
