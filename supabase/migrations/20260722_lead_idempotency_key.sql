-- ─── LEAD IDEMPOTENCY KEY ─────────────────────────────────────
-- Task 0D: the commission/contact form can be retried after a failure. If the
-- first attempt actually succeeded server-side but its response was lost (a
-- network blip on the way back), a naive retry would insert a SECOND lead for
-- one enquiry. Each form instance sends a client-generated UUID; the insert is
-- deduped on it (unique index), so a retry returns the existing lead instead of
-- creating a duplicate. Additive, non-destructive.

alter table public.leads
  add column if not exists idempotency_key text;

create unique index if not exists leads_idempotency_key_uidx
  on public.leads (idempotency_key)
  where idempotency_key is not null;
