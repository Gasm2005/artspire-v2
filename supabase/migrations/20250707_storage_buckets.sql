-- ============================================================
-- Artspire V2 — Storage Bucket Setup
-- Date: 2025-07-07
-- Run this via Supabase SQL Editor or psql
-- ============================================================

-- media-library bucket: CMS image uploads (10MB limit, images only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('media-library', 'media-library', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- visual-assets bucket: overlays, textures, patterns (5MB limit, images only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('visual-assets', 'visual-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE RLS POLICIES (idempotent: drop then create)
-- ============================================================
-- Note: Both buckets are public, so public read access is provided
-- via the public URL mechanism. No SELECT policy is needed.
-- Only INSERT and DELETE policies are required for admin operations.

-- media-library bucket: admin upload
DROP POLICY IF EXISTS "Admin upload media-library" ON storage.objects;
CREATE POLICY "Admin upload media-library"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media-library' AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- media-library bucket: admin delete
DROP POLICY IF EXISTS "Admin delete media-library" ON storage.objects;
CREATE POLICY "Admin delete media-library"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media-library' AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- visual-assets bucket: admin upload
DROP POLICY IF EXISTS "Admin upload visual-assets" ON storage.objects;
CREATE POLICY "Admin upload visual-assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'visual-assets' AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- visual-assets bucket: admin delete
DROP POLICY IF EXISTS "Admin delete visual-assets" ON storage.objects;
CREATE POLICY "Admin delete visual-assets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'visual-assets' AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));
