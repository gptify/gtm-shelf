import http from 'node:http';
import { spawn } from 'node:child_process';

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // wait 300ms
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw new Error(`Server did not respond at ${url} within ${timeout}ms`);
}

async function runTests() {
  console.log('--- STEP 2 ACCEPTANCE TESTS ---');

  const PORT = 3005;
  console.log(`Starting Next.js server on port ${PORT}...`);
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => {
    // console.log(`[Next.js] ${d}`);
  });
  server.stderr.on('data', (d) => {
    // console.error(`[Next.js err] ${d}`);
  });

  try {
    const baseUrl = `http://localhost:${PORT}`;
    await waitForServer(baseUrl);
    console.log('✅ Server is ready and answering requests!');

    // 1. Test Home page SSR
    console.log('1. Testing Home page SSR response...');
    const homeRes = await fetch(baseUrl);
    if (!homeRes.ok) throw new Error(`Home page returned status ${homeRes.status}`);
    const html = await homeRes.text();

    // Check critical landmarks and HTML
    if (!html.includes('GTM Shelf')) throw new Error('Missing GTM Shelf title/brand in SSR HTML');
    if (!html.includes('where your funnel leaks')) throw new Error('Missing hero headline in SSR HTML');
    if (!html.includes('GPTify')) throw new Error('Missing GPTify attribution in SSR HTML');
    if (!html.includes('application/ld+json')) throw new Error('Missing JSON-LD structured data in SSR HTML');
    if (!html.includes('Attract')) throw new Error('Missing Attract stage in SSR HTML');
    if (!html.includes('Prospect')) throw new Error('Missing Prospect stage in SSR HTML');
    if (!html.includes('Engage')) throw new Error('Missing Engage stage in SSR HTML');
    if (!html.includes('Close')) throw new Error('Missing Close stage in SSR HTML');
    if (!html.includes('Grow')) throw new Error('Missing Grow stage in SSR HTML');
    if (!html.includes('id="drawer"')) throw new Error('Missing details drawer dialog in SSR HTML');
    if (!html.includes('id="submit"')) throw new Error('Missing submit tool dialog in SSR HTML');
    console.log('✅ Home page SSR includes all required landmarks, branding, funnel stages, and dialogs!');

    // 2. Test JSON-LD content
    console.log('2. Verifying JSON-LD structure...');
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!jsonLdMatch) throw new Error('Could not extract JSON-LD script tag');
    const jsonLdData = JSON.parse(jsonLdMatch[1]);
    const org = jsonLdData['@graph'].find((item) => item['@type'] === 'Organization');
    if (!org || org.parentOrganization?.name !== 'GPTify') {
      throw new Error('JSON-LD missing Organization or parentOrganization GPTify');
    }
    console.log('✅ JSON-LD structured data validated: WebSite and Organization (GPTify)!');

    // 3. Test Honeypot and Submit API
    console.log('3. Testing /api/submit honeypot protection (Acceptance criterion 11)...');
    const hpRes = await fetch(`${baseUrl}/api/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'SpamTool',
        website_url: 'https://spam.example.com',
        stage_id: 1,
        category_name: 'Content writing',
        pricing_model: 'free_plan',
        tagline: 'Spam tool summary',
        contact_email: 'spam@example.com',
        hp_field: 'I am a bot', // honeypot filled
      }),
    });
    if (!hpRes.ok) throw new Error(`Honeypot request failed with status ${hpRes.status}`);
    const hpJson = await hpRes.json();
    if (!hpJson.success) throw new Error('Honeypot did not return success: true');
    console.log('✅ Honeypot spam test passed: returns success: true without error!');

    // 4. Test Submit API validation
    console.log('4. Testing /api/submit validation on missing fields...');
    const badRes = await fetch(`${baseUrl}/api/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '', // missing
        website_url: '',
      }),
    });
    if (badRes.status !== 400) throw new Error(`Expected 400 for empty fields, got ${badRes.status}`);
    console.log('✅ Submit API validation passed: rejects invalid input with 400!');

    console.log('\n🎉 ALL STEP 2 ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
  } finally {
    server.kill();
  }
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
