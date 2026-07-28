-- ─── COMMISSION PHOTO ATTACHMENTS ─────────────────────────────
-- Task 0C: the commission form can now attach the customer's reference
-- photographs. We store the storage PATHS (not signed URLs, which expire)
-- of the uploaded objects in the private `reference-images` bucket. The
-- admin Lead Center re-signs these paths fresh on every view, so links
-- never go dead. Additive, non-destructive.

alter table public.leads
  add column if not exists photo_urls text[] default '{}';
