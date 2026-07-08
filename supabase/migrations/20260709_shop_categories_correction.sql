-- ============================================================
-- ARTSPIRE SHOP — CORRECTION MIGRATION
-- Creates shop_categories (separate taxonomy for Business 2:
-- Handmade Luxury Home Decor) and corrects products.category_id
-- to point here instead of the commission-side categories table.
-- ============================================================

-- ─── PART A: SHOP CATEGORIES TABLE ──────────────────────────
CREATE TABLE IF NOT EXISTS shop_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  short_summary text,
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_shop_categories_active ON shop_categories(is_active) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_shop_categories_slug ON shop_categories(slug) WHERE deleted_at IS NULL;

ALTER TABLE shop_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active shop categories" ON shop_categories
  FOR SELECT USING (is_active = true AND deleted_at IS NULL);
CREATE POLICY "Admin full access shop categories" ON shop_categories
  FOR ALL USING (is_admin_user(auth.uid()));

-- ─── PART B: SEED THE 11 SHOP CATEGORIES ────────────────────
INSERT INTO shop_categories (slug, name, display_order) VALUES
  ('luxury-lamps',               'Luxury Lamps',                1),
  ('wooden-decorative-objects',  'Wooden Decorative Objects',   2),
  ('handmade-home-decor',        'Handmade Home Decor',         3),
  ('clay-decor',                 'Clay Decor',                  4),
  ('cement-sculptures',          'Cement Sculptures',           5),
  ('premium-gift-objects',       'Premium Gift Objects',        6),
  ('diy-art-kits',               'DIY Art Kits',                7),
  ('kids-creative-products',     'Kids Creative Products',      8),
  ('flower-pots',                'Flower Pots',                 9),
  ('bottle-art',                 'Bottle Art',                  10),
  ('limited-edition-collectibles','Limited Edition Collectibles',11)
ON CONFLICT (slug) DO NOTHING;

-- ─── PART C: CORRECT products.category_id FK ────────────────
-- Drop the old FK (pointing at commission `categories`) and
-- re-add pointing at `shop_categories`. Existing category_id
-- values are set to NULL since no shop products exist yet in
-- production — this is safe at this stage.

ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_id_fkey;

UPDATE products SET category_id = NULL; -- safety: clear any stale refs to old table

ALTER TABLE products
  ADD CONSTRAINT products_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES shop_categories(id) ON DELETE SET NULL;

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================
