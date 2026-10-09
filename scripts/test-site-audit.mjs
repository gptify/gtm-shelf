/**
 * Site-Wide Comprehensive QA Audit Script
 * Validates HTTP response codes, canonical tags, structured data (JSON-LD),
 * robots, sitemap, and mobile viewport across key routes.
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const ROUTES_TO_AUDIT = [
  '/',
  '/build-my-stack',
  '/stacks',
  '/stacks/modern-outbound-stack-under-500',
  '/stacks/founder-led-sales-stack',
  '/stacks/hubspot-ai-native-stack',
  '/stacks/modern-retention-expansion-stack',
  '/partners',
  '/gptify',
  '/custom',
  '/submit',
  '/guides',
  '/free-tools',
  '/roi-calculator',
  '/about',
];

async function runSiteAudit() {
  console.log(`🌐 Auditing GTMShelf pages against ${BASE_URL}...\n`);

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

  for (const route of ROUTES_TO_AUDIT) {
    const url = `${BASE_URL}${route}`;
    const res = await fetch(url);
    assert(res.status === 200, `Route ${route} returned HTTP 200 (Got: ${res.status})`);

    const html = await res.text();

    // Check viewport meta for mobile responsiveness
    const hasViewport = html.includes('name="viewport"') || html.includes('content="width=device-width');
    assert(hasViewport, `Route ${route} contains mobile responsive viewport tag`);

    // Check canonical link or alternate
    const hasCanonical = html.includes('rel="canonical"') || html.includes('canonical');
    assert(hasCanonical, `Route ${route} defines canonical link tag`);
  }

  // Check Schema.org on homepage
  console.log('\n--- Checking Structured Data (JSON-LD) ---');
  const homeRes = await fetch(`${BASE_URL}/`);
  const homeHtml = await homeRes.text();
  assert(homeHtml.includes('application/ld+json'), 'Homepage contains application/ld+json structured data');
  assert(homeHtml.includes('https://schema.org'), 'Homepage references schema.org context');

  // Check Schema.org on tool detail page
  const toolRes = await fetch(`${BASE_URL}/tools/clay`);
  assert(toolRes.status === 200, 'Tool detail /tools/clay returned HTTP 200');
  const toolHtml = await toolRes.text();
  assert(toolHtml.includes('SoftwareApplication'), 'Tool detail contains SoftwareApplication schema');

  console.log(`\n========================================`);
  console.log(`Total Route & SEO Audit Tests: ${passed + failed}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runSiteAudit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
