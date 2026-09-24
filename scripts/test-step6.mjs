import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:3001';

async function testStep6() {
  console.log('--- Step 6: Admin Area Verification Test Suite ---');

  // 1. Auth Protection
  console.log('1. Testing authentication guardrails...');
  const unauthRes = await fetch(`${BASE_URL}/api/admin/tools`);
  assert.equal(unauthRes.status, 401, 'Unauthenticated request to admin tools must return 401');

  // Invalid login
  const invalidLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode: 'wrong-passcode' }),
  });
  assert.equal(invalidLoginRes.status, 401, 'Invalid passcode must return 401');

  // Valid login
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode: 'gtmshelf-admin' }),
  });
  assert.equal(loginRes.status, 200, 'Valid admin login must return 200');
  const cookie = loginRes.headers.get('set-cookie');
  assert.ok(cookie && cookie.includes('gtm_admin_session'), 'Must return gtm_admin_session cookie');
  const authHeaders = {
    Cookie: cookie.split(';')[0],
    'Content-Type': 'application/json',
  };
  console.log('✓ Authentication and session cookie verified');

  // 2. Tools Management
  console.log('2. Testing tools directory API and search...');
  const toolsRes = await fetch(`${BASE_URL}/api/admin/tools?status=draft`, { headers: authHeaders });
  assert.equal(toolsRes.status, 200, 'Admin tools GET must return 200');
  const toolsData = await toolsRes.json();
  assert.ok(Array.isArray(toolsData.tools), 'Must return tools array');
  assert.ok(toolsData.tools.length >= 42, 'Must include 42 sample draft tools');

  // Search filter
  const searchRes = await fetch(`${BASE_URL}/api/admin/tools?q=jasper`, { headers: authHeaders });
  const searchData = await searchRes.json();
  assert.equal(searchData.tools[0]?.name, 'Jasper', 'Search must find Jasper');
  console.log('✓ Admin tools retrieval and search passed');

  // 3. Acceptance Criterion 10: Publish Guardrails
  console.log('3. Testing Acceptance Criterion 10 (Publish blocked without verified_at & sources)...');
  const targetTool = toolsData.tools[0];

  // A. Try to publish without verification & without sources
  const blockPublishRes = await fetch(`${BASE_URL}/api/admin/tools`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      id: targetTool.id,
      status: 'published',
      verified_at: null,
      sources: [],
    }),
  });
  assert.equal(blockPublishRes.status, 400, 'Publishing without verification and sources must be blocked (400)');
  const blockJson = await blockPublishRes.json();
  assert.ok(
    blockJson.error.includes('Cannot publish tool') && blockJson.error.includes('source URL'),
    'Must show clear message explaining verified_at and source URL requirement'
  );
  console.log('  → Blocked unverified publish correctly with message:', blockJson.error);

  // B. Try to publish with verified_at but NO sources
  const blockNoSourcesRes = await fetch(`${BASE_URL}/api/admin/tools`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      id: targetTool.id,
      status: 'published',
      verified_at: new Date().toISOString(),
      sources: [],
    }),
  });
  assert.equal(blockNoSourcesRes.status, 400, 'Publishing with no sources must be blocked');

  // C. Mark Verified endpoint
  const verifyRes = await fetch(`${BASE_URL}/api/admin/tools/verify`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ id: targetTool.id }),
  });
  assert.equal(verifyRes.status, 200, 'Mark verified must return 200');
  const verifyData = await verifyRes.json();
  assert.ok(verifyData.tool.verified_at, 'Tool must now have verified_at timestamp');

  // D. Attach source URL and publish -> must now succeed!
  const allowPublishRes = await fetch(`${BASE_URL}/api/admin/tools`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      id: targetTool.id,
      status: 'published',
      verified_at: verifyData.tool.verified_at,
      sources: [{ url: 'https://jasper.ai/pricing', label: 'Official Pricing Page' }],
    }),
  });
  assert.equal(allowPublishRes.status, 200, 'Publishing with verified_at and source URL must succeed');
  const allowJson = await allowPublishRes.json();
  assert.equal(allowJson.tool.status, 'published', 'Tool status must now be published');
  console.log('✓ Acceptance Criterion 10 strictly verified and passed');

  // 4. Submissions Review Queue
  console.log('4. Testing submissions review queue (Accept, Reject, Spam)...');
  const subsRes = await fetch(`${BASE_URL}/api/admin/submissions`, { headers: authHeaders });
  assert.equal(subsRes.status, 200, 'Admin submissions GET must return 200');
  const subsData = await subsRes.json();
  assert.ok(subsData.submissions.length > 0, 'Submissions queue must have entries');
  const testSub = subsData.submissions[0];

  // Accept submission
  const acceptRes = await fetch(`${BASE_URL}/api/admin/submissions`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ id: testSub.id, action: 'accept' }),
  });
  assert.equal(acceptRes.status, 200, 'Accepting submission must return 200');
  const acceptData = await acceptRes.json();
  assert.equal(acceptData.submission.status, 'accepted', 'Submission status must be accepted');
  assert.ok(acceptData.tool?.id, 'Accepting submission must generate new draft tool');
  assert.equal(acceptData.tool.status, 'draft', 'Generated tool must be in draft status');
  console.log('✓ Submissions accept action creates draft tool');

  // 5. Custom Requests Queue & Notes
  console.log('5. Testing custom requests queue and internal notes...');
  const reqsRes = await fetch(`${BASE_URL}/api/admin/custom-requests`, { headers: authHeaders });
  assert.equal(reqsRes.status, 200, 'Admin custom requests GET must return 200');
  const reqsData = await reqsRes.json();
  assert.ok(reqsData.requests.length > 0, 'Custom requests must have entries');
  const testReq = reqsData.requests[0];

  // Update status & internal note
  const updateReqRes = await fetch(`${BASE_URL}/api/admin/custom-requests`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      id: testReq.id,
      status: 'contacted',
      internal_note: 'Called client and sent preliminary scope estimate.',
    }),
  });
  assert.equal(updateReqRes.status, 200, 'Updating custom request must return 200');
  const updatedReqData = await updateReqRes.json();
  assert.equal(updatedReqData.request.status, 'contacted', 'Status must be updated');
  assert.equal(updatedReqData.request.internal_note, 'Called client and sent preliminary scope estimate.', 'Note must be saved');
  console.log('✓ Custom requests status and internal note updates passed');

  // 6. Leads List
  console.log('6. Testing leads list endpoint...');
  const leadsRes = await fetch(`${BASE_URL}/api/admin/leads`, { headers: authHeaders });
  assert.equal(leadsRes.status, 200, 'Admin leads GET must return 200');
  const leadsData = await leadsRes.json();
  assert.ok(Array.isArray(leadsData.leads), 'Must return leads array');
  console.log('✓ Leads list retrieval passed');

  // 7. Guides Management
  console.log('7. Testing guides administration and toggle...');
  const guidesRes = await fetch(`${BASE_URL}/api/admin/guides`, { headers: authHeaders });
  assert.equal(guidesRes.status, 200, 'Admin guides GET must return 200');
  const guidesData = await guidesRes.json();
  assert.equal(guidesData.guides.length, 12, 'Must return all 12 guides');

  // Toggle guide
  const testGuide = guidesData.guides[0];
  const toggleGuideRes = await fetch(`${BASE_URL}/api/admin/guides`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      slug: testGuide.slug,
      published: false,
    }),
  });
  assert.equal(toggleGuideRes.status, 200, 'Guide update must return 200');
  const toggledGuideData = await toggleGuideRes.json();
  assert.equal(toggledGuideData.guide.published, false, 'Guide published flag updated');
  console.log('✓ Guides administration passed');

  // 8. Frontend Pages 200 Check
  console.log('8. Testing admin frontend pages rendering...');
  const pages = [
    '/admin/login',
    '/admin/tools',
    '/admin/submissions',
    '/admin/custom-requests',
    '/admin/leads',
    '/admin/guides',
  ];
  for (const page of pages) {
    const res = await fetch(`${BASE_URL}${page}`);
    assert.equal(res.status, 200, `Admin page ${page} must return 200 OK`);
  }
  console.log('✓ All admin frontend pages rendered successfully');

  console.log('\n===========================================');
  console.log('ALL STEP 6 ADMIN SPECIFICATIONS PASSED! 🎉');
  console.log('===========================================');
}

testStep6().catch((err) => {
  console.error('Step 6 test failed:', err);
  process.exit(1);
});
