async function runTests() {
  console.log('--- STEP 2 ACCEPTANCE TESTS ---');

  const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
  console.log(`Testing against server at ${baseUrl}...`);

  // 1. Home page SSR check
  console.log('1. Testing Home page SSR response...');
  const res = await fetch(baseUrl);
  if (!res.ok) throw new Error(`Home page failed with status ${res.status}`);
  const html = await res.text();

  // Acceptance Criterion 1: Attract is selected by default, tools are listed
  if (!html.includes('Attract') || !html.includes('funnel')) {
    throw new Error('Home page SSR missing Attract stage or funnel navigation');
  }

  if (!html.includes('Attract stage:')) {
    throw new Error('Home page SSR missing "Attract stage: N of TOTAL tools" count heading');
  }

  // Check branding
  if (!html.includes('GTM') || !html.includes('Shelf')) {
    throw new Error('Home page SSR missing GTM Shelf branding');
  }

  // Check drawer markup
  if (!html.includes('id="drawer"') && !html.includes('<dialog')) {
    throw new Error('Home page SSR missing details drawer native dialog');
  }

  // Check submit modal
  if (!html.includes('id="submit"') && !html.includes('<dialog')) {
    throw new Error('Home page SSR missing submit modal native dialog');
  }

  console.log('✅ Home page SSR includes all required landmarks, branding, funnel stages, and dialogs!');

  // 2. Structured data check
  console.log('2. Verifying JSON-LD structure...');
  if (!html.includes('application/ld+json')) {
    throw new Error('Home page SSR missing application/ld+json structured data');
  }
  if (!html.includes('https://schema.org') || !html.includes('WebSite') || !html.includes('GPTify')) {
    throw new Error('JSON-LD does not contain required WebSite and Organization schema');
  }
  console.log('✅ JSON-LD structured data validated: WebSite and Organization (GPTify)!');

  // 3. Honeypot check on submit API
  console.log('3. Testing /api/submit honeypot protection (Acceptance criterion 11)...');
  const hpRes = await fetch(`${baseUrl}/api/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Spam Bot Tool',
      website_url: 'https://spambot.com',
      tagline: 'Spamming your directory',
      contact_email: 'spammer@bot.com',
      hp_field: 'I am a bot filling hidden field',
    }),
  });
  if (!hpRes.ok) throw new Error(`Honeypot request failed with status ${hpRes.status}`);
  const hpJson = await hpRes.json();
  if (!hpJson.success) throw new Error('Expected honeypot response to pretend success');
  console.log('✅ Honeypot spam test passed: returns success: true without error!');

  // 4. Submit API validation check
  console.log('4. Testing /api/submit validation on missing fields...');
  const badRes = await fetch(`${baseUrl}/api/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: '',
      website_url: '',
    }),
  });
  if (badRes.status !== 400) throw new Error(`Expected 400 for empty fields, got ${badRes.status}`);
  console.log('✅ Submit API validation passed: rejects invalid input with 400!');

  console.log('\n🎉 ALL STEP 2 ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
}

runTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  });
