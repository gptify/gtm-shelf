import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import fs from 'node:fs/promises';
import path from 'node:path';

async function main() {
  console.log('Testing PostgreSQL schema and seeds with PGlite (PostgreSQL 16 in WASM)...');
  const db = new PGlite({
    extensions: { pg_trgm }
  });

  // Test schema.sql
  console.log('Executing db/schema.sql...');
  let schemaSql = await fs.readFile(path.join(process.cwd(), 'db/schema.sql'), 'utf8');

  // Supabase has auth.users and auth.uid(). In standard standalone Postgres, create auth schema and mock auth.uid()
  // if not present so schema.sql can be tested cleanly.
  const authSetup = `
    do $$ begin create role anon; exception when others then null; end $$;
    do $$ begin create role authenticated; exception when others then null; end $$;
    create schema if not exists auth;
    create table if not exists auth.users (
      id uuid primary key default gen_random_uuid(),
      email text
    );
    create or replace function auth.uid() returns uuid language sql stable as $$
      select '00000000-0000-0000-0000-000000000000'::uuid;
    $$;
  `;
  await db.exec(authSetup);

  try {
    await db.exec(schemaSql);
    console.log('✅ db/schema.sql executed successfully without errors!');
  } catch (err) {
    console.error('❌ Error executing db/schema.sql:', err);
    process.exit(1);
  }

  // Test seed_reference.sql
  console.log('Executing db/seed_reference.sql...');
  try {
    const seedRefSql = await fs.readFile(path.join(process.cwd(), 'db/seed_reference.sql'), 'utf8');
    await db.exec(seedRefSql);
    console.log('✅ db/seed_reference.sql executed successfully!');
  } catch (err) {
    console.error('❌ Error executing db/seed_reference.sql:', err);
    process.exit(1);
  }

  // Test seed_tools_unverified.sql
  console.log('Executing db/seed_tools_unverified.sql...');
  try {
    const seedToolsSql = await fs.readFile(path.join(process.cwd(), 'db/seed_tools_unverified.sql'), 'utf8');
    await db.exec(seedToolsSql);
    console.log('✅ db/seed_tools_unverified.sql executed successfully!');
  } catch (err) {
    console.error('❌ Error executing db/seed_tools_unverified.sql:', err);
    process.exit(1);
  }

  // Verify counts
  const stagesRes = await db.query('select count(*) as count from stages;');
  const catsRes = await db.query('select count(*) as count from categories;');
  const intsRes = await db.query('select count(*) as count from integrations;');
  const toolsRes = await db.query('select count(*) as count from tools;');
  const toolIntsRes = await db.query('select count(*) as count from tool_integrations;');
  const toolsPublicRes = await db.query('select count(*) as count from tools_public;');

  console.log(`Stages: ${stagesRes.rows[0].count}`);
  console.log(`Categories: ${catsRes.rows[0].count}`);
  console.log(`Integrations: ${intsRes.rows[0].count}`);
  console.log(`Tools (total in db): ${toolsRes.rows[0].count}`);
  console.log(`Tool Integrations: ${toolIntsRes.rows[0].count}`);
  console.log(`Tools Public view (published only): ${toolsPublicRes.rows[0].count}`);

  // Test tool publishing
  console.log('Verifying tool can be published to tools_public view...');
  await db.query(`update tools set status = 'published' where slug = 'jasper';`);
  const pubRes = await db.query(`select count(*) as count from tools_public;`);
  if (parseInt(pubRes.rows[0].count, 10) === 1) {
    console.log('✅ Tool successfully published and visible in tools_public view!');
  } else {
    throw new Error('Expected 1 published tool in tools_public view');
  }

  console.log('🎉 All schema and seed validations passed with 100% compliance!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
