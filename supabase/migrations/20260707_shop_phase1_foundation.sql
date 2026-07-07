-- ============================================================
-- ARTSPIRE SHOP — PHASE 1: FOUNDATION SCHEMA
-- Products, Collections, and supporting tables.
-- Follows the exact conventions of the existing artworks/categories
-- schema: uuid PKs, soft-delete via deleted_at, is_admin_user() RLS,
-- media_library FK reuse, categories FK reuse.
-- ============================================================

-- ─── PART A: PRODUCT STATUS ENUM ────────────────────────────
-- Mirrors artwork_status but adds sold_out, which artworks (one-off
-- commissions) never needed since they aren't restocked.
DO $$ BEGIN
  CREATE TYPE product_status AS ENUM ('draft', 'published', 'sold_out', 'archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ─── PART B: PRODUCTS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  summary text,               -- short one-liner shown on cards
  description text,           -- long-form story paragraph (Artemest/Hermès pattern)

  -- Classification — reuses existing categories table, same as artworks
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  medium text,                -- e.g. "clay", "mirror", "pencil" — free text, matches artwork convention

  -- Commerce
  price numeric(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  compare_at_price numeric(10,2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  currency text NOT NULL DEFAULT 'INR',
  sku text,
  inventory_count integer NOT NULL DEFAULT 1 CHECK (inventory_count >= 0),
  is_one_of_a_kind boolean NOT NULL DEFAULT true,  -- handmade honesty signal; true = "when it's gone, it's gone"

  -- Craft content (Hermès "materials & construction as content" pattern)
  materials_used text,
  dimensions text,
  weight text,
  care_instructions text,

  -- Cross-sell to commission business (Part 2 of architecture proposal)
  commission_similar_enabled boolean NOT NULL DEFAULT true,

  -- Media — reuses existing media_library table, same FK pattern as artworks
  main_image_id uuid REFERENCES media_library(id),
  image_url text,             -- denormalized public_url cache, same pattern as artworks.image_url

  -- Status & visibility
  status product_status NOT NULL DEFAULT 'draft',
  featured boolean NOT NULL DEFAULT false,
  show_on_homepage boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,

  -- SEO — same fields as artworks for consistency with existing SEO admin page
  meta_title text,
  meta_description text,

  -- Audit
  view_count integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES profiles(id),
  updated_by uuid REFERENCES profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  deleted_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_products_status_category ON products(status, category_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_homepage ON products(show_on_homepage) WHERE status = 'published' AND deleted_at IS NULL;

-- ─── PART C: PRODUCT GALLERY IMAGES ──────────────────────────
-- Same pattern as artwork_gallery_images — multiple images per product,
-- ordered, each pointing at media_library.
CREATE TABLE IF NOT EXISTS product_gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  media_id uuid NOT NULL REFERENCES media_library(id) ON DELETE CASCADE,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_gallery_product ON product_gallery_images(product_id, display_order);

-- ─── PART D: COLLECTIONS ─────────────────────────────────────
-- Editorial groupings independent of category — e.g. "Wedding Gifts",
-- "Autumn Pieces". A product can belong to a category AND a collection.
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  hero_image_id uuid REFERENCES media_library(id),
  is_seasonal boolean NOT NULL DEFAULT false,
  starts_at timestamptz,
  ends_at timestamptz,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_collections_active ON collections(is_active) WHERE deleted_at IS NULL;

-- ─── PART E: PRODUCT ↔ COLLECTION JOIN ───────────────────────
CREATE TABLE IF NOT EXISTS product_collections (
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  display_order integer NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, collection_id)
);

-- ─── PART F: MEDIUM CRAFT CONTENT (reusable per-medium blocks) ──
-- "About Clay Work", "About Mirror Art" etc — written once, shown on
-- every product of that medium. Matches Part 5 of the architecture doc.
CREATE TABLE IF NOT EXISTS medium_craft_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medium text UNIQUE NOT NULL,
  title text NOT NULL,        -- e.g. "About Clay Work"
  content text NOT NULL,
  image_id uuid REFERENCES media_library(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─── PART G: ROW LEVEL SECURITY ──────────────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE medium_craft_content ENABLE ROW LEVEL SECURITY;

-- Public can read published, non-deleted products — same pattern as artworks
CREATE POLICY "Public read published products" ON products
  FOR SELECT USING (status = 'published' AND deleted_at IS NULL);
CREATE POLICY "Admin full access products" ON products
  FOR ALL USING (is_admin_user(auth.uid()));

CREATE POLICY "Public read product gallery" ON product_gallery_images
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_id AND products.status = 'published' AND products.deleted_at IS NULL)
  );
CREATE POLICY "Admin full access product gallery" ON product_gallery_images
  FOR ALL USING (is_admin_user(auth.uid()));

CREATE POLICY "Public read active collections" ON collections
  FOR SELECT USING (is_active = true AND deleted_at IS NULL);
CREATE POLICY "Admin full access collections" ON collections
  FOR ALL USING (is_admin_user(auth.uid()));

CREATE POLICY "Public read product collections" ON product_collections
  FOR SELECT USING (true);
CREATE POLICY "Admin full access product collections" ON product_collections
  FOR ALL USING (is_admin_user(auth.uid()));

CREATE POLICY "Public read craft content" ON medium_craft_content
  FOR SELECT USING (true);
CREATE POLICY "Admin full access craft content" ON medium_craft_content
  FOR ALL USING (is_admin_user(auth.uid()));

-- ─── PART H: SEED — one craft content block per existing medium ─
-- Admin can edit these immediately from the new admin page (Part 2 of build).
INSERT INTO medium_craft_content (medium, title, content) VALUES
  ('clay', 'About Clay Work', 'Every clay piece is hand-thrown and shaped, then fired and finished by hand. Small variations in glaze and texture are part of the material — no two pieces are ever perfectly identical.'),
  ('mirror', 'About Mirror Art', 'Each mirror piece is hand-assembled using traditional techniques, with every decorative element placed and set by hand. The finish may show gentle natural variation, a mark of genuine handcraft.'),
  ('pencil', 'About Pencil Work', 'Drawn entirely by hand using graphite on archival paper. No two sketches are ever the same — each carries the artist''s hand in every line.'),
  ('painting', 'About Painting', 'Painted by hand using traditional techniques and pigments. Brushwork, texture, and color may vary slightly from piece to piece — the mark of a handmade original.')
ON CONFLICT (medium) DO NOTHING;
