# Artspire V2 — Phase 1 Implementation Plan

> **Date:** 2025-07-07  
> **Source of Truth:** `docs/CMS-Architecture-Blueprint.md` + `docs/Phase-1-Implementation-Architecture.md`  
> **Priority:** Follow the exact sprint order from Phase 1 Architecture

---

## SPRINT ORDER

| Sprint | Focus | Duration | Modules |
|---|---|---|---|
| Sprint 1 | Foundation | Week 1-2 | Database, Media Library, Visual Assets, Category Visual System, Website Content |
| Sprint 2 | Content | Week 3-4 | Enhanced Artwork, FAQ Management, Page Sections, SEO Center |
| Sprint 3 | Business | Week 5-6 | Lead Center, WhatsApp Center, Dashboard, Settings |
| Sprint 4 | Polish | Week 7-8 | Image optimization, Content seeding, Onboarding, Testing |

---

## SPRINT 1: FOUNDATION (Week 1-2)

### Task 1.1: Database Migrations

**Migration File:** `supabase/migrations/20250707_phase1_foundation.sql`

#### Step A: Extend Existing Tables

```sql
-- artworks extensions
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS short_description text;
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS main_image_id uuid REFERENCES media_library(id);
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS thumbnail_image_id uuid REFERENCES media_library(id);
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS before_image_id uuid REFERENCES media_library(id);
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS after_image_id uuid REFERENCES media_library(id);
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS scheduled_publish_at timestamptz;
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS inquiry_count integer DEFAULT 0;
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES profiles(id);
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES profiles(id);

-- categories extensions
ALTER TABLE categories ADD COLUMN IF NOT EXISTS short_summary text;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS card_artwork_image_id uuid REFERENCES media_library(id);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS card_overlay_id uuid REFERENCES visual_assets(id);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS card_overlay_opacity integer DEFAULT 25 CHECK (card_overlay_opacity BETWEEN 0 AND 100);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS card_gradient_style text DEFAULT 'bottom-dark' CHECK (card_gradient_style IN ('bottom-dark', 'center-vignette', 'none'));
ALTER TABLE categories ADD COLUMN IF NOT EXISTS card_text_position text DEFAULT 'bottom-left' CHECK (card_text_position IN ('bottom-left', 'bottom-center', 'center'));
ALTER TABLE categories ADD COLUMN IF NOT EXISTS banner_artwork_image_id uuid REFERENCES media_library(id);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS banner_overlay_id uuid REFERENCES visual_assets(id);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS thumbnail_image_id uuid REFERENCES media_library(id);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS og_image_id uuid REFERENCES media_library(id);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES profiles(id);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES profiles(id);

-- artwork_tags extension
ALTER TABLE artwork_tags ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- faqs extensions
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS section_id uuid REFERENCES faq_sections(id);
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS schema_type text DEFAULT 'FAQPage' CHECK (schema_type IN ('FAQPage', 'QAPage'));
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES profiles(id);
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES profiles(id);

-- seo_metadata extensions
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS og_image_id uuid REFERENCES media_library(id);
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS twitter_card text DEFAULT 'summary_large_image' CHECK (twitter_card IN ('summary', 'summary_large_image'));
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS twitter_image_id uuid REFERENCES media_library(id);
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS robots_meta text DEFAULT 'index, follow' CHECK (robots_meta IN ('index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow'));
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS canonical_url text;
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS schema_type text DEFAULT 'Article' CHECK (schema_type IN ('Article', 'Product', 'FAQPage', 'Organization', 'LocalBusiness', 'CreativeWork', 'BreadcrumbList'));
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS custom_schema jsonb;
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS seo_score integer GENERATED ALWAYS AS (
  CASE WHEN meta_title IS NOT NULL THEN 20 ELSE 0 END +
  CASE WHEN meta_description IS NOT NULL THEN 20 ELSE 0 END +
  CASE WHEN canonical_url IS NOT NULL THEN 10 ELSE 0 END +
  CASE WHEN og_image_id IS NOT NULL THEN 15 ELSE 0 END +
  CASE WHEN og_title IS NOT NULL THEN 10 ELSE 0 END +
  CASE WHEN og_description IS NOT NULL THEN 10 ELSE 0 END +
  CASE WHEN structured_data IS NOT NULL THEN 15 ELSE 0 END
) STORED;
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES profiles(id);
```

