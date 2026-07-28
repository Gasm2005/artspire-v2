-- ─── COMMISSION QUOTING FIELDS ────────────────────────────────
-- Task 0E: capture enough to quote without a WhatsApp round-trip. The service
-- itself reuses the existing leads.category_id (same categories row the service
-- cards use — one source of truth), and budget reuses the existing
-- leads.budget_range. Only `size` and `needed_by` are genuinely new. Additive.

alter table public.leads
  add column if not exists size text,
  add column if not exists needed_by date;
