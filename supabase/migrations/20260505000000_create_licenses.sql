create table if not exists licenses (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,
  plan        text not null default 'personal' check (plan in ('personal', 'pro', 'owner')),
  email       text,
  active      boolean not null default true,
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);

-- Index for fast lookups by key
create index if not exists licenses_key_idx on licenses (key);

-- Only the service role can read/write licenses
alter table licenses enable row level security;

create policy "service role full access"
  on licenses
  for all
  to service_role
  using (true)
  with check (true);

-- Explicit GRANT required for PostgREST (Data API) access from May 30, 2026
grant select, insert, update, delete on public.licenses to service_role;