#### Step B: Create New Core Tables

```sql
-- media_library
CREATE TABLE media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  width integer,
  height integer,
  aspect_ratio numeric(5,2),
  file_size integer,
  mime_type text,
  variants jsonb DEFAULT '{}',
  alt_text text,
  title text,
  description text,
  caption text,
  tags text[],
  folder text DEFAULT 'uncategorized',
  ai_generated_alt text,
  ai_generated_tags text[],
  dominant_colors jsonb,
  usage_count integer DEFAULT 0,
  used_in jsonb DEFAULT '[]',
  uploaded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- media_variants
CREATE TABLE media_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid REFERENCES media_library(id) ON DELETE CASCADE,
  variant_name text NOT NULL,
  storage_path text NOT NULL,
  url text NOT NULL,
  width integer,
  height integer,
  file_size integer,
  mime_type text,
  created_at timestamptz DEFAULT now()
);

-- media_usage_log
CREATE TABLE media_usage_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid REFERENCES media_library(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  usage_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- visual_assets
CREATE TABLE visual_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  asset_type text NOT NULL CHECK (asset_type IN ('overlay', 'texture', 'pattern', 'gradient', 'icon', 'background', 'decorative')),
  storage_path text NOT NULL,
  public_url text NOT NULL,
  preview_url text,
  file_size integer,
  width integer,
  height integer,
  mime_type text,
  description text,
  default_opacity integer DEFAULT 25 CHECK (default_opacity BETWEEN 0 AND 100),
  category_suggestions text[],
  is_predefined boolean DEFAULT false,
  is_active boolean DEFAULT true,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- visual_asset_usage_log
CREATE TABLE visual_asset_usage_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES visual_assets(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  usage_type text NOT NULL,
  opacity integer,
  created_at timestamptz DEFAULT now()
);

-- website_content
CREATE TABLE website_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text UNIQUE NOT NULL,
  page text NOT NULL,
  section text NOT NULL,
  field_name text NOT NULL,
  value_text text,
  value_html text,
  value_json jsonb,
  value_media_id uuid REFERENCES media_library(id),
  field_type text DEFAULT 'text' CHECK (field_type IN ('text', 'textarea', 'html', 'image', 'multi_image', 'repeater', 'select', 'toggle')),
  description text,
  placeholder text,
  is_required boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- website_content_repeater_items
CREATE TABLE website_content_repeater_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_key text NOT NULL,
  display_order integer DEFAULT 0,
  item_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

#### Step C: Create Supporting Tables (P1)

```sql
-- category_gallery_images
CREATE TABLE category_gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  media_id uuid REFERENCES media_library(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  caption text,
  alt_text text,
  created_at timestamptz DEFAULT now()
);

-- artwork_gallery_images
CREATE TABLE artwork_gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id uuid REFERENCES artworks(id) ON DELETE CASCADE,
  media_id uuid REFERENCES media_library(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  caption text,
  alt_text text,
  created_at timestamptz DEFAULT now()
);

