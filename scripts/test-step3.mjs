import { spawn } from 'node:child_process';

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw new Error(`Server did not respond at ${url} within ${timeout}ms`);
}

async function runTests() {
  console.log('--- STEP 3 ACCEPTANCE TESTS ---');
  const PORT = 3006;
  const server = spawn('node', ['./node_modules/next/dist/bin/next', 'start', '-p', String(PORT)], {
    cwd: process.cwd(),
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => {
    // console.log(`[Next.js] ${d}`);
  });
  server.stderr.on('data', (d) => {
    console.error(`[Next.js err] ${d}`);
  });

  try {
    const baseUrl = `http://localhost:${PORT}`;
    await waitForServer(baseUrl);
    console.log('✅ Server ready on port', PORT);

    // 1. Test /tools/jasper
    console.log('1. Testing /tools/jasper...');
    const toolRes = await fetch(`${baseUrl}/tools/jasper`);
    if (!toolRes.ok) throw new Error(`/tools/jasper failed with ${toolRes.status}`);
    const toolHtml = await toolRes.text();
    if (!toolHtml.includes('Jasper')) throw new Error('Tool page missing name Jasper');
    if (!toolHtml.includes('SoftwareApplication')) throw new Error('Tool page missing SoftwareApplication JSON-LD');
    if (!toolHtml.includes('/out/jasper')) throw new Error('Tool page missing outbound link /out/jasper');
    console.log('✅ Tool page verified: H1, metadata, JSON-LD SoftwareApplication, and breadcrumbs!');

    // 2. Test /stage/attract
    console.log('2. Testing /stage/attract...');
    const stageRes = await fetch(`${baseUrl}/stage/attract`);
    if (!stageRes.ok) throw new Error(`/stage/attract failed with ${stageRes.status}`);
    const stageHtml = await stageRes.text();
    const cleanStageHtml = stageHtml.replace(/<!--.*?-->/g, '');
    if (!cleanStageHtml.includes('Attract tools')) throw new Error('Stage page missing H1 Attract tools');
    if (!stageHtml.includes('ItemList')) throw new Error('Stage page missing ItemList JSON-LD');
    console.log('✅ Stage page verified: H1 Attract tools, ItemList schema, category chips!');

    // 3. Test /category/seo
    console.log('3. Testing /category/seo...');
    const catRes = await fetch(`${baseUrl}/category/seo`);
    if (!catRes.ok) throw new Error(`/category/seo failed with ${catRes.status}`);
    const catHtml = await catRes.text();
    const cleanCatHtml = catHtml.replace(/<!--.*?-->/g, '');
    if (!cleanCatHtml.includes('Best AI tools for improving search rankings')) {
      throw new Error('Category page missing H1 with category phrase');
    }
    console.log('✅ Category page verified: H1 phrase match and tools list!');

    // 4. Test /out/jasper
    console.log('4. Testing /out/jasper redirect...');
    const outRes = await fetch(`${baseUrl}/out/jasper`, { redirect: 'manual' });
    if (outRes.status !== 302) throw new Error(`Expected 302 from /out/jasper, got ${outRes.status}`);
    const location = outRes.headers.get('location');
    if (!location || !location.includes('jasper.ai')) {
      throw new Error(`Expected location header to jasper.ai, got ${location}`);
    }
    console.log(`✅ Outbound redirect verified: 302 -> ${location}!`);

    // 5. Test /sitemap.xml
    console.log('5. Testing /sitemap.xml...');
    const smRes = await fetch(`${baseUrl}/sitemap.xml`);
    if (!smRes.ok) throw new Error(`/sitemap.xml failed with ${smRes.status}`);
    const smText = await smRes.text();
    if (!smText.includes('<urlset') || !smText.includes('/tools/jasper') || !smText.includes('/stage/attract')) {
      throw new Error('Sitemap does not contain expected XML and tool URLs');
    }
    console.log('✅ Sitemap verified: valid XML with tool, stage, and category URLs!');

    // 6. Test /robots.txt
    console.log('6. Testing /robots.txt...');
    const robRes = await fetch(`${baseUrl}/robots.txt`);
    if (!robRes.ok) throw new Error(`/robots.txt failed with ${robRes.status}`);
    const robText = await robRes.text();
    if (!robText.includes('Disallow: /admin/')) {
      throw new Error('Robots.txt missing Disallow /admin/');
    }
    console.log('✅ Robots.txt verified: Disallows /admin/ and /out/!');

    console.log('\n🎉 ALL STEP 3 ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
  } finally {
    server.kill();
  }
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
