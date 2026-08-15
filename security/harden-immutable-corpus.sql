-- FOAAD immutable-corpus hardening.
-- Keeps anonymous and authenticated reads, but removes direct mutation grants.
-- RLS remains enabled and service_role/postgres administration is unchanged.

begin;

revoke insert, update, delete, truncate, references, trigger
on table public.cards,
         public.hizbs,
         public.architecture_versions,
         public.corpus_corrections,
         public.instrumentation,
         public.nodes,
         public.transitions,
         public.watchlist
from anon, authenticated;

grant select
on table public.cards,
         public.hizbs,
         public.architecture_versions,
         public.corpus_corrections,
         public.instrumentation,
         public.nodes,
         public.transitions,
         public.watchlist
to authenticated;

grant select on table public.cards to anon;

commit;
