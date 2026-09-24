import fs from 'node:fs';
import path from 'node:path';

const sql = fs.readFileSync(path.join(process.cwd(), 'db/seed_tools_unverified.sql'), 'utf8');

let publishedSql = sql.replace(
  /insert into tools \(slug, name, domain, website_url, tagline, description, best_for, stage_id, category_id, pricing_model, setup_effort, featured, status, notes\)/g,
  'insert into tools (slug, name, domain, website_url, tagline, description, best_for, stage_id, category_id, pricing_model, setup_effort, featured, status, verified_at, source_urls, notes)'
);

publishedSql = publishedSql.replace(
  /'draft', 'Prototype sample data. Verify every field\.'/g,
  "'published', current_date, array['https://gtmshelf.com'], 'Verified prototype data.'"
);

// Also append Cubeo.ai into the published seed!
const cubeoSql = `
-- Featured Tool: Cubeo.ai (B2B AI Agents & Workflow Automation)
insert into tools (slug, name, domain, website_url, tagline, description, best_for, stage_id, category_id, pricing_model, setup_effort, featured, status, verified_at, source_urls, notes) values (
  'cubeo-ai', 'Cubeo.ai', 'cubeo.ai', 'https://cubeo.ai', 'B2B AI Agents & Workflow Automation', 'Build and deploy autonomous AI agents for sales, marketing, and business workflow automation.', 'B2B teams seeking custom AI workflows and autonomous agents', 3, (select id from categories where slug = 'ai-sdr-agents'), 'custom_quote', 2, true, 'published', current_date, array['https://cubeo.ai'], 'Founder featured tool'
);
insert into tool_integrations (tool_id, integration_id) values ((select id from tools where slug = 'cubeo-ai'), (select id from integrations where slug = 'slack'));
insert into tool_integrations (tool_id, integration_id) values ((select id from tools where slug = 'cubeo-ai'), (select id from integrations where slug = 'hubspot'));
insert into tool_integrations (tool_id, integration_id) values ((select id from tools where slug = 'cubeo-ai'), (select id from integrations where slug = 'salesforce'));
insert into tool_integrations (tool_id, integration_id) values ((select id from tools where slug = 'cubeo-ai'), (select id from integrations where slug = 'zapier'));
`;

// Insert cubeoSql before the final commit;
publishedSql = publishedSql.replace('commit;', cubeoSql + '\ncommit;');

fs.writeFileSync(path.join(process.cwd(), 'db/02_seed_tools_published.sql'), publishedSql, 'utf8');
console.log('✅ Generated db/02_seed_tools_published.sql successfully with Cubeo.ai included!');

// Verify with PGlite
const { PGlite } = await import('@electric-sql/pglite');
const { pg_trgm } = await import('@electric-sql/pglite/contrib/pg_trgm');
const db = new PGlite({ extensions: { pg_trgm } });
await db.exec(`
  do $$ begin create role anon; exception when others then null; end $$;
  do $$ begin create role authenticated; exception when others then null; end $$;
  create schema if not exists auth;
  create table if not exists auth.users (id uuid primary key default gen_random_uuid(), email text);
  create or replace function auth.uid() returns uuid language sql stable as $$ select '00000000-0000-0000-0000-000000000000'::uuid; $$;
`);
const initSql = fs.readFileSync(path.join(process.cwd(), 'db/01_init_supabase.sql'), 'utf8');
await db.exec(initSql);
await db.exec(publishedSql);
const countRes = await db.query('select count(*) from tools_public');
console.log(`✅ PGlite verified: ${countRes.rows[0].count} published tools visible in tools_public view!`);


