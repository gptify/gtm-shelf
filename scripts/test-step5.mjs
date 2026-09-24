import assert from 'node:assert/strict';
import guidesData from '../starter/content/guides.json' with { type: 'json' };

const BASE_URL = 'http://localhost:3001';

async function testStep5() {
  console.log('--- Step 5 Verification Test Suite ---');

  // 1. Guides Index
  console.log('1. Testing /guides index page...');
  const guidesRes = await fetch(`${BASE_URL}/guides`);
  assert.equal(guidesRes.status, 200, 'Guides index must return 200 OK');
  const guidesHtml = await guidesRes.text();
  assert.ok(guidesHtml.includes('Guides &amp; Comparisons') || guidesHtml.includes('Guides & Comparisons'), 'Guides title present');
  assert.ok(guidesHtml.includes('Category Buyer Guides'), 'Buyer guides section present');
  assert.ok(guidesHtml.includes('Head-to-Head Comparisons'), 'Head-to-head section present');
  console.log('✓ /guides index passed');

  // 2. All 12 Guides
  console.log('2. Testing all 12 individual guide pages...');
  for (const guide of guidesData) {
    const res = await fetch(`${BASE_URL}/guides/${guide.slug}`);
    assert.equal(res.status, 200, `Guide /guides/${guide.slug} must return 200 OK`);
    const html = await res.text();
    assert.ok(html.includes(guide.title), `Guide page must render title: ${guide.title}`);

    if (guide.type === 'best') {
      assert.ok(html.includes('How we evaluated these tools'), 'Best guide must have evaluation criteria');
      assert.ok(html.includes('The Shortlist'), 'Best guide must have shortlist');
    } else if (guide.type === 'vs') {
      assert.ok(html.includes('Side-by-Side Comparison'), 'VS guide must have side-by-side comparison');
      assert.ok(html.includes(`When to choose ${guide.a}`), `VS guide must have When to choose ${guide.a}`);
      assert.ok(html.includes(`When to choose ${guide.b}`), `VS guide must have When to choose ${guide.b}`);
    }
  }
  console.log(`✓ All ${guidesData.length} guide pages passed`);

  // 3. Custom Build Page & Prefill
  console.log('3. Testing /custom page and prefill...');
  const customRes = await fetch(`${BASE_URL}/custom?goal=3&need=Send+outreach+emails+at+scale&crm=HubSpot&team=small`);
  assert.equal(customRes.status, 200, '/custom must return 200 OK');
  const customHtml = await customRes.text();
  assert.ok(customHtml.includes('Request a Custom AI Build'), '/custom page has proper heading');
  assert.ok(customHtml.includes('custom_requests') || customHtml.includes('Bespoke GTM Automations'), '/custom context present');
  console.log('✓ /custom page loaded');

  // 4. Custom Build API (/api/custom)
  console.log('4. Testing /api/custom endpoint...');
  // A. Too short description (validation error)
  const shortRes = await fetch(`${BASE_URL}/api/custom`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Tester',
      email: 'test@example.com',
      what: 'short',
    }),
  });
  assert.equal(shortRes.status, 400, 'Short description must trigger 400 Bad Request');

  // B. Honeypot check
  const hpRes = await fetch(`${BASE_URL}/api/custom`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Bot',
      email: 'bot@spambot.com',
      what: 'This is a long enough description for honeypot test',
      hp_field: 'I am a bot',
    }),
  });
  assert.equal(hpRes.status, 200, 'Honeypot request should return 200 OK without saving');

  // C. Valid submission
  const validCustomRes = await fetch(`${BASE_URL}/api/custom`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Sarah Connor',
      email: 'sarah@skynet-escape.com',
      what: 'We need an automated AI enrichment workflow that extracts verified emails and company size from LinkedIn and pushes them directly into our HubSpot CRM pipeline.',
      tools_used: 'HubSpot, Slack',
      team_size: 'Growing team (11–50)',
      budget: '$5,000 – $15,000',
      timing: 'Immediately',
      language: 'English',
    }),
  });
  assert.equal(validCustomRes.status, 200, 'Valid custom request should succeed');
  const customJson = await validCustomRes.json();
  assert.ok(customJson.success, 'Valid custom request must return success');
  console.log('✓ /api/custom tests passed');

  // 5. Submit Tool Page & API (/submit, /api/submit)
  console.log('5. Testing /submit page and duplicate checks...');
  const submitPageRes = await fetch(`${BASE_URL}/submit`);
  assert.equal(submitPageRes.status, 200, '/submit must return 200 OK');

  // A. Duplicate submission check
  const dupRes = await fetch(`${BASE_URL}/api/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Jasper',
      website_url: 'https://jasper.ai',
      tagline: 'AI writing assistant',
      contact_email: 'rep@jasper.ai',
    }),
  });
  assert.equal(dupRes.status, 409, 'Duplicate tool name/domain must return 409 Conflict');

  // B. New tool submission
  const newToolRes = await fetch(`${BASE_URL}/api/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'UniqueAiTool' + Date.now(),
      website_url: `https://unique-ai-tool-${Date.now()}.com`,
      tagline: 'Automate high-intent outbound sequences with multi-modal AI agents',
      contact_email: 'founder@unique-ai-tool.com',
      stage_id: 3,
      category_name: 'Email outreach',
      pricing_model: 'Free plan',
      is_vendor: true,
    }),
  });
  assert.equal(newToolRes.status, 200, 'New valid submission should return 200 OK');
  console.log('✓ /submit and /api/submit tests passed');

  // 6. Double Opt-in Lead Flow (/api/lead and /confirm)
  console.log('6. Testing double opt-in lead capture and confirmation...');
  const leadRes = await fetch(`${BASE_URL}/api/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'lead-test-' + Date.now() + '@gptify.co',
      source: 'finder',
      finder_answers: { goal: 3, need: 'Send outreach emails at scale' },
      pick_tool_ids: ['lemlist', 'instantly', 'smartlead'],
    }),
  });
  assert.equal(leadRes.status, 200, '/api/lead must return 200 OK');
  const leadJson = await leadRes.json();
  assert.ok(leadJson.confirm_url, 'Response must include confirm_url for double opt-in');
  console.log('Received confirm URL:', leadJson.confirm_url);

  // Confirm lead
  const confirmRes = await fetch(`${BASE_URL}${leadJson.confirm_url}`);
  assert.equal(confirmRes.status, 200, '/confirm?token=... must return 200 OK');
  const confirmHtml = await confirmRes.text();
  assert.ok(confirmHtml.includes('Your Email is Confirmed!'), 'Confirmation page must show success');

  // Test invalid token
  const invalidConfirmRes = await fetch(`${BASE_URL}/confirm?token=invalid_dummy_token`);
  assert.equal(invalidConfirmRes.status, 200, 'Invalid token must render 200 OK page');
  const invalidHtml = await invalidConfirmRes.text();
  assert.ok(invalidHtml.includes('Invalid or Expired Link'), 'Invalid token must show error state');
  console.log('✓ Double opt-in lead verification passed');

  console.log('\n===========================================');
  console.log('ALL STEP 5 SPECIFICATIONS & TESTS PASSED! 🎉');
  console.log('===========================================');
}

testStep5().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
