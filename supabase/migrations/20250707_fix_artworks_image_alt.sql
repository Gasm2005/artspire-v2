-- ============================================================
-- Artspire V2 — Missing artworks column fix
-- Date: 2025-07-07
-- Adds image_alt which was referenced by frontend but never created
-- ============================================================

ALTER TABLE artworks ADD COLUMN IF NOT EXISTS image_alt text;
