-- ============================================================================
-- FOAAD · SUPABASE SECURITY VERIFICATION  (READ-ONLY — changes nothing)
-- Run in: Supabase Studio → SQL Editor, on the FOAAD Quran project only.
-- Record the actual output of every check. Do not infer a pass from silence.
-- ============================================================================

-- CHECK 1 · Which tables exist, and is RLS ON for each?
-- EXPECT: every table in `public` has rowsecurity = true.
--         Any `false` is a finding, including tables you thought were internal.
select n.nspname  as schema,
       c.relname  as table,
       c.relrowsecurity as rls_enabled,
       c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where c.relkind in ('r','p') and n.nspname in ('public')
order by 2;

-- CHECK 2 · Exactly which policies exist, for which role, for which command?
-- EXPECT for `cards`: one SELECT policy for anon (or public), and NOTHING else.
--        No INSERT / UPDATE / DELETE / ALL policy naming anon or public.
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, cmd;

-- CHECK 3 · Table-level grants — the layer RLS does NOT cover.
-- EXPECT: anon has SELECT on `cards` only. No INSERT/UPDATE/DELETE/TRUNCATE
--         anywhere, and no grants at all on any non-corpus table.
select grantee, table_schema, table_name, privilege_type
from information_schema.role_table_grants
where grantee in ('anon','authenticated','public')
  and table_schema not in ('pg_catalog','information_schema')
order by grantee, table_name, privilege_type;

-- CHECK 4 · Which schemas are reachable through PostgREST?
-- EXPECT: `public` (and `graphql_public`). If a research/private schema
--         appears here, it is queryable over HTTP.
select rolname, rolconfig
from pg_roles
where rolname in ('anon','authenticated','authenticator');

-- CHECK 5 · Views and functions are NOT covered by table RLS.
-- EXPECT: no SECURITY DEFINER function and no view exposing user/research rows
--         is executable by anon.
select p.proname, p.prosecdef as security_definer,
       pg_get_userbyid(p.proowner) as owner,
       has_function_privilege('anon', p.oid, 'EXECUTE') as anon_can_execute
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
order by 1;

select c.relname as view_name,
       has_table_privilege('anon', c.oid, 'SELECT') as anon_can_select
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where c.relkind in ('v','m') and n.nspname = 'public'
order by 1;

-- CHECK 6 · Corpus integrity — the app must not silently lose cards.
-- EXPECT: H01 = 33, H02 = 38, total 71. No NULL/empty required field.
select hizb_id, count(*) as cards from public.cards group by 1 order by 1;
select count(*) as incomplete_rows from public.cards
where card_id is null or hizb_id is null or index is null
   or surah is null or ayah is null
   or verse_text is null or verse_text = ''
   or tadabbur_text is null or tadabbur_text = '';
