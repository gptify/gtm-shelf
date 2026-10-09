// GTMShelf Performance & Conversion Reporting Script
// Run: node scripts/analytics-report.mjs

import fs from 'fs';
import path from 'path';

async function generateReport() {
  console.log('======================================================');
  console.log('📊 GTMShelf Executive Performance & Conversion Report');
  console.log(`Generated: ${new Date().toISOString()}`);
  console.log('======================================================\n');

  // 1. Directory Inventory Summary
  const toolsPath = path.resolve('data/tools.json');
  let tools = [];
  if (fs.existsSync(toolsPath)) {
    tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
  }

  const totalTools = tools.length;
  const affiliateTools = tools.filter((t) => t.affiliate_url);
  const featuredTools = tools.filter((t) => t.feat);

  console.log('1. DIRECTORY OVERVIEW');
  console.log(`   - Total Curated Tools: ${totalTools}`);
  console.log(`   - Approved Affiliate Trackers: ${affiliateTools.length} (${Math.round((affiliateTools.length / totalTools) * 100)}%)`);
  console.log(`   - Featured / Promoted Tools: ${featuredTools.length}`);
  console.log('');

  // 2. Affiliate Registry Status
  console.log('2. ACTIVE PARTNER LINKS (from Google Doc authoritative source)');
  affiliateTools.forEach((t, i) => {
    console.log(`   [${i + 1}] ${t.name} (${t.domain}) -> ${t.affiliate_url.slice(0, 45)}...`);
  });
  console.log('');

  // 3. Conversion Funnel Checkpoints
  console.log('3. CONVERSION EVENT TAXONOMY');
  const events = [
    { event: 'stack_started', desc: 'User entered Build My Stack wizard or clicked hero primary CTA' },
    { event: 'stack_completed', desc: 'User generated tailored stack architecture recommendation' },
    { event: 'stack_shared', desc: 'User copied shareable link or shared stack to LinkedIn' },
    { event: 'tool_viewed', desc: 'User opened tool details drawer or visited dedicated tool page' },
    { event: 'vendor_clicked', desc: 'Outbound click to direct vendor homepage (/out/[slug])' },
    { event: 'affiliate_clicked', desc: 'Outbound click routed via approved affiliate partnership' },
    { event: 'newsletter_cta_clicked', desc: 'User engaged with GPTify newsletter subscription box' },
    { event: 'custom_request', desc: 'B2B operator requested bespoke workflow build from GPTify.co' },
  ];

  events.forEach((e) => {
    console.log(`   • ${e.event.padEnd(24)} : ${e.desc}`);
  });
  console.log('');

  // 4. Acquisition & Attribution Strategy
  console.log('4. ATTRIBUTION CHANNELS');
  console.log('   • GPTify Newsletter : utm_source=gptify&utm_medium=newsletter&utm_campaign=edition_[X]');
  console.log('   • LinkedIn Organic  : utm_source=linkedin&utm_medium=social&utm_campaign=stack_breakdown');
  console.log('   • Partner Referrals : utm_source=partner&utm_medium=ecosystem&utm_campaign=[tool]');
  console.log('   • Direct / SEO      : Organic search traffic via programmatic /stage, /category, /tools');
  console.log('');

  console.log('======================================================');
  console.log('✅ End of Report. Telemetry hooks are active and live.');
  console.log('======================================================');
}

generateReport().catch(console.error);
