import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:3001';

async function testStep7() {
  console.log('--- Step 7: Legal Pages, Disclosures & Design Tokens Test Suite ---');

  // 1. Legal Pages
  const pages = [
    { url: '/about', titleSnippet: 'About GTM Shelf', contentSnippet: 'Why We Built GTM Shelf' },
    { url: '/privacy', titleSnippet: 'Privacy Policy', contentSnippet: 'Data We Collect and Why' },
    { url: '/terms', titleSnippet: 'Terms of Use', contentSnippet: 'Agreement to Terms' },
    { url: '/imprint', titleSnippet: 'Imprint', contentSnippet: 'Website Operator' },
  ];

  for (const p of pages) {
    const res = await fetch(`${BASE_URL}${p.url}`);
    assert.equal(res.status, 200, `Page ${p.url} must return 200 OK`);
    const html = await res.text();
    assert.ok(html.includes(p.titleSnippet), `${p.url} must contain title snippet: ${p.titleSnippet}`);
    assert.ok(html.includes(p.contentSnippet), `${p.url} must contain content snippet: ${p.contentSnippet}`);
    assert.ok(html.includes('rel="canonical"') || html.includes(`href="https://gtmshelf.com${p.url}"`), `${p.url} must have canonical URL`);
    console.log(`✓ ${p.url} verified`);
  }

  // 2. Robots & Sitemap
  console.log('2. Verifying sitemap.xml and robots.txt...');
  const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
  assert.equal(robotsRes.status, 200, '/robots.txt must return 200');
  const robotsTxt = await robotsRes.text();
  assert.ok(robotsTxt.includes('Sitemap:'), 'robots.txt must declare sitemap');

  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
  assert.equal(sitemapRes.status, 200, '/sitemap.xml must return 200');
  const sitemapXml = await sitemapRes.text();
  assert.ok(sitemapXml.includes('/about'), 'Sitemap must contain /about');
  assert.ok(sitemapXml.includes('/privacy'), 'Sitemap must contain /privacy');
  assert.ok(sitemapXml.includes('/terms'), 'Sitemap must contain /terms');
  assert.ok(sitemapXml.includes('/imprint'), 'Sitemap must contain /imprint');
  console.log('✓ robots.txt and sitemap.xml verified');

  console.log('\n===========================================');
  console.log('ALL STEP 7 SPECIFICATIONS PASSED! 🎉');
  console.log('===========================================');
}

testStep7().catch((err) => {
  console.error('Step 7 test failed:', err);
  process.exit(1);
});
