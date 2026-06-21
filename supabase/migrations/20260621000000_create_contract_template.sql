-- Single-row table holding the editable service-contract template.
-- Only the service role touches it, via the protected /api/admin/contract route.

create table if not exists contract_template (
  id          smallint primary key default 1 check (id = 1),
  content     text not null,
  updated_at  timestamptz not null default now()
);

alter table contract_template enable row level security;

create policy "service role full access"
  on contract_template
  for all
  to service_role
  using (true)
  with check (true);

-- Explicit GRANT required for PostgREST (Data API) access
grant select, insert, update, delete on public.contract_template to service_role;
