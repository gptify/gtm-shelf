/**
 * Automated Test Suite for GTMShelf Lead Capture, Double Opt-In,
 * Custom Requests, and Tool Submissions.
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testForms() {
  console.log(`🧪 Starting Form Endpoints & Delivery Validation against ${BASE_URL}...\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. LEAD CAPTURE & DOUBLE OPT-IN
  console.log('--- 1. Testing Newsletter & Lead Capture (/api/lead) ---');

  // 1.1 Invalid email rejection
  const invalidLeadRes = await fetch(`${BASE_URL}/api/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email' }),
  });
  assert(invalidLeadRes.status === 400, 'Rejects malformed email with 400 Bad Request');
  const invalidLeadData = await invalidLeadRes.json();
  assert(invalidLeadData.error.includes('valid email'), 'Returns descriptive error message for invalid email');

  // 1.2 Honeypot trap check
  const honeypotLeadRes = await fetch(`${BASE_URL}/api/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'bot@example.com', hp_field: 'spam-bot-fill' }),
  });
  assert(honeypotLeadRes.status === 200, 'Silently accepts honeypot trap with 200 OK');

  // 1.3 Valid lead submission & token generation
  const testEmail = `qa-test-${Date.now()}@example.com`;
  const validLeadRes = await fetch(`${BASE_URL}/api/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      source: 'finder',
      finder_answers: { goal: 'outbound', crm: 'HubSpot' },
      pick_tool_ids: ['apollo', 'instantly'],
    }),
  });
  assert(validLeadRes.status === 200, 'Valid lead capture returns 200 OK');
  const validLeadData = await validLeadRes.json();
  assert(validLeadData.success === true, 'Success flag returned');
  assert(typeof validLeadData.confirm_url === 'string' && validLeadData.confirm_url.includes('/confirm?token='), 'Generates double opt-in confirmation URL with token');

  // 1.4 Test Double Opt-In Confirmation Endpoint
  console.log('\n--- 1.4 Testing Double Opt-In Confirmation Page ---');
  const confirmPageRes = await fetch(`${BASE_URL}${validLeadData.confirm_url}`);
  assert(confirmPageRes.status === 200, 'Confirmation URL responds with 200 OK');
  const confirmPageHtml = await confirmPageRes.text();
  assert(confirmPageHtml.includes('Confirmed') || confirmPageHtml.includes('verified'), 'Confirmation page validates token');

  // 2. CUSTOM BUILD / PARTNER INQUIRY (/api/custom)
  console.log('\n--- 2. Testing Custom Request & Partner Inquiry (/api/custom) ---');

  // 2.1 Rejection of missing required fields
  const invalidCustomRes = await fetch(`${BASE_URL}/api/custom`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '', email: 'invalid' }),
  });
  assert(invalidCustomRes.status === 400, 'Rejects missing name with 400 Bad Request');

  // 2.2 Rejection of too short description
  const shortCustomRes = await fetch(`${BASE_URL}/api/custom`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'QA Auditor',
      email: 'qa@example.com',
      what: 'Too short',
    }),
  });
  assert(shortCustomRes.status === 400, 'Rejects descriptions under 15 characters with 400');

  // 2.3 Valid custom request submission
  const validCustomRes = await fetch(`${BASE_URL}/api/custom`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'QA Operator',
      email: 'qa-operator@example.com',
      what: 'We need an automated multi-source enrichment pipeline syncing Clay to HubSpot custom fields.',
      team_size: 'early',
      budget: 'growth',
      source: 'guide',
    }),
  });
  assert(validCustomRes.status === 200, 'Valid custom request submission returns 200 OK');
  const validCustomData = await validCustomRes.json();
  assert(validCustomData.success === true, 'Custom request returns success flag');

  // 3. TOOL SUBMISSIONS (/api/submit)
  console.log('\n--- 3. Testing Tool Submission (/api/submit) ---');

  // 3.1 Rejection of missing name or URL
  const invalidSubmitRes = await fetch(`${BASE_URL}/api/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '' }),
  });
  assert(invalidSubmitRes.status === 400, 'Rejects incomplete tool submission with 400 Bad Request');

  // 3.2 Valid tool submission
  const validSubmitRes = await fetch(`${BASE_URL}/api/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'TestAI Platform',
      website_url: 'https://testai-platform.example.com',
      tagline: 'Autonomous deal room co-pilot for high velocity revenue teams',
      description: 'Streamlines prospect evaluation and generates automated deal battlecards.',
      contact_email: 'founder@testai-platform.example.com',
      pricing_model: 'free_plan',
      is_vendor: true,
      category_name: 'Call intelligence',
    }),
  });
  assert(validSubmitRes.status === 200, 'Valid tool submission returns 200 OK');
  const validSubmitData = await validSubmitRes.json();
  assert(validSubmitData.success === true, 'Tool submission confirmed with success message');

  console.log(`\n========================================`);
  console.log(`Total Form Tests: ${passed + failed}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

testForms().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
