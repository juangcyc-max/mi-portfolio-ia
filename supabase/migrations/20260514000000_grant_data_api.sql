-- Explicit Data API grants required from May 30 (new projects) / October 30 2026 (existing).
-- service_role: full access to all tables (bypasses RLS but still needs GRANT for PostgREST).
-- anon: only insert on tables that public API routes write to via the anon key.

-- ── service_role (used by server-side API routes with SUPABASE_SERVICE_ROLE_KEY) ──────────────

grant select, insert, update, delete
  on public.leads, public.messages, public.conversations, public.chat_messages,
     public.budget_requests, public.incidents, public.page_views,
     public.ai_replies, public.push_tokens, public.facturas, public.licenses
  to service_role;

-- ── anon (used by server-side routes with NEXT_PUBLIC_SUPABASE_ANON_KEY) ──────────────────────
-- Contacts & messages (contact form)
grant insert on public.leads    to anon;
grant insert on public.messages to anon;

-- Chat (web chat route stores conversation + messages with anon key)
grant select, insert on public.conversations  to anon;
grant select, insert on public.chat_messages  to anon;

-- Incidents (public incident form)
grant insert on public.incidents to anon;

-- ── RLS must be enabled on all tables ─────────────────────────────────────────────────────────
-- (already enabled via dashboard; listed here for completeness if re-deploying from scratch)
-- alter table public.leads            enable row level security;
-- alter table public.messages         enable row level security;
-- alter table public.conversations    enable row level security;
-- alter table public.chat_messages    enable row level security;
-- alter table public.budget_requests  enable row level security;
-- alter table public.incidents        enable row level security;
-- alter table public.page_views       enable row level security;
-- alter table public.ai_replies       enable row level security;
-- alter table public.push_tokens      enable row level security;
-- alter table public.facturas         enable row level security;
