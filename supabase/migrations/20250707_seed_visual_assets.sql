-- ============================================================
-- Artspire V2 — Seed Predefined Visual Assets
-- Date: 2025-07-07
-- Note: These assets need corresponding image files uploaded to
-- the `visual-assets` storage bucket. The paths below reference
-- expected locations. Upload actual PNG overlay/texture files.
-- ============================================================

-- Only seed if table is empty
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM visual_assets LIMIT 1) THEN
    RETURN;
  END IF;

  INSERT INTO visual_assets (name, slug, asset_type, storage_path, public_url, preview_url, default_opacity, category_suggestions, is_predefined, is_active, description) VALUES
    ('Brush Strokes', 'brush-strokes', 'overlay', 'overlay/brush-strokes.png', 'https://placeholder/brush-strokes.png', 'https://placeholder/brush-strokes.png', 20, ARRAY['paintings', 'colour-portraits'], true, true, 'Soft brush stroke texture for paintings and colour portraits'),
    ('Graphite Texture', 'graphite-texture', 'overlay', 'overlay/graphite-texture.png', 'https://placeholder/graphite-texture.png', 'https://placeholder/graphite-texture.png', 25, ARRAY['pencil-sketches'], true, true, 'Graphite pencil texture overlay for sketches'),
    ('Paint Swash', 'paint-swash', 'overlay', 'overlay/paint-swash.png', 'https://placeholder/paint-swash.png', 'https://placeholder/paint-swash.png', 15, ARRAY['paintings', 'colour-portraits'], true, true, 'Colorful paint swash decorative overlay'),
    ('Paper Grain', 'paper-grain', 'texture', 'texture/paper-grain.png', 'https://placeholder/paper-grain.png', 'https://placeholder/paper-grain.png', 30, ARRAY['pencil-sketches'], true, true, 'Fine paper grain texture for pencil sketches'),
    ('Canvas Texture', 'canvas-texture', 'texture', 'texture/canvas-texture.png', 'https://placeholder/canvas-texture.png', 'https://placeholder/canvas-texture.png', 20, ARRAY['paintings'], true, true, 'Canvas weave texture for paintings'),
    ('Gold Accents', 'gold-accents', 'overlay', 'overlay/gold-accents.png', 'https://placeholder/gold-accents.png', 'https://placeholder/gold-accents.png', 15, ARRAY['mirror-art', 'personalized-gifts'], true, true, 'Elegant gold accent decorative overlay'),
    ('Glass Reflections', 'glass-reflections', 'overlay', 'overlay/glass-reflections.png', 'https://placeholder/glass-reflections.png', 'https://placeholder/glass-reflections.png', 20, ARRAY['mirror-art'], true, true, 'Subtle glass reflection overlay for mirror art'),
    ('Clay Texture', 'clay-texture', 'texture', 'texture/clay-texture.png', 'https://placeholder/clay-texture.png', 'https://placeholder/clay-texture.png', 25, ARRAY['clay-art'], true, true, 'Raw clay surface texture for clay art'),
    ('Dot Grid', 'dot-grid', 'pattern', 'pattern/dot-grid.png', 'https://placeholder/dot-grid.png', 'https://placeholder/dot-grid.png', 10, ARRAY['pencil-sketches'], true, true, 'Subtle dot grid pattern for sketch backgrounds'),
    ('Soft Shadows', 'soft-shadows', 'overlay', 'overlay/soft-shadows.png', 'https://placeholder/soft-shadows.png', 'https://placeholder/soft-shadows.png', 20, ARRAY[]::text[], true, true, 'Soft shadow overlay for depth and dimension');
END $$;