-- artwork_process_images
CREATE TABLE artwork_process_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id uuid REFERENCES artworks(id) ON DELETE CASCADE,
  media_id uuid REFERENCES media_library(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  step_title text,
  step_description text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- faq_sections
CREATE TABLE faq_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- artwork_faqs
CREATE TABLE artwork_faqs (
  artwork_id uuid REFERENCES artworks(id) ON DELETE CASCADE,
  faq_id uuid REFERENCES faqs(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  PRIMARY KEY (artwork_id, faq_id)
);
```

#### Step D: Indexes & RLS

```sql
-- Indexes
CREATE INDEX idx_media_library_folder ON media_library(folder);
CREATE INDEX idx_media_library_tags ON media_library USING gin(tags);
CREATE INDEX idx_website_content_page ON website_content(page);
CREATE INDEX idx_artworks_status_category ON artworks(status, category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_artworks_slug ON artworks(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_artworks_featured ON artworks(featured) WHERE status = 'published' AND deleted_at IS NULL;

-- RLS Policies
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read media" ON media_library FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Admin full access" ON media_library FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

ALTER TABLE visual_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read visual assets" ON visual_assets FOR SELECT USING (is_active = true);
CREATE POLICY "Admin full access" ON visual_assets FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active content" ON website_content FOR SELECT USING (is_active = true);
CREATE POLICY "Admin full access" ON website_content FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
```

---

### Task 1.2: Media Library (Data Layer + Admin UI)

**Files to Create:**

```
src/lib/media-library.ts          # Data layer
src/hooks/useMediaLibrary.ts      # Query hook
src/components/admin/MediaPicker.tsx      # Modal to pick media
src/components/admin/MultiImageUploader.tsx  # Multi upload
src/routes/admin/media/index.tsx  # Media library grid
src/routes/admin/media/$id.tsx    # Media detail with usage
```

**Files to Modify:**

```
src/lib/index.ts                  # Add media-library export
src/lib/storage.ts                # Add media library upload helper
```

---

### Task 1.3: Visual Asset Manager (Data Layer + Admin UI)

**Files to Create:**

```
src/lib/visual-assets.ts          # Data layer
src/hooks/useVisualAssets.ts      # Query hook
src/routes/admin/visual-assets/index.tsx    # Asset grid
src/routes/admin/visual-assets/edit.$id.tsx # Asset edit
```

**Files to Modify:**

```
src/lib/index.ts                  # Add visual-assets export
```

---

### Task 1.4: Category Visual System (Enhance Existing)

**Files to Modify:**

```
src/lib/categories.ts             # Add visual asset CRUD methods
src/routes/admin/categories/index.tsx       # Category list with visual preview
src/routes/admin/categories/edit.$id.tsx  # Category edit with visual system
```

---

### Task 1.5: Website Content Manager (Data Layer + Admin UI)

**Files to Create:**

```
src/lib/website-content.ts        # Data layer
src/hooks/useWebsiteContent.ts    # Query hook
src/routes/admin/website-content/index.tsx      # Overview page
src/routes/admin/website-content/homepage.tsx   # Homepage editor
src/routes/admin/website-content/about.tsx    # About editor
src/routes/admin/website-content/contact.tsx  # Contact editor
src/routes/admin/website-content/footer.tsx   # Footer editor
```

**Files to Modify:**

```
src/lib/index.ts                  # Add website-content export
```

---

### Task 1.6: Admin Navigation Overhaul

**Files to Create:**

```
src/components/admin/AdminSidebar.tsx      # Full sidebar navigation
src/components/admin/AdminMobileNav.tsx    # Bottom tab bar
src/components/admin/AdminHeader.tsx       # Top bar with search
```

**Files to Modify:**

```
src/routes/admin/route.tsx        # Replace current layout with sidebar
```

---

## SPRINT 2: CONTENT (Week 3-4)

### Task 2.1: Enhanced Artwork Management

**Files to Modify:**

```
src/lib/artworks.ts               # Add gallery/process image methods
src/components/ArtworkForm.tsx    # Add multi-image upload, media picker
src/components/admin/MultiImageUploader.tsx  # Already created in Sprint 1
```

### Task 2.2: FAQ Management (Admin UI)

**Files to Create:**

```
src/routes/admin/faqs/index.tsx   # FAQ list
src/routes/admin/faqs/new.tsx     # New FAQ
src/routes/admin/faqs/edit.$id.tsx # Edit FAQ
src/routes/admin/faqs/sections.tsx # FAQ sections
```

### Task 2.3: Page Section Manager

**Files to Create:**

```
src/lib/page-sections.ts          # Data layer
src/hooks/usePageSections.ts      # Query hook
src/routes/admin/pages/index.tsx  # Page list
src/routes/admin/pages/$pageId.tsx # Page editor
src/components/admin/SectionBuilder.tsx # Section builder UI
```

### Task 2.4: SEO Center

**Files to Create:**

```
src/routes/admin/seo/index.tsx    # SEO dashboard
src/routes/admin/seo/pages.tsx    # Page SEO list
src/routes/admin/seo/artworks.tsx # Artwork SEO bulk editor
src/routes/admin/seo/categories.tsx # Category SEO bulk editor
src/routes/admin/seo/redirects.tsx # Redirect manager
src/components/admin/SeoScore.tsx # SEO health score
```

---

## SPRINT 3: BUSINESS (Week 5-6)

### Task 3.1: Lead Center (CRM)

**Files to Create:**

```
src/lib/leads.ts                  # Data layer
src/hooks/useLeadPipeline.ts      # Query hook
src/routes/admin/leads/index.tsx  # Lead list (table)
src/routes/admin/leads/pipeline.tsx # Kanban pipeline
src/routes/admin/leads/$id.tsx   # Lead detail
src/routes/admin/leads/new.tsx    # New lead
src/components/admin/LeadPipeline.tsx # Kanban board
src/components/admin/LeadCard.tsx # Lead card
```

### Task 3.2: WhatsApp Conversion Center

**Files to Create:**

```
src/lib/whatsapp-clicks.ts        # Data layer
src/hooks/useWhatsappAnalytics.ts # Query hook
src/routes/admin/whatsapp/index.tsx       # WhatsApp settings
src/routes/admin/whatsapp/analytics.tsx     # Analytics dashboard
src/routes/admin/whatsapp/templates.tsx     # Message templates
```

### Task 3.3: Enhanced Dashboard

**Files to Create:**

```
src/lib/dashboard-metrics.ts      # Data layer
src/hooks/useDashboardMetrics.ts  # Query hook
src/components/admin/KpiCard.tsx  # KPI card
src/components/admin/ActivityFeed.tsx # Activity feed
src/components/admin/ChartWidget.tsx # Reusable chart
```

**Files to Modify:**

```
src/routes/admin/index.tsx        # Replace with full dashboard
```

### Task 3.4: Settings

**Files to Create:**

```
src/routes/admin/settings/index.tsx # General settings
```

---

## SPRINT 4: POLISH (Week 7-8)

### Task 4.1: Content Seeding

**Migration:** `supabase/migrations/20250707_seed_default_content.sql`

- Seed predefined visual assets (overlays, textures)
- Seed default website content (homepage, about, contact, footer)
- Seed default pages and sections
- Seed FAQ sections

### Task 4.2: Public Page Integration

**Files to Modify:**

```
src/routes/index.tsx              # Replace hardcoded content with CMS data
src/routes/about.tsx              # Replace hardcoded content with CMS data
src/routes/contact.tsx            # Replace hardcoded content with CMS data
src/components/Header.tsx         # Use CMS for logo, nav
src/components/Footer.tsx         # Use CMS for footer content
```

---

## EXACT FILE CREATION CHECKLIST

### Data Layer (lib/*.ts)

| # | File | Status |
|---|---|---|
| 1 | `src/lib/media-library.ts` | 🔴 CREATE |
| 2 | `src/lib/visual-assets.ts` | 🔴 CREATE |
| 3 | `src/lib/website-content.ts` | 🔴 CREATE |
| 4 | `src/lib/page-sections.ts` | 🟡 CREATE |
| 5 | `src/lib/leads.ts` | 🟢 CREATE |
| 6 | `src/lib/whatsapp-clicks.ts` | 🟢 CREATE |
| 7 | `src/lib/dashboard-metrics.ts` | 🟢 CREATE |

### Hooks (hooks/*.ts)

| # | File | Status |
|---|---|---|
| 1 | `src/hooks/useMediaLibrary.ts` | 🔴 CREATE |
| 2 | `src/hooks/useVisualAssets.ts` | 🔴 CREATE |
| 3 | `src/hooks/useWebsiteContent.ts` | 🔴 CREATE |
| 4 | `src/hooks/usePageSections.ts` | 🟡 CREATE |
| 5 | `src/hooks/useLeadPipeline.ts` | 🟢 CREATE |
| 6 | `src/hooks/useWhatsappAnalytics.ts` | 🟢 CREATE |
| 7 | `src/hooks/useDashboardMetrics.ts` | 🟢 CREATE |

### Admin Components (components/admin/*.tsx)

| # | File | Status |
|---|---|---|
| 1 | `src/components/admin/AdminSidebar.tsx` | 🔴 CREATE |
| 2 | `src/components/admin/AdminMobileNav.tsx` | 🔴 CREATE |
| 3 | `src/components/admin/AdminHeader.tsx` | 🔴 CREATE |
| 4 | `src/components/admin/MediaPicker.tsx` | 🔴 CREATE |
| 5 | `src/components/admin/MultiImageUploader.tsx` | 🔴 CREATE |
| 6 | `src/components/admin/CategoryCard.tsx` | 🔴 CREATE |
| 7 | `src/components/admin/DataTable.tsx` | 🟡 CREATE |
| 8 | `src/components/admin/StatusBadge.tsx` | 🟡 CREATE |
| 9 | `src/components/admin/RichTextEditor.tsx` | 🟡 CREATE |
| 10 | `src/components/admin/LeadPipeline.tsx` | 🟢 CREATE |
| 11 | `src/components/admin/LeadCard.tsx` | 🟢 CREATE |
| 12 | `src/components/admin/SectionBuilder.tsx` | 🟡 CREATE |
| 13 | `src/components/admin/SeoScore.tsx` | 🟡 CREATE |
| 14 | `src/components/admin/ChartWidget.tsx` | 🟢 CREATE |
| 15 | `src/components/admin/KpiCard.tsx` | 🟢 CREATE |
| 16 | `src/components/admin/ActivityFeed.tsx` | 🟢 CREATE |

### Admin Routes (routes/admin/**/*.tsx)

| # | Route | File | Status |
|---|---|---|---|
| 1 | `/admin/categories` | `src/routes/admin/categories/index.tsx` | 🔴 CREATE |
| 2 | `/admin/categories/edit/$id` | `src/routes/admin/categories/edit.$id.tsx` | 🔴 CREATE |
| 3 | `/admin/media` | `src/routes/admin/media/index.tsx` | 🔴 CREATE |
| 4 | `/admin/media/$id` | `src/routes/admin/media/$id.tsx` | 🔴 CREATE |
| 5 | `/admin/visual-assets` | `src/routes/admin/visual-assets/index.tsx` | 🔴 CREATE |
| 6 | `/admin/visual-assets/edit/$id` | `src/routes/admin/visual-assets/edit.$id.tsx` | 🔴 CREATE |
| 7 | `/admin/website-content` | `src/routes/admin/website-content/index.tsx` | 🔴 CREATE |
| 8 | `/admin/website-content/homepage` | `src/routes/admin/website-content/homepage.tsx` | 🔴 CREATE |
| 9 | `/admin/website-content/about` | `src/routes/admin/website-content/about.tsx` | 🔴 CREATE |
| 10 | `/admin/website-content/contact` | `src/routes/admin/website-content/contact.tsx` | 🔴 CREATE |
| 11 | `/admin/website-content/footer` | `src/routes/admin/website-content/footer.tsx` | 🔴 CREATE |
| 12 | `/admin/faqs` | `src/routes/admin/faqs/index.tsx` | 🟡 CREATE |
| 13 | `/admin/faqs/new` | `src/routes/admin/faqs/new.tsx` | 🟡 CREATE |
| 14 | `/admin/faqs/edit/$id` | `src/routes/admin/faqs/edit.$id.tsx` | 🟡 CREATE |
| 15 | `/admin/faqs/sections` | `src/routes/admin/faqs/sections.tsx` | 🟡 CREATE |
| 16 | `/admin/seo` | `src/routes/admin/seo/index.tsx` | 🟡 CREATE |
| 17 | `/admin/seo/pages` | `src/routes/admin/seo/pages.tsx` | 🟡 CREATE |
| 18 | `/admin/seo/artworks` | `src/routes/admin/seo/artworks.tsx` | 🟡 CREATE |
| 19 | `/admin/seo/categories` | `src/routes/admin/seo/categories.tsx` | 🟡 CREATE |
| 20 | `/admin/seo/redirects` | `src/routes/admin/seo/redirects.tsx` | 🟡 CREATE |
| 21 | `/admin/leads` | `src/routes/admin/leads/index.tsx` | 🟢 CREATE |
| 22 | `/admin/leads/pipeline` | `src/routes/admin/leads/pipeline.tsx` | 🟢 CREATE |
| 23 | `/admin/leads/$id` | `src/routes/admin/leads/$id.tsx` | 🟢 CREATE |
| 24 | `/admin/leads/new` | `src/routes/admin/leads/new.tsx` | 🟢 CREATE |
| 25 | `/admin/whatsapp` | `src/routes/admin/whatsapp/index.tsx` | 🟢 CREATE |
| 26 | `/admin/whatsapp/analytics` | `src/routes/admin/whatsapp/analytics.tsx` | 🟢 CREATE |
| 27 | `/admin/whatsapp/templates` | `src/routes/admin/whatsapp/templates.tsx` | 🟢 CREATE |
| 28 | `/admin/pages` | `src/routes/admin/pages/index.tsx` | 🟡 CREATE |
| 29 | `/admin/pages/$pageId` | `src/routes/admin/pages/$pageId.tsx` | 🟡 CREATE |
| 30 | `/admin/settings` | `src/routes/admin/settings/index.tsx` | 🟢 CREATE |

### Files to Modify (Existing)

| # | File | Changes |
|---|---|---|
| 1 | `src/lib/index.ts` | Add exports for new lib modules |
| 2 | `src/lib/storage.ts` | Add media library upload helper |
| 3 | `src/lib/artworks.ts` | Add gallery/process image methods |
| 4 | `src/lib/categories.ts` | Add visual asset methods |
| 5 | `src/lib/faqs.ts` | Add section support |
| 6 | `src/lib/seo.ts` | Add health score, page inventory methods |
| 7 | `src/routes/admin/route.tsx` | Replace layout with sidebar + header |
| 8 | `src/routes/admin/index.tsx` | Replace with full dashboard |
| 9 | `src/integrations/supabase/types.ts` | Regenerate with new tables |
| 10 | `src/components/ArtworkForm.tsx` | Add media picker for gallery/process images |
| 11 | `src/routes/index.tsx` | Use CMS data instead of hardcoded |
| 12 | `src/routes/about.tsx` | Use CMS data instead of hardcoded |
| 13 | `src/routes/contact.tsx` | Use CMS data instead of hardcoded |
| 14 | `src/components/Header.tsx` | Use CMS for logo |
| 15 | `src/components/Footer.tsx` | Use CMS for footer content |

---

## SUPABASE MIGRATION FILES

| # | File | Content |
|---|---|---|
| 1 | `supabase/migrations/20250707_phase1_foundation.sql` | Extensions + core tables + indexes + RLS |
| 2 | `supabase/migrations/20250707_phase1_content.sql` | Supporting tables (gallery, faq_sections, pages, sections) |
| 3 | `supabase/migrations/20250707_phase1_business.sql` | Leads, WhatsApp, dashboard tables |
| 4 | `supabase/migrations/20250707_seed_visual_assets.sql` | Predefined overlays and textures |
| 5 | `supabase/migrations/20250707_seed_website_content.sql` | Default homepage, about, contact, footer content |

---

## IMPLEMENTATION START ORDER

We begin immediately with **Sprint 1: Foundation** in this priority order:

1. **Database Migration** (`20250707_phase1_foundation.sql`) — Run first, everything depends on it
2. **Media Library** (`src/lib/media-library.ts`, `src/routes/admin/media/index.tsx`) — All images go through here
3. **Visual Asset Manager** (`src/lib/visual-assets.ts`, `src/routes/admin/visual-assets/index.tsx`) — Category overlays
4. **Category Visual System** (`src/routes/admin/categories/edit.$id.tsx`) — Connect categories to media + visual assets
5. **Website Content Manager** (`src/lib/website-content.ts`, `src/routes/admin/website-content/homepage.tsx`) — Eliminate hardcoded text
6. **Admin Navigation** (`src/components/admin/AdminSidebar.tsx`) — Navigate all new modules

Then proceed to Sprint 2, 3, 4 in order.

---

**Document Version:** 1.0  
**Date:** 2025-07-07  
**Status:** Ready for Implementation
