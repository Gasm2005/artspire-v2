# Artspire V2 — Phase 1 Implementation Architecture

## Production-Ready CMS for Non-Technical Business Owners

**Version:** 1.0  
**Date:** 2025-06-24  
**Status:** Implementation Architecture Document

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Module 1: Dashboard](#module-1-dashboard)
3. [Module 2: Artwork Management](#module-2-artwork-management)
4. [Module 3: Category Management](#module-3-category-management)
5. [Module 4: Universal Media Library](#module-4-universal-media-library)
6. [Module 5: Visual Asset Manager](#module-5-visual-asset-manager)
7. [Module 6: Website Content Manager](#module-6-website-content-manager)
8. [Module 7: FAQ Management](#module-7-faq-management)
9. [Module 8: SEO Center](#module-8-seo-center)
10. [Module 9: Lead Center](#module-9-lead-center)
11. [Module 10: WhatsApp Conversion Center](#module-10-whatsapp-conversion-center)
12. [Module 11: Page Section Manager](#module-11-page-section-manager)
13. [Module 12: Database Architecture](#module-12-database-architecture)
14. [Module 13: Admin Navigation](#module-13-admin-navigation)
15. [Implementation Priority Order](#implementation-priority-order)
16. [TanStack Start Folder Structure](#tanstack-start-folder-structure)
17. [Supabase Migration Plan](#supabase-migration-plan)
18. [API Design](#api-design)
19. [Production Rollout Plan](#production-rollout-plan)

---

## Executive Summary

### Phase 1 Objective

Make the entire Artspire website **content-managed** through a professional admin dashboard. The business owner should be able to manage **95% of website content** without developer involvement.

### What's Already Built

- TanStack Start + React 19 + Tailwind v4 + Vite 7
- Supabase integration (client, auth, types)
- Mobile/desktop responsive layout
- Admin login + dashboard (stats cards)
- Artwork CRUD (create, edit, list)
- Dynamic artwork route (`/artwork/$slug`) with SEO
- Image upload via Supabase Storage
- `artwork-images` bucket
- Vercel deployment + post-build script

### What's New in Phase 1

13 modules that transform the website from a static showcase into a CMS-driven platform:

| Module                  | Purpose             | Business Owner Can                             |
| ----------------------- | ------------------- | ---------------------------------------------- |
| Dashboard               | Business overview   | See KPIs, trends, recent activity              |
| Artwork Management      | Portfolio CRUD      | Add, edit, publish, delete artworks            |
| Category Management     | Category CRUD       | Add categories, replace images, set SEO        |
| Media Library           | Centralized assets  | Upload, tag, search, track usage               |
| Visual Asset Manager    | Website visuals     | Replace overlays, backgrounds, graphics        |
| Website Content Manager | Static content      | Edit homepage, about, contact, footer text     |
| FAQ Management          | Q&A                 | Add, edit, reorder FAQs per page               |
| SEO Center              | Search optimization | Edit meta tags, schema, canonical URLs         |
| Lead Center             | CRM                 | View leads, update status, add notes           |
| WhatsApp Center         | Conversion tracking | Manage CTAs, track clicks, view analytics      |
| Page Section Manager    | Page building       | Enable/disable sections, reorder, edit content |
| Database                | Data architecture   | (Schema is production-ready)                   |
| Admin Navigation        | Navigation          | Navigate all modules from sidebar              |

### Visual Asset Architecture (Critical)

**Rule: Real artwork is the hero. Decorative elements support it.**

```
Category Card Layer Stack (from bottom to top):

Layer 1: Real Artwork Image (80% visual weight)
  → Full-bleed background
  → object-fit: cover
  → High resolution
  → Photographed/scanned artwork

Layer 2: Decorative Overlay (10% visual weight)
  → brush-strokes.png
  → paint-swash.png
  → paper-grain.png
  → graphite-texture.png
  → gold-accents.png
  → canvas-texture.png
  → glass-reflections.png
  → clay-texture.png
  → dot-grid.png
  → shadow-overlay.png
  → opacity: 0.15 - 0.4

Layer 3: Gradient Overlay (5% visual weight)
  → linear-gradient from bottom (dark) to transparent
  → ensures text readability
  → subtle, not overpowering

Layer 4: Category Text (5% visual weight)
  → font-display
  → white or light cream
  → positioned bottom-left or centered
  → never on bare background
```

**Hard Rule:** No category card may display without a real artwork image. Decorative-only cards are prohibited.

---

## Module 1: Dashboard

### Purpose

Provide a real-time business overview for the owner. One screen to understand the health of the entire business.

### Admin Screens

| Screen    | Route    | Description                      |
| --------- | -------- | -------------------------------- |
| Dashboard | `/admin` | KPI cards, charts, activity feed |

### KPI Cards (Top Row)

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Total       │  │ Total       │  │ Total       │  │ Total       │
│ Artworks    │  │ Categories  │  │ FAQs        │  │ Leads       │
│ 47          │  │ 6           │  │ 23          │  │ 128         │
│ ↑ 12%       │  │ —           │  │ ↑ 4         │  │ ↑ 8         │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘

┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ WhatsApp    │  │ Published   │  │ Featured    │  │ Avg. Order  │
│ Clicks      │  │ Artworks    │  │ Artworks    │  │ Value       │
│ 342         │  │ 38          │  │ 12          │  │ ₹4,250      │
│ ↑ 23%       │  │ —           │  │ —           │  │ ↑ 15%       │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

### Charts

| Chart             | Data Source                     | Purpose                         |
| ----------------- | ------------------------------- | ------------------------------- |
| Traffic Over Time | `analytics_events`              | See if marketing is working     |
| Lead Funnel       | `leads` + `lead_activities`     | Identify conversion bottlenecks |
| Top Categories    | `artworks` + `analytics_events` | Know what's popular             |
| Recent Inquiries  | `leads`                         | Immediate action items          |
| Artwork Status    | `artworks`                      | Content pipeline health         |

### Activity Feed

```
Recent Activity
─────────────────────────
🎨 Artwork "Sunset Portrait" published
   2 hours ago by Admin

📥 New lead: Priya Sharma (+91 98765...)
   "Interested in wedding pencil sketch"
   3 hours ago

🏷️ Category "Mirror Art" updated
   Banner image replaced
   5 hours ago

❓ FAQ "How long does delivery take?" added
   1 day ago

📱 WhatsApp CTA clicked 42 times today
   ↑ 18% from yesterday
```

### Database Requirements

```sql
-- dashboard_metrics (materialized view for fast loading)
CREATE TABLE dashboard_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value integer DEFAULT 0,
  metric_value_numeric numeric(12,2),
  metric_period text CHECK (metric_period IN ('today', 'week', 'month', 'quarter', 'year')),
  change_value integer DEFAULT 0,
  change_percent numeric(5,2),
  trend text CHECK (trend IN ('up', 'down', 'flat')),
  calculated_at timestamptz DEFAULT now()
);

-- dashboard_activity_feed
CREATE TABLE dashboard_activity_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type text NOT NULL CHECK (activity_type IN ('artwork_created', 'artwork_published', 'artwork_updated', 'artwork_deleted', 'category_updated', 'faq_created', 'faq_updated', 'lead_created', 'lead_status_changed', 'whatsapp_click', 'seo_updated', 'media_uploaded', 'content_updated')),
  title text NOT NULL,
  description text,
  entity_type text, -- "artwork", "category", "lead", "faq"
  entity_id uuid,
  entity_slug text, -- for linking
  performed_by uuid REFERENCES profiles(id),
  performed_at timestamptz DEFAULT now()
);
```

### API Design

```ts
// GET /api/admin/dashboard
interface DashboardData {
  kpis: KPICard[];
  charts: ChartData[];
  recentActivity: ActivityItem[];
  recentInquiries: Lead[];
  recentArtworks: Artwork[];
}

// GET /api/admin/dashboard/metrics
interface MetricsResponse {
  totalArtworks: number;
  totalCategories: number;
  totalFaqs: number;
  totalLeads: number;
  totalWhatsappClicks: number;
  publishedArtworks: number;
  featuredArtworks: number;
  avgOrderValue: number;
}
```

---

## Module 2: Artwork Management

### Purpose

The core product module. Business owner manages the entire portfolio — create, edit, publish, duplicate, delete artworks.

### Admin Screens

| Screen         | Route                      | Description             |
| -------------- | -------------------------- | ----------------------- |
| Artwork List   | `/admin/artworks`          | Table/grid with filters |
| New Artwork    | `/admin/artworks/new`      | Create form             |
| Edit Artwork   | `/admin/artworks/edit/$id` | Edit form with preview  |
| Artwork Detail | `/admin/artworks/$id`      | Read-only detail view   |

### Artwork Form Fields

#### Basic Information

| Field            | Type   | Required | Notes                               |
| ---------------- | ------ | -------- | ----------------------------------- |
| Title            | text   | ✅       | Max 100 chars                       |
| Slug             | text   | ✅       | Auto-generated from title, editable |
| Category         | select | ✅       | Dropdown from `categories` table    |
| Status           | select | ✅       | `draft`, `published`, `archived`    |
| Featured         | toggle | ❌       | Show on homepage                    |
| Show on Homepage | toggle | ❌       | Dedicated homepage slot             |
| Display Order    | number | ❌       | Lower = first                       |

#### Descriptions

| Field             | Type            | Required | Notes                                  |
| ----------------- | --------------- | -------- | -------------------------------------- |
| Short Description | textarea        | ❌       | 1-2 sentences, shown in cards          |
| Description       | textarea        | ❌       | Full description, shown on detail page |
| Story Content     | textarea (rich) | ❌       | The artist's story behind the piece    |

#### Pricing & Delivery

| Field         | Type   | Required | Notes                               |
| ------------- | ------ | -------- | ----------------------------------- |
| Price         | number | ❌       | INR, shown on artwork page          |
| Currency      | select | ❌       | Default: INR                        |
| Dimensions    | text   | ❌       | e.g. "12x16 inches"                 |
| Delivery Time | text   | ❌       | e.g. "5-7 days"                     |
| Materials     | text   | ❌       | e.g. "Pencil, charcoal on paper"    |
| Artwork Type  | select | ❌       | `physical`, `digital`, `commission` |

#### Images

| Field           | Type         | Required | Notes                        |
| --------------- | ------------ | -------- | ---------------------------- |
| Main Image      | image upload | ✅       | Hero image, 1200x800 min     |
| Thumbnail Image | image upload | ❌       | Auto-generated if not set    |
| Gallery Images  | multi-upload | ❌       | Up to 10 images              |
| Before Image    | image upload | ❌       | For before/after showcase    |
| After Image     | image upload | ❌       | For before/after showcase    |
| Process Images  | multi-upload | ❌       | Step-by-step creation photos |
| Alt Text        | text         | ❌       | Accessibility + SEO          |
| Image Caption   | text         | ❌       | Shown under image            |

#### Tags & SEO

| Field            | Type         | Required | Notes                                |
| ---------------- | ------------ | -------- | ------------------------------------ |
| Tags             | multi-select | ❌       | Predefined + custom tags             |
| Mood             | multi-select | ❌       | Romantic, Vibrant, Minimal, etc.     |
| Occasion         | multi-select | ❌       | Wedding, Birthday, Anniversary, etc. |
| Meta Title       | text         | ❌       | Auto-generated from title            |
| Meta Description | textarea     | ❌       | Auto-generated from description      |
| Canonical URL    | text         | ❌       | Auto-generated from slug             |
| OG Image         | image upload | ❌       | Social sharing image                 |

#### Actions

| Action     | Description                       |
| ---------- | --------------------------------- |
| Save Draft | Save without publishing           |
| Publish    | Make live immediately             |
| Schedule   | Set future publish date           |
| Duplicate  | Clone with new slug               |
| Preview    | Open `/artwork/[slug]` in new tab |
| Archive    | Hide but keep data                |
| Delete     | Permanent removal (with warning)  |

### Artwork List View

```
┌──────────────────────────────────────────────────────────────────────┐
│ Artworks                                        [+ New Artwork]    │
├──────────────────────────────────────────────────────────────────────┤
│ [All ▼] [Status: All ▼] [Category: All ▼]    [Search... 🔍]       │
├──────────────────────────────────────────────────────────────────────┤
│ Image | Title              | Category       | Status   | Price | Actions│
├──────┼─────────────────────┼────────────────┼──────────┼───────┼────────┤
│  🖼️  │ Sunset Portrait     │ Colour Portraits│ Published│ ₹3,500│ ⚙️    │
│  🖼️  │ Family Pencil Sketch│ Pencil Sketches │ Published│ ₹2,500│ ⚙️    │
│  🖼️  | Mirror Art Nameplate│ Mirror Art      │ Draft    │ —     │ ⚙️    │
│  🖼️  │ Clay Ganesha Idol   │ Clay Art        │ Published│ ₹1,800│ ⚙️    │
└──────┴─────────────────────┴────────────────┴──────────┴───────┴────────┘

Filters: All / Published / Drafts / Archived / Featured / Homepage
Search: Full-text search across title, description, tags
Bulk Actions: Select multiple → Publish / Archive / Delete
```

### Database Schema (Extends Existing)

```sql
-- artworks (already exists - extend with Phase 1 fields)
-- Note: existing table has 35 columns. Add these Phase 1 fields:

ALTER TABLE artworks ADD COLUMN IF NOT EXISTS
  -- Basic
  display_order integer DEFAULT 0,

  -- Descriptions
  short_description text, -- for cards/listings

  -- Pricing & Delivery
  currency text DEFAULT 'INR',
  dimensions text,
  delivery_time text,
  materials text,

  -- Artwork Type
  artwork_type text DEFAULT 'physical' CHECK (artwork_type IN ('physical', 'digital', 'commission')),

  -- AI/SEO
  ai_generated_description text,
  ai_keywords text[],

  -- Media (linked to media_library)
  main_image_id uuid REFERENCES media_library(id),
  thumbnail_image_id uuid REFERENCES media_library(id),
  before_image_id uuid REFERENCES media_library(id),
  after_image_id uuid REFERENCES media_library(id),

  -- Publishing
  scheduled_publish_at timestamptz,

  -- Tracking
  view_count integer DEFAULT 0,
  inquiry_count integer DEFAULT 0,

  -- Audit
  created_by uuid REFERENCES profiles(id),
  updated_by uuid REFERENCES profiles(id);

-- artwork_gallery_images (junction for multiple images)
CREATE TABLE artwork_gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id uuid REFERENCES artworks(id) ON DELETE CASCADE,
  media_id uuid REFERENCES media_library(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  caption text,
  alt_text text,
  created_at timestamptz DEFAULT now()
);

-- artwork_process_images (step-by-step creation photos)
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

-- artwork_tags (extends existing junction)
-- Already exists: artwork_tags (artwork_id, tag_id)
-- Add display_order for tag ordering
ALTER TABLE artwork_tags ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;
```

---

## Module 3: Category Management

### Purpose

Manage the 6 artwork categories (and future categories). The visual system is **critical** — real artwork must be the hero.

### Admin Screens

| Screen        | Route                        | Description            |
| ------------- | ---------------------------- | ---------------------- |
| Category List | `/admin/categories`          | Grid of category cards |
| Edit Category | `/admin/categories/edit/$id` | Full edit form         |

### Category Form Fields

#### Basic Information

| Field         | Type     | Required | Notes                              |
| ------------- | -------- | -------- | ---------------------------------- |
| Name          | text     | ✅       | e.g. "Pencil Sketches"             |
| Slug          | text     | ✅       | Auto-generated: `pencil-sketches`  |
| Description   | textarea | ❌       | Long description for category page |
| Short Summary | textarea | ❌       | 1-2 sentences for cards            |
| Status        | select   | ✅       | `draft`, `published`, `archived`   |
| Display Order | number   | ❌       | Lower = first                      |
| Featured      | toggle   | ❌       | Show on homepage                   |

#### Visual Assets (CRITICAL)

| Field                     | Type         | Required | Notes                                    |
| ------------------------- | ------------ | -------- | ---------------------------------------- |
| Card Artwork Image        | image upload | ✅       | **Real artwork photo** — the hero        |
| Card Decorative Overlay   | select       | ❌       | Brush strokes, graphite, paint, etc.     |
| Overlay Opacity           | slider       | ❌       | 0-100%, default 25%                      |
| Card Gradient Style       | select       | ❌       | `bottom-dark`, `center-vignette`, `none` |
| Card Text Position        | select       | ❌       | `bottom-left`, `bottom-center`, `center` |
| Banner Artwork Image      | image upload | ❌       | For category page hero                   |
| Banner Decorative Overlay | select       | ❌       | Same overlay options                     |
| Gallery Images            | multi-upload | ❌       | Category page gallery                    |
| Thumbnail Image           | image upload | ❌       | For listings                             |

#### Overlay Options

```sql
-- visual_asset_overlays (predefined overlay options)
CREATE TABLE visual_asset_overlays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, -- "Brush Strokes", "Graphite Texture", "Paint Swash"
  slug text UNIQUE NOT NULL, -- "brush-strokes", "graphite-texture"
  asset_type text DEFAULT 'overlay' CHECK (asset_type IN ('overlay', 'texture', 'pattern', 'accent')),
  preview_url text, -- thumbnail preview
  storage_path text NOT NULL, -- Supabase Storage path
  category_suggestions text[], -- ["pencil-sketches", "colour-portraits"]
  default_opacity integer DEFAULT 25, -- 0-100
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

#### SEO

| Field            | Type         | Required | Notes                     |
| ---------------- | ------------ | -------- | ------------------------- | -------------- | --------- |
| Meta Title       | text         | ❌       | Default: "[Category Name] | Custom Artwork | Artspire" |
| Meta Description | textarea     | ❌       | Default from description  |
| Canonical URL    | text         | ❌       | Auto: `/category/[slug]`  |
| OG Image         | image upload | ❌       | Social sharing            |

#### FAQs (Category-Specific)

| Field         | Type     | Required | Notes                   |
| ------------- | -------- | -------- | ----------------------- |
| Category FAQs | repeater | ❌       | Question + Answer pairs |

### Category Card Visual System (Enforced)

```css
/* Category Card CSS (enforced by component) */
.category-card {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
  border-radius: 16px;
}

/* Layer 1: Real Artwork Image */
.category-card__artwork {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

/* Layer 2: Decorative Overlay */
.category-card__overlay {
  position: absolute;
  inset: 0;
  background-image: var(--overlay-url);
  background-size: cover;
  background-position: center;
  opacity: var(--overlay-opacity, 0.25);
  mix-blend-mode: multiply;
  z-index: 2;
}

/* Layer 3: Gradient Overlay */
.category-card__gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 40%,
    transparent 70%
  );
  z-index: 3;
}

/* Layer 4: Text */
.category-card__text {
  position: absolute;
  bottom: 24px;
  left: 24px;
  z-index: 4;
  color: white;
}
```

**Validation Rule:** If `card_artwork_image_id` is null, the card **cannot be published**. The UI shows a warning: "Category card requires a real artwork image. Decorative-only cards are not allowed."

### Database Schema

```sql
-- categories (already exists - extend)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS
  -- Basic
  short_summary text,
  display_order integer DEFAULT 0,
  featured boolean DEFAULT false,

  -- Visual System
  card_artwork_image_id uuid REFERENCES media_library(id),
  card_overlay_id uuid REFERENCES visual_asset_overlays(id),
  card_overlay_opacity integer DEFAULT 25 CHECK (card_overlay_opacity BETWEEN 0 AND 100),
  card_gradient_style text DEFAULT 'bottom-dark' CHECK (card_gradient_style IN ('bottom-dark', 'center-vignette', 'none')),
  card_text_position text DEFAULT 'bottom-left' CHECK (card_text_position IN ('bottom-left', 'bottom-center', 'center')),
  banner_artwork_image_id uuid REFERENCES media_library(id),
  banner_overlay_id uuid REFERENCES visual_asset_overlays(id),
  thumbnail_image_id uuid REFERENCES media_library(id),

  -- SEO
  meta_title text,
  meta_description text,
  og_image_id uuid REFERENCES media_library(id),

  -- Audit
  created_by uuid REFERENCES profiles(id),
  updated_by uuid REFERENCES profiles(id);

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

-- category_faqs (junction for category-specific FAQs)
CREATE TABLE category_faqs (
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  faq_id uuid REFERENCES faqs(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  PRIMARY KEY (category_id, faq_id)
);
```

---

## Module 4: Universal Media Library

### Purpose

Centralized asset management for ALL images across the website. One place to upload, tag, search, and track usage.

### Admin Screens

| Screen        | Route              | Description                            |
| ------------- | ------------------ | -------------------------------------- |
| Media Library | `/admin/media`     | Grid with filters, search, upload      |
| Media Detail  | `/admin/media/$id` | Full metadata, usage tracking, replace |

### Features

#### Upload

- Drag-and-drop upload
- Bulk upload (up to 20 files at once)
- Auto-generate WebP variants
- Auto-extract dominant colors
- Auto-generate alt text via AI (future)

#### Organization

- **Tags:** Free-form tags (e.g. "hero", "pencil", "wedding")
- **Folders:** Logical grouping (e.g. "Homepage", "Categories", "Artworks")
- **Starred:** Favorite/quick-access images
- **Recently Used:** Last 30 days

#### Search & Filter

```
Search: [__________________________] 🔍

Filters:
[Type: All ▼]  [Tag: All ▼]  [Usage: All ▼]  [Date: All ▼]

Types: Image, Banner, Thumbnail, Gallery, Icon
Tags: Hero, Category, Artwork, Testimonial, Process
Usage: Used, Unused, Used 3+ times
Date: Today, Week, Month, Year, All Time
```

#### Usage Tracking (CRITICAL)

Every image shows exactly where it's used:

```
Image: "sunset-portrait-main.jpg"
─────────────────────────────────
Used In:
  🎨 Artwork: Sunset Portrait (Primary Image)
  🏠 Homepage: Featured Section (Slot 3)
  📱 WhatsApp: OG Image for sharing

⚠️ Warning: This image is used in 3 places.
    Replacing it will affect all 3 locations.

[Replace] [Delete] [Download] [Copy URL]
```

**Delete Prevention:** If an image is used anywhere, the delete button shows a warning with a list of all usages. The user must confirm twice.

### Database Schema

```sql
-- media_library (already partially designed - complete it)
CREATE TABLE media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- File Info
  filename text NOT NULL,
  original_name text NOT NULL, -- original upload filename
  storage_path text NOT NULL, -- Supabase Storage path
  public_url text NOT NULL,

  -- Dimensions
  width integer,
  height integer,
  aspect_ratio numeric(5,2),
  file_size integer, -- bytes
  mime_type text,

  -- Variants
  variants jsonb DEFAULT '{}', -- {"thumbnail": "url", "medium": "url", "webp": "url"}

  -- Metadata
  alt_text text,
  title text,
  description text,
  caption text,
  tags text[],
  folder text DEFAULT 'uncategorized', -- "homepage", "categories", "artworks", "testimonials"

  -- AI (future)
  ai_generated_alt text,
  ai_generated_tags text[],
  dominant_colors jsonb,

  -- Usage Tracking
  usage_count integer DEFAULT 0,
  used_in jsonb DEFAULT '[]', -- [{"entity_type": "artwork", "entity_id": "uuid", "usage_type": "primary"}]

  -- Upload Info
  uploaded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- media_usage_log (detailed usage tracking)
CREATE TABLE media_usage_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid REFERENCES media_library(id) ON DELETE CASCADE,
  entity_type text NOT NULL, -- "artwork", "category", "homepage", "testimonial"
  entity_id uuid NOT NULL,
  usage_type text NOT NULL, -- "primary", "gallery", "thumbnail", "banner", "og_image"
  created_at timestamptz DEFAULT now()
);
```

### API Design

```ts
// GET /api/admin/media
interface MediaListParams {
  search?: string;
  type?: "image" | "banner" | "thumbnail" | "gallery" | "icon";
  tag?: string;
  folder?: string;
  usage?: "used" | "unused" | "any";
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// POST /api/admin/media/upload
interface MediaUploadRequest {
  file: File;
  altText?: string;
  title?: string;
  tags?: string[];
  folder?: string;
}

// GET /api/admin/media/:id/usage
interface MediaUsageResponse {
  mediaId: string;
  usageCount: number;
  usages: {
    entityType: string;
    entityId: string;
    entityName: string;
    entitySlug: string;
    usageType: string;
  }[];
}
```

---

## Module 5: Visual Asset Manager

### Purpose

Manage **non-photographic** visual assets — overlays, textures, patterns, backgrounds, decorative graphics. Separate from the Media Library (which is for photographs/artwork).

### Admin Screens

| Screen        | Route                      | Description               |
| ------------- | -------------------------- | ------------------------- |
| Visual Assets | `/admin/visual-assets`     | Grid of all visual assets |
| Asset Detail  | `/admin/visual-assets/$id` | Preview, usage, replace   |

### Asset Types

| Type         | Description                       | Examples                                   |
| ------------ | --------------------------------- | ------------------------------------------ |
| `overlay`    | Semi-transparent decorative layer | Brush strokes, paint swashes, gold accents |
| `texture`    | Background texture                | Paper grain, canvas texture, graphite      |
| `pattern`    | Repeating pattern                 | Dot grid, watercolor dots, lines           |
| `gradient`   | CSS gradient preset               | Bottom dark, vignette, soft fade           |
| `icon`       | UI icon                           | Category icons, UI elements                |
| `background` | Full background image             | Hero backgrounds, section backgrounds      |
| `decorative` | Decorative element                | Borders, frames, corner accents            |

### Form Fields

| Field                | Type          | Required              |
| -------------------- | ------------- | --------------------- | ------------------------------------- |
| Asset Name           | text          | ✅                    |
| Asset Type           | select        | ✅                    |
| Preview              | image display | ✅ (auto from upload) |
| File                 | image upload  | ✅                    |
| Description          | textarea      | ❌                    |
| Suggested Categories | multi-select  | ❌                    | Which categories this works well with |
| Default Opacity      | slider        | ❌                    | For overlays: 0-100%                  |
| Status               | select        | ✅                    | `active`, `archived`                  |

### Predefined Assets (Shipped with CMS)

```sql
INSERT INTO visual_asset_overlays (name, slug, asset_type, default_opacity, category_suggestions) VALUES
  ('Brush Strokes', 'brush-strokes', 'overlay', 20, ARRAY['paintings', 'colour-portraits']),
  ('Graphite Texture', 'graphite-texture', 'overlay', 25, ARRAY['pencil-sketches']),
  ('Paint Swash', 'paint-swash', 'overlay', 15, ARRAY['paintings', 'colour-portraits']),
  ('Paper Grain', 'paper-grain', 'texture', 30, ARRAY['pencil-sketches']),
  ('Canvas Texture', 'canvas-texture', 'texture', 20, ARRAY['paintings']),
  ('Gold Accents', 'gold-accents', 'overlay', 15, ARRAY['mirror-art', 'personalized-gifts']),
  ('Glass Reflections', 'glass-reflections', 'overlay', 20, ARRAY['mirror-art']),
  ('Clay Texture', 'clay-texture', 'texture', 25, ARRAY['clay-art']),
  ('Dot Grid', 'dot-grid', 'pattern', 10, ARRAY['pencil-sketches']),
  ('Soft Shadows', 'soft-shadows', 'overlay', 20, ARRAY[]);
```

### Database Schema

```sql
-- visual_assets (unified visual asset table)
CREATE TABLE visual_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  asset_type text NOT NULL CHECK (asset_type IN ('overlay', 'texture', 'pattern', 'gradient', 'icon', 'background', 'decorative')),

  -- File
  storage_path text NOT NULL,
  public_url text NOT NULL,
  preview_url text,
  file_size integer,
  width integer,
  height integer,
  mime_type text,

  -- Configuration
  description text,
  default_opacity integer DEFAULT 25 CHECK (default_opacity BETWEEN 0 AND 100),
  category_suggestions text[], -- which categories this asset works well with

  -- Status
  is_predefined boolean DEFAULT false, -- shipped with CMS, not deletable
  is_active boolean DEFAULT true,

  -- Usage
  usage_count integer DEFAULT 0,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- visual_asset_usage_log
CREATE TABLE visual_asset_usage_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES visual_assets(id) ON DELETE CASCADE,
  entity_type text NOT NULL, -- "category", "homepage", "section"
  entity_id uuid NOT NULL,
  usage_type text NOT NULL, -- "overlay", "texture", "background"
  opacity integer, -- actual opacity used
  created_at timestamptz DEFAULT now()
);
```

---

## Module 6: Website Content Manager

### Purpose

Manage all hardcoded text on the website. No text should be in code.

### Admin Screens

| Screen          | Route                             | Description                |
| --------------- | --------------------------------- | -------------------------- |
| Website Content | `/admin/website-content`          | Tabbed interface per page  |
| Homepage        | `/admin/website-content/homepage` | Hero, sections, CTAs       |
| About           | `/admin/website-content/about`    | About page content         |
| Contact         | `/admin/website-content/contact`  | Contact info, social links |
| Footer          | `/admin/website-content/footer`   | Footer content, links      |

### Homepage Content

| Section             | Fields                                                                       |
| ------------------- | ---------------------------------------------------------------------------- |
| Hero                | Heading, Subheading, CTA Text, CTA Link, Hero Image, Hero Background Graphic |
| Featured Categories | Which categories to show (multi-select), Display order                       |
| Featured Artworks   | Which artworks to show (multi-select), Display order                         |
| Testimonials        | Which testimonials to show (multi-select), Layout style                      |
| CTA Section         | Heading, Subheading, CTA Text, Background Image                              |
| SEO                 | Meta Title, Meta Description, OG Image                                       |

### About Page Content

| Section | Fields                                          |
| ------- | ----------------------------------------------- |
| Hero    | Heading, Subheading, Hero Image                 |
| Story   | Content (rich text), Story Images               |
| Mission | Mission Statement                               |
| Vision  | Vision Statement                                |
| Team    | Team Members (repeater: Name, Role, Photo, Bio) |
| SEO     | Meta Title, Meta Description                    |

### Contact Page Content

| Section        | Fields                                               |
| -------------- | ---------------------------------------------------- |
| Phone          | Primary Phone, WhatsApp Number                       |
| Email          | Primary Email                                        |
| Address        | Full Address, Google Maps Embed                      |
| Social Links   | Instagram, Facebook, YouTube, Pinterest              |
| Business Hours | Opening Hours (repeater: Day, Open Time, Close Time) |
| SEO            | Meta Title, Meta Description                         |

### Footer Content

| Section      | Fields                                |
| ------------ | ------------------------------------- |
| Brand        | Logo, Tagline, Short Description      |
| Quick Links  | Link List (repeater: Label, URL)      |
| Contact Info | Phone, Email, Address (summary)       |
| Social Icons | Icon + URL for each platform          |
| Copyright    | Copyright Text, Year                  |
| Legal Links  | Privacy Policy, Terms of Service URLs |

### Database Schema

```sql
-- website_content (key-value store for all website content)
CREATE TABLE website_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text UNIQUE NOT NULL, -- "homepage.hero.heading", "about.mission"
  page text NOT NULL, -- "homepage", "about", "contact", "footer"
  section text NOT NULL, -- "hero", "featured", "cta", "story"
  field_name text NOT NULL, -- "heading", "subheading", "cta_text"

  -- Value (polymorphic)
  value_text text,
  value_html text,
  value_json jsonb,
  value_media_id uuid REFERENCES media_library(id),

  -- Type
  field_type text DEFAULT 'text' CHECK (field_type IN ('text', 'textarea', 'html', 'image', 'multi_image', 'repeater', 'select', 'toggle')),

  -- Metadata
  description text, -- help text for the admin
  placeholder text, -- example value
  is_required boolean DEFAULT false,

  -- Status
  is_active boolean DEFAULT true,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- website_content_repeater_items (for repeater fields)
CREATE TABLE website_content_repeater_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_key text NOT NULL, -- references website_content.content_key
  display_order integer DEFAULT 0,
  item_data jsonb NOT NULL, -- {name: "...", role: "...", photo: "..."}
  created_at timestamptz DEFAULT now()
);
```

### Example Data

```sql
-- Homepage Hero
INSERT INTO website_content (content_key, page, section, field_name, value_text, field_type, description) VALUES
  ('homepage.hero.heading', 'homepage', 'hero', 'heading', 'Handcrafted Custom Artwork', 'text', 'Main headline on homepage hero'),
  ('homepage.hero.subheading', 'homepage', 'hero', 'subheading', 'Pencil sketches, colour portraits, paintings, and more — made just for you.', 'textarea', 'Subheadline below main heading'),
  ('homepage.hero.cta_text', 'homepage', 'hero', 'cta_text', 'Explore Artworks', 'text', 'Primary CTA button text'),
  ('homepage.hero.cta_link', 'homepage', 'hero', 'cta_link', '/portfolio', 'text', 'Primary CTA button link'),
  ('homepage.hero.image_id', 'homepage', 'hero', 'image', null, 'image', 'Hero background image');

-- Contact Info
INSERT INTO website_content (content_key, page, section, field_name, value_text, field_type) VALUES
  ('contact.phone.primary', 'contact', 'contact_info', 'phone', '+91 98765 43210', 'text'),
  ('contact.whatsapp.number', 'contact', 'contact_info', 'whatsapp', '+91 98765 43210', 'text'),
  ('contact.email.primary', 'contact', 'contact_info', 'email', 'hello@artspire.in', 'text'),
  ('contact.address.full', 'contact', 'contact_info', 'address', 'Mumbai, Maharashtra, India', 'textarea');
```

---

## Module 7: FAQ Management

### Purpose

Manage FAQs at three levels: Global, Category, and Artwork. Auto-generate FAQ schema markup.

### Admin Screens

| Screen       | Route                  | Description           |
| ------------ | ---------------------- | --------------------- |
| FAQ List     | `/admin/faqs`          | All FAQs with filters |
| New FAQ      | `/admin/faqs/new`      | Create FAQ            |
| Edit FAQ     | `/admin/faqs/edit/$id` | Edit FAQ              |
| FAQ Sections | `/admin/faqs/sections` | Manage FAQ groupings  |

### FAQ Form Fields

| Field         | Type            | Required | Notes                                  |
| ------------- | --------------- | -------- | -------------------------------------- |
| Question      | text            | ✅       | The FAQ question                       |
| Answer        | textarea (rich) | ✅       | The answer, supports basic formatting  |
| Section       | select          | ❌       | Which FAQ section this belongs to      |
| Entity Type   | select          | ❌       | `global`, `category`, `artwork`        |
| Entity        | select          | ❌       | Which category/artwork this applies to |
| Display Order | number          | ❌       | Order within section                   |
| Show on Page  | toggle          | ❌       | Whether to display this FAQ            |
| Schema Type   | select          | ❌       | `FAQPage`, `QAPage`                    |

### FAQ Sections (Groupings)

| Section               | Description                      | Example Questions                                          |
| --------------------- | -------------------------------- | ---------------------------------------------------------- |
| "Ordering & Delivery" | Questions about ordering process | "How do I place an order?", "How long does delivery take?" |
| "Pricing & Payment"   | Questions about cost and payment | "What are the prices?", "Do you accept COD?"               |
| "Artwork Process"     | Questions about creation         | "Can I see the artwork before delivery?"                   |
| "Customization"       | Questions about personalization  | "Can you add a name to the artwork?"                       |
| "Shipping & Returns"  | Questions about logistics        | "Do you ship outside India?"                               |

### Database Schema

```sql
-- faq_sections (group FAQs by topic)
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

-- faqs (already exists - extend)
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS
  section_id uuid REFERENCES faq_sections(id),
  display_order integer DEFAULT 0,
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  schema_type text DEFAULT 'FAQPage' CHECK (schema_type IN ('FAQPage', 'QAPage')),
  created_by uuid REFERENCES profiles(id),
  updated_by uuid REFERENCES profiles(id);

-- artwork_faqs (junction for artwork-specific FAQs)
CREATE TABLE artwork_faqs (
  artwork_id uuid REFERENCES artworks(id) ON DELETE CASCADE,
  faq_id uuid REFERENCES faqs(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  PRIMARY KEY (artwork_id, faq_id)
);
```

### FAQ Schema Auto-Generation

When a page with FAQs is rendered, the system automatically generates JSON-LD schema:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does delivery take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standard delivery takes 5-7 days..."
      }
    }
  ]
}
```

---

## Module 8: SEO Center

### Purpose

Manage SEO for every page without touching code. Meta tags, schema markup, canonical URLs, OG tags.

### Admin Screens

| Screen        | Route                   | Description                       |
| ------------- | ----------------------- | --------------------------------- |
| SEO Dashboard | `/admin/seo`            | Overview of all pages' SEO health |
| Page SEO      | `/admin/seo/pages`      | Edit SEO for any page             |
| Artwork SEO   | `/admin/seo/artworks`   | Bulk SEO for artworks             |
| Category SEO  | `/admin/seo/categories` | Bulk SEO for categories           |
| Redirects     | `/admin/seo/redirects`  | Manage 301 redirects              |
| Schema        | `/admin/seo/schema`     | Manage structured data            |

### SEO Form (Per Page)

| Field            | Type            | Required | Notes                                                |
| ---------------- | --------------- | -------- | ---------------------------------------------------- |
| Page             | display         | ✅       | Read-only: which page this is for                    |
| Meta Title       | text            | ❌       | 50-60 chars recommended                              |
| Meta Description | textarea        | ❌       | 150-160 chars recommended                            |
| Canonical URL    | text            | ❌       | Preferred URL for this page                          |
| OG Title         | text            | ❌       | Social sharing title                                 |
| OG Description   | textarea        | ❌       | Social sharing description                           |
| OG Image         | image upload    | ❌       | Social sharing image (1200x630)                      |
| Twitter Card     | select          | ❌       | `summary`, `summary_large_image`                     |
| Twitter Image    | image upload    | ❌       | Twitter sharing image                                |
| Robots Meta      | select          | ❌       | `index,follow`, `noindex,follow`, `noindex,nofollow` |
| Schema Type      | select          | ❌       | `Article`, `Product`, `FAQPage`, `Organization`      |
| Custom Schema    | textarea (JSON) | ❌       | Additional JSON-LD                                   |

### SEO Health Score

Each page gets an SEO score (0-100):

```
SEO Health Score Breakdown:
├── Meta Title present (+20)
├── Meta Description present (+20)
├── Canonical URL present (+10)
├── OG Image present (+15)
├── OG Title present (+10)
├── OG Description present (+10)
├── Schema markup present (+15)
└── Total: 0-100
```

Pages with score < 50 show a warning in the admin.

### Database Schema

```sql
-- seo_metadata (already exists - extend with Phase 1 fields)
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS
  -- Open Graph
  og_title text,
  og_description text,
  og_image_id uuid REFERENCES media_library(id),

  -- Twitter
  twitter_card text DEFAULT 'summary_large_image' CHECK (twitter_card IN ('summary', 'summary_large_image')),
  twitter_image_id uuid REFERENCES media_library(id),

  -- Robots
  robots_meta text DEFAULT 'index, follow' CHECK (robots_meta IN ('index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow')),

  -- Canonical
  canonical_url text,

  -- Schema
  schema_type text DEFAULT 'Article' CHECK (schema_type IN ('Article', 'Product', 'FAQPage', 'Organization', 'LocalBusiness', 'CreativeWork', 'BreadcrumbList')),
  custom_schema jsonb, -- additional JSON-LD

  -- Health Score
  seo_score integer GENERATED ALWAYS AS (
    CASE WHEN meta_title IS NOT NULL THEN 20 ELSE 0 END +
    CASE WHEN meta_description IS NOT NULL THEN 20 ELSE 0 END +
    CASE WHEN canonical_url IS NOT NULL THEN 10 ELSE 0 END +
    CASE WHEN og_image_id IS NOT NULL THEN 15 ELSE 0 END +
    CASE WHEN og_title IS NOT NULL THEN 10 ELSE 0 END +
    CASE WHEN og_description IS NOT NULL THEN 10 ELSE 0 END +
    CASE WHEN structured_data IS NOT NULL THEN 15 ELSE 0 END
  ) STORED,

  -- Audit
  updated_by uuid REFERENCES profiles(id);

-- seo_page_inventory (list of all pages that need SEO)
CREATE TABLE seo_page_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text NOT NULL CHECK (page_type IN ('homepage', 'about', 'contact', 'portfolio', 'artwork', 'category', 'faq')),
  page_id uuid, -- references the actual page entity
  page_url text NOT NULL,
  page_title text,
  has_seo_metadata boolean DEFAULT false,
  last_checked_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```

---

## Module 9: Lead Center

### Purpose

CRM for managing customer inquiries. Track leads from first contact to delivery.

### Admin Screens

| Screen        | Route                   | Description                          |
| ------------- | ----------------------- | ------------------------------------ |
| Lead List     | `/admin/leads`          | Pipeline view + table                |
| Lead Detail   | `/admin/leads/$id`      | Full lead profile + activity history |
| New Lead      | `/admin/leads/new`      | Manual lead entry                    |
| Edit Lead     | `/admin/leads/edit/$id` | Update lead info                     |
| Lead Pipeline | `/admin/leads/pipeline` | Kanban board view                    |

### Lead Form Fields

| Field       | Type     | Required | Notes                                                                               |
| ----------- | -------- | -------- | ----------------------------------------------------------------------------------- |
| Name        | text     | ✅       | Customer name                                                                       |
| Phone       | text     | ❌       | Phone number                                                                        |
| WhatsApp    | text     | ❌       | WhatsApp number (if different)                                                      |
| Email       | text     | ❌       | Email address                                                                       |
| Requirement | textarea | ❌       | What they need                                                                      |
| Category    | select   | ❌       | Which category they're interested in                                                |
| Budget      | select   | ❌       | `under-1000`, `1000-5000`, `5000-10000`, `10000-25000`, `25000+`                    |
| Source      | select   | ❌       | `website-form`, `whatsapp`, `instagram`, `facebook`, `google`, `direct`, `referral` |
| Status      | select   | ✅       | Pipeline stage                                                                      |
| Notes       | textarea | ❌       | Internal notes                                                                      |
| Assigned To | select   | ❌       | Team member responsible                                                             |

### Pipeline Stages (Kanban)

```
┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│    NEW     │  │ CONTACTED  │  │  QUOTED    │  │ NEGOTIATING│  │ CONFIRMED  │  │ IN PROD.   │  │ DELIVERED  │
│    12      │  │    8       │  │    5       │  │    3       │  │    2       │  │    4       │  │    15      │
├────────────┤  ├────────────┤  ├────────────┤  ├────────────┤  ├────────────┤  ├────────────┤  ├────────────┤
│ Priya S.   │  │ Rahul K.   │  │ Ananya M.  │  │ Vikram P.  │  │ Sunita R.  │  │ Deepak T.  │  │ Neha G.    │
│ ₹3,500     │  │ ₹5,000     │  │ ₹2,200     │  │ ₹8,000     │  │ ₹12,000    │  │ ₹4,500     │  │ ₹1,800     │
│ 2 hrs ago  │  │ 1 day ago  │  │ 3 days ago │  │ 5 days ago │  │ 1 week ago │  │ 2 days ago │  │ 2 weeks ago│
└────────────┘  └────────────┘  └────────────┘  └────────────┘  └────────────┘  └────────────┘  └────────────┘
```

### Lead Detail View

```
┌──────────────────────────────────────────────────────────────────────┐
│ Priya Sharma                                          [Edit] [Delete]│
│ 📱 +91 98765 43210  │  📧 priya@email.com  │  📍 Mumbai              │
├──────────────────────────────────────────────────────────────────────┤
│ Status: NEW → [Move to Contacted ▼]                                 │
│ Source: Website Form  │  Category: Pencil Sketches  │  Budget: ₹3,500│
├──────────────────────────────────────────────────────────────────────┤
│ Requirement: "I want a pencil sketch of my parents for their         │
│              25th anniversary. A4 size, framed."                      │
├──────────────────────────────────────────────────────────────────────┤
│ Activity History                                                     │
│ ───────────────────────────────────────────────────────────────────  │
│ 📥 Inquiry received via website form                                 │
│    2 hours ago                                                       │
│ 📱 WhatsApp auto-reply sent: "Thank you for your interest..."       │
│    2 hours ago  (automated)                                          │
│ ⏰ Follow-up scheduled for tomorrow at 10:00 AM                     │
│    2 hours ago  (automated)                                          │
└──────────────────────────────────────────────────────────────────────┘
```

### Database Schema

```sql
-- leads (already partially designed - complete for Phase 1)
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_number text UNIQUE NOT NULL, -- ART-2025-0001

  -- Contact Info
  name text NOT NULL,
  email text,
  phone text,
  whatsapp_number text,
  location text,

  -- Interest
  requirement text,
  category_id uuid REFERENCES categories(id),
  artwork_id uuid REFERENCES artworks(id),
  budget_range text CHECK (budget_range IN ('under-1000', '1000-5000', '5000-10000', '10000-25000', '25000+')),

  -- Source
  source text DEFAULT 'website' CHECK (source IN ('website-form', 'whatsapp', 'instagram', 'facebook', 'google', 'direct', 'referral')),
  source_detail text, -- "Homepage Hero CTA", "Pencil Sketches Page"

  -- Status Pipeline
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'negotiating', 'confirmed', 'in-production', 'delivered', 'closed-won', 'closed-lost')),
  status_changed_at timestamptz DEFAULT now(),

  -- Assignment
  assigned_to uuid REFERENCES profiles(id),

  -- Notes
  notes text,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- lead_activities
CREATE TABLE lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  activity_type text NOT NULL CHECK (activity_type IN ('inquiry', 'call', 'whatsapp', 'email', 'note', 'status-change', 'follow-up', 'quote-sent')),
  subject text,
  body text,
  direction text CHECK (direction IN ('inbound', 'outbound')),
  is_automated boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- lead_tags (for tagging leads)
CREATE TABLE lead_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now()
);

-- lead_tag_items
CREATE TABLE lead_tag_items (
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES lead_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (lead_id, tag_id)
);
```

---

## Module 10: WhatsApp Conversion Center

### Purpose

Manage all WhatsApp CTAs and track conversion analytics.

### Admin Screens

| Screen             | Route                       | Description                     |
| ------------------ | --------------------------- | ------------------------------- |
| WhatsApp Settings  | `/admin/whatsapp`           | Configure number, CTAs, buttons |
| WhatsApp Analytics | `/admin/whatsapp/analytics` | Click tracking, conversion data |
| Message Templates  | `/admin/whatsapp/templates` | Manage auto-reply templates     |

### WhatsApp Settings Form

| Field                   | Type         | Required | Notes                                          |
| ----------------------- | ------------ | -------- | ---------------------------------------------- |
| Primary WhatsApp Number | text         | ✅       | Business WhatsApp number                       |
| Display Text            | text         | ✅       | "Chat on WhatsApp" or custom                   |
| Floating Button         | toggle       | ✅       | Show floating button on all pages              |
| Button Position         | select       | ❌       | `bottom-right`, `bottom-left`, `bottom-center` |
| Button Style            | select       | ❌       | `pill`, `rounded`, `square`                    |
| Button Color            | color picker | ❌       | Default: brand green                           |
| Pre-filled Message      | textarea     | ❌       | "Hi, I'm interested in custom artwork..."      |

### Category-Specific CTAs

| Setting                     | Description                                                 |
| --------------------------- | ----------------------------------------------------------- |
| Category CTA Text           | Custom text per category (e.g. "Get a Pencil Sketch Quote") |
| Category Pre-filled Message | Different message per category                              |
| Artwork CTA Text            | Custom text per artwork (e.g. "Order This Portrait")        |

### Analytics Tracking

```sql
-- whatsapp_clicks (track every WhatsApp CTA click)
CREATE TABLE whatsapp_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Click Context
  cta_type text NOT NULL CHECK (cta_type IN ('floating-button', 'hero-cta', 'category-cta', 'artwork-cta', 'footer-cta', 'inline-cta')),
  page_url text,
  page_path text,

  -- Content Context
  artwork_id uuid REFERENCES artworks(id),
  category_id uuid REFERENCES categories(id),

  -- Visitor
  visitor_id text, -- anonymous cookie ID
  user_agent text,
  ip_address text,
  country text,
  city text,

  -- Timestamps
  clicked_at timestamptz DEFAULT now()
);

-- whatsapp_click_daily_rollup
CREATE TABLE whatsapp_click_daily_rollup (
  date date PRIMARY KEY,
  total_clicks integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  by_cta_type jsonb DEFAULT '{}', -- {"floating-button": 45, "hero-cta": 12}
  by_page jsonb DEFAULT '{}', -- {"/": 30, "/artwork/sunset-portrait": 5}
  by_category jsonb DEFAULT '{}', -- {"pencil-sketches": 15, "colour-portraits": 8}
  created_at timestamptz DEFAULT now()
);
```

### WhatsApp Analytics Dashboard

```
┌──────────────────────────────────────────────────────────────────────┐
│ WhatsApp Analytics                                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Total    │  │ This     │  │ Unique   │  │ Conversion│          │
│  │ Clicks   │  │ Week     │  │ Visitors │  │ Rate      │          │
│  │ 342      │  │ 87       │  │ 198      │  │ 12.5%     │          │
│  │ ↑ 23%    │  │ ↑ 15%    │  │ ↑ 8%     │  │ ↑ 2.3%    │          │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │
│                                                                      │
│  Clicks by CTA Type                   Clicks by Page               │
│  ┌─────────────────────┐              ┌─────────────────────┐         │
│  │ Floating Button 45% │              │ Homepage      30%   │         │
│  │ Hero CTA        25% │              │ Portfolio     25%   │         │
│  │ Category CTA    20% │              │ Artwork Pages 20%   │         │
│  │ Artwork CTA     10% │              │ Category Pages 15%  │         │
│  └─────────────────────┘              └─────────────────────┘         │
│                                                                      │
│  Top Converting Pages                                                │
│  ─────────────────────────────────────────────────────────────────  │
│  1. /artwork/sunset-portrait      45 clicks   ₹3,500 avg order      │
│  2. /category/pencil-sketches     38 clicks   ₹2,800 avg order      │
│  3. /artwork/family-sketch        32 clicks   ₹4,200 avg order      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Module 11: Page Section Manager

### Purpose

Every page is built from editable sections. The owner can enable/disable, reorder, and edit content per section without touching code.

### Admin Screens

| Screen          | Route                   | Description                |
| --------------- | ----------------------- | -------------------------- |
| Page Builder    | `/admin/pages`          | List of all pages          |
| Page Editor     | `/admin/pages/$pageId`  | Edit sections for a page   |
| Section Library | `/admin/pages/sections` | Reusable section templates |

### Page Structure (Homepage Example)

```
Homepage Sections (editable order, toggle on/off):

☑️ 1. Hero Section
   - Heading: "Handcrafted Custom Artwork"
   - Subheading: "..."
   - CTA Text: "Explore Artworks"
   - Background Image: [hero-bg.jpg]
   - Overlay Graphic: [hero-overlay.png]
   - Status: Published

☑️ 2. Categories Section
   - Title: "Explore Our Artwork"
   - Subtitle: "..."
   - Categories: [Pencil Sketches, Colour Portraits, ...]
   - Layout: "Grid (3 columns)"
   - Status: Published

☑️ 3. Featured Artworks Section
   - Title: "Featured Creations"
   - Artworks: [Artwork #1, Artwork #2, ...]
   - Layout: "Carousel"
   - Status: Published

☑️ 4. Testimonials Section
   - Title: "What Our Customers Say"
   - Testimonials: [Testimonial #1, #2, ...]
   - Layout: "Slider"
   - Status: Published

☑️ 5. CTA Section
   - Heading: "Ready to Get Your Custom Artwork?"
   - Subheading: "..."
   - CTA Text: "Start Your Order"
   - Background Image: [cta-bg.jpg]
   - Status: Published

☑️ 6. Footer (Global)
   - Status: Published
```

### Section Types

| Section Type    | Description            | Editable Fields                                     |
| --------------- | ---------------------- | --------------------------------------------------- |
| `hero`          | Full-width hero banner | Heading, subheading, CTA, background image, overlay |
| `category-grid` | Category cards grid    | Title, categories to show, layout, columns          |
| `artwork-grid`  | Artwork cards grid     | Title, artworks to show, layout, filter             |
| `testimonials`  | Customer testimonials  | Title, testimonials, layout (slider/grid)           |
| `cta-banner`    | Call-to-action banner  | Heading, subheading, CTA, background                |
| `content-block` | Text + image block     | Heading, content, image, image position             |
| `video`         | Embedded video         | Video URL, thumbnail, caption                       |
| `faq`           | FAQ accordion          | Title, FAQs to show                                 |
| `image-gallery` | Image gallery          | Images, layout (grid/masonry/carousel)              |
| `custom-html`   | Raw HTML (advanced)    | HTML content (for embeds)                           |

### Section Form

| Field            | Type         | Description                          |
| ---------------- | ------------ | ------------------------------------ |
| Section Type     | select       | Choose from section types            |
| Section Name     | text         | Internal name (e.g. "Homepage Hero") |
| Display Order    | number       | Position on page                     |
| Is Active        | toggle       | Show/hide this section               |
| Background Image | image upload | Section background                   |
| Background Color | color picker | Fallback color                       |
| Padding Top      | number       | Space above section (px)             |
| Padding Bottom   | number       | Space below section (px)             |
| Custom CSS       | textarea     | Advanced styling (optional)          |

### Database Schema

```sql
-- pages (website pages)
CREATE TABLE pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL, -- "homepage", "about", "contact", "portfolio"
  name text NOT NULL, -- "Homepage", "About Us"
  route text NOT NULL, -- "/", "/about", "/contact"
  is_active boolean DEFAULT true,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- page_sections (sections within a page)
CREATE TABLE page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES pages(id) ON DELETE CASCADE,

  -- Section Identity
  section_type text NOT NULL CHECK (section_type IN ('hero', 'category-grid', 'artwork-grid', 'testimonials', 'cta-banner', 'content-block', 'video', 'faq', 'image-gallery', 'custom-html')),
  section_name text NOT NULL,

  -- Content (polymorphic based on section_type)
  content_data jsonb NOT NULL, -- {heading: "...", subheading: "...", cta_text: "..."}

  -- Visual
  background_image_id uuid REFERENCES media_library(id),
  background_color text,
  overlay_opacity integer DEFAULT 0,

  -- Layout
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,

  -- Spacing
  padding_top integer DEFAULT 60,
  padding_bottom integer DEFAULT 60,

  -- Advanced
  custom_css text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- section_type_definitions (available section types)
CREATE TABLE section_type_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type text UNIQUE NOT NULL,
  name text NOT NULL, -- "Hero Section", "Category Grid"
  description text,
  icon text, -- Lucide icon name
  default_config jsonb, -- default field values
  available_fields jsonb, -- [{"name": "heading", "type": "text", "label": "Heading"}]
  is_active boolean DEFAULT true
);
```

### Example Section Data

```json
// Hero Section
{
  "heading": "Handcrafted Custom Artwork",
  "subheading": "Pencil sketches, colour portraits, paintings, and more — made just for you.",
  "cta_text": "Explore Artworks",
  "cta_link": "/portfolio",
  "background_image_id": "uuid-here",
  "overlay_opacity": 30
}

// Category Grid Section
{
  "title": "Explore Our Artwork",
  "subtitle": "Discover the perfect piece for your space",
  "category_ids": ["uuid-1", "uuid-2", "uuid-3", "uuid-4", "uuid-5", "uuid-6"],
  "layout": "grid",
  "columns": 3,
  "show_description": true
}

// Testimonials Section
{
  "title": "What Our Customers Say",
  "testimonial_ids": ["uuid-1", "uuid-2", "uuid-3"],
  "layout": "slider",
  "autoplay": true,
  "show_rating": true
}
```

---

## Module 12: Database Architecture

### Complete Phase 1 Schema

Below is the complete database schema for all Phase 1 modules. Tables are organized by module.

#### Core Tables (Already Exist)

```sql
-- profiles (already exists)
-- artworks (already exists - extended)
-- categories (already exists - extended)
-- tags (already exists)
-- artwork_tags (already exists)
-- faqs (already exists - extended)
-- seo_metadata (already exists - extended)
-- redirects (already exists - extended)
-- commission_requests (already exists)
```

#### New Phase 1 Tables

```sql
-- ============= DASHBOARD =============
CREATE TABLE dashboard_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value integer DEFAULT 0,
  metric_value_numeric numeric(12,2),
  metric_period text CHECK (metric_period IN ('today', 'week', 'month', 'quarter', 'year')),
  change_value integer DEFAULT 0,
  change_percent numeric(5,2),
  trend text CHECK (trend IN ('up', 'down', 'flat')),
  calculated_at timestamptz DEFAULT now()
);

CREATE TABLE dashboard_activity_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type text NOT NULL CHECK (activity_type IN ('artwork_created', 'artwork_published', 'artwork_updated', 'artwork_deleted', 'category_updated', 'faq_created', 'faq_updated', 'lead_created', 'lead_status_changed', 'whatsapp_click', 'seo_updated', 'media_uploaded', 'content_updated')),
  title text NOT NULL,
  description text,
  entity_type text,
  entity_id uuid,
  entity_slug text,
  performed_by uuid REFERENCES profiles(id),
  performed_at timestamptz DEFAULT now()
);

-- ============= ARTWORK MANAGEMENT =============
CREATE TABLE artwork_series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  cover_image_url text,
  category_id uuid REFERENCES categories(id),
  display_order integer DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured boolean DEFAULT false,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE artwork_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  base_image_url text,
  category_id uuid REFERENCES categories(id),
  base_price numeric(10,2),
  customizable_fields jsonb,
  estimated_days integer,
  difficulty_level integer,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE artwork_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id uuid REFERENCES artworks(id) ON DELETE CASCADE,
  version integer NOT NULL,
  title text,
  summary text,
  story_content text,
  price numeric(10,2),
  status text,
  changed_by uuid REFERENCES profiles(id),
  changed_at timestamptz DEFAULT now(),
  change_reason text
);

CREATE TABLE artwork_gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id uuid REFERENCES artworks(id) ON DELETE CASCADE,
  media_id uuid REFERENCES media_library(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  caption text,
  alt_text text,
  created_at timestamptz DEFAULT now()
);

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

-- ============= CATEGORY MANAGEMENT =============
CREATE TABLE category_tree (
  ancestor_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  descendant_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  depth integer DEFAULT 0,
  PRIMARY KEY (ancestor_id, descendant_id)
);

CREATE TABLE category_gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  media_id uuid REFERENCES media_library(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  caption text,
  alt_text text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE category_faqs (
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  faq_id uuid REFERENCES faqs(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  PRIMARY KEY (category_id, faq_id)
);

CREATE TABLE visual_asset_overlays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  asset_type text DEFAULT 'overlay' CHECK (asset_type IN ('overlay', 'texture', 'pattern', 'accent')),
  preview_url text,
  storage_path text NOT NULL,
  category_suggestions text[],
  default_opacity integer DEFAULT 25,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============= MEDIA LIBRARY =============
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

CREATE TABLE media_usage_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid REFERENCES media_library(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  usage_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ============= VISUAL ASSETS =============
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
  default_opacity integer DEFAULT 25,
  category_suggestions text[],
  is_predefined boolean DEFAULT false,
  is_active boolean DEFAULT true,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE visual_asset_usage_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES visual_assets(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  usage_type text NOT NULL,
  opacity integer,
  created_at timestamptz DEFAULT now()
);

-- ============= WEBSITE CONTENT =============
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

CREATE TABLE website_content_repeater_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_key text NOT NULL,
  display_order integer DEFAULT 0,
  item_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ============= FAQ MANAGEMENT =============
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

CREATE TABLE artwork_faqs (
  artwork_id uuid REFERENCES artworks(id) ON DELETE CASCADE,
  faq_id uuid REFERENCES faqs(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  PRIMARY KEY (artwork_id, faq_id)
);

-- ============= SEO CENTER =============
CREATE TABLE sitemap_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  sitemap_type text CHECK (sitemap_type IN ('index', 'pages', 'artworks', 'categories', 'images', 'videos')),
  lastmod timestamptz,
  changefreq text CHECK (changefreq IN ('always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never')),
  priority numeric(2,1) CHECK (priority BETWEEN 0.0 AND 1.0),
  status text DEFAULT 'active' CHECK (status IN ('active', 'removed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE seo_page_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text NOT NULL CHECK (page_type IN ('homepage', 'about', 'contact', 'portfolio', 'artwork', 'category', 'faq')),
  page_id uuid,
  page_url text NOT NULL,
  page_title text,
  has_seo_metadata boolean DEFAULT false,
  last_checked_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ============= LEAD CENTER =============
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_number text UNIQUE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  whatsapp_number text,
  location text,
  requirement text,
  category_id uuid REFERENCES categories(id),
  artwork_id uuid REFERENCES artworks(id),
  budget_range text CHECK (budget_range IN ('under-1000', '1000-5000', '5000-10000', '10000-25000', '25000+')),
  source text DEFAULT 'website' CHECK (source IN ('website-form', 'whatsapp', 'instagram', 'facebook', 'google', 'direct', 'referral')),
  source_detail text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'negotiating', 'confirmed', 'in-production', 'delivered', 'closed-won', 'closed-lost')),
  status_changed_at timestamptz DEFAULT now(),
  assigned_to uuid REFERENCES profiles(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  activity_type text NOT NULL CHECK (activity_type IN ('inquiry', 'call', 'whatsapp', 'email', 'note', 'status-change', 'follow-up', 'quote-sent')),
  subject text,
  body text,
  direction text CHECK (direction IN ('inbound', 'outbound')),
  is_automated boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE lead_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE lead_tag_items (
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES lead_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (lead_id, tag_id)
);

-- ============= WHATSAPP CONVERSION =============
CREATE TABLE whatsapp_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cta_type text NOT NULL CHECK (cta_type IN ('floating-button', 'hero-cta', 'category-cta', 'artwork-cta', 'footer-cta', 'inline-cta')),
  page_url text,
  page_path text,
  artwork_id uuid REFERENCES artworks(id),
  category_id uuid REFERENCES categories(id),
  visitor_id text,
  user_agent text,
  ip_address text,
  country text,
  city text,
  clicked_at timestamptz DEFAULT now()
);

CREATE TABLE whatsapp_click_daily_rollup (
  date date PRIMARY KEY,
  total_clicks integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  by_cta_type jsonb DEFAULT '{}',
  by_page jsonb DEFAULT '{}',
  by_category jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- ============= PAGE SECTION MANAGER =============
CREATE TABLE pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  route text NOT NULL,
  is_active boolean DEFAULT true,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  section_type text NOT NULL CHECK (section_type IN ('hero', 'category-grid', 'artwork-grid', 'testimonials', 'cta-banner', 'content-block', 'video', 'faq', 'image-gallery', 'custom-html')),
  section_name text NOT NULL,
  content_data jsonb NOT NULL,
  background_image_id uuid REFERENCES media_library(id),
  background_color text,
  overlay_opacity integer DEFAULT 0,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  padding_top integer DEFAULT 60,
  padding_bottom integer DEFAULT 60,
  custom_css text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE section_type_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  icon text,
  default_config jsonb,
  available_fields jsonb,
  is_active boolean DEFAULT true
);
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_artworks_status_category ON artworks(status, category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_artworks_slug ON artworks(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_artworks_featured ON artworks(featured) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_artworks_homepage ON artworks(show_on_homepage) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_media_library_folder ON media_library(folder);
CREATE INDEX idx_media_library_tags ON media_library USING gin(tags);
CREATE INDEX idx_website_content_page ON website_content(page);
CREATE INDEX idx_page_sections_page ON page_sections(page_id);
CREATE INDEX idx_whatsapp_clicks_date ON whatsapp_clicks(clicked_at);
CREATE INDEX idx_dashboard_activity_performed_at ON dashboard_activity_feed(performed_at DESC);
```

### RLS Strategy

```sql
-- All tables: admin-only access for Phase 1
-- Public read access for published content

-- artworks: public can read published, admin can CRUD
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published artworks" ON artworks
  FOR SELECT USING (status = 'published' AND deleted_at IS NULL);
CREATE POLICY "Admin full access" ON artworks
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- categories: public can read published, admin can CRUD
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published categories" ON categories
  FOR SELECT USING (status = 'published' AND deleted_at IS NULL);
CREATE POLICY "Admin full access" ON categories
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- leads: admin-only (no public access)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access" ON leads
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- media_library: public can read, admin can CRUD
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read media" ON media_library
  FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Admin full access" ON media_library
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- website_content: public can read active, admin can CRUD
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active content" ON website_content
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admin full access" ON website_content
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- page_sections: public can read active, admin can CRUD
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active sections" ON page_sections
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admin full access" ON page_sections
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
```

---

## Module 13: Admin Navigation

### Sidebar Structure

```
┌────────────────────────────────────┐
│  🎨 Artspire                        │  ← Logo, click → Dashboard
│  Admin Panel                        │
├────────────────────────────────────┤
│                                     │
│  📊 DASHBOARD                       │  ← /admin
│    Dashboard                        │     KPIs, charts, activity
│                                     │
│  📝 CONTENT                         │
│    ├─ Artworks          (/admin/artworks)
│    ├─ Categories        (/admin/categories)
│    ├─ FAQs              (/admin/faqs)
│    └─ Media Library      (/admin/media)
│                                     │
│  🎨 VISUAL ASSETS                   │
│    └─ Visual Assets    (/admin/visual-assets)
│                                     │
│  🌐 WEBSITE                         │
│    ├─ Website Content  (/admin/website-content)
│    ├─ Pages            (/admin/pages)
│    └─ SEO Center       (/admin/seo)
│                                     │
│  👥 LEADS                           │
│    ├─ All Leads        (/admin/leads)
│    ├─ Pipeline         (/admin/leads/pipeline)
│    └─ Analytics        (/admin/leads/analytics)
│                                     │
│  📱 WHATSAPP                        │
│    ├─ Settings         (/admin/whatsapp)
│    ├─ Analytics        (/admin/whatsapp/analytics)
│    └─ Templates        (/admin/whatsapp/templates)
│                                     │
│  ⚙️ SETTINGS                        │
│    └─ General Settings (/admin/settings)
│                                     │
├────────────────────────────────────┤
│  👤 Admin Name                      │  ← Profile dropdown
│  🚪 Logout                          │
└────────────────────────────────────┘
```

### Mobile Navigation

```
Bottom Tab Bar (mobile):
┌──────┬──────┬──────┬──────┬──────┐
│  📊  │  📝  │  🎨  │  👥  │  📱  │
│ Dash │Cont. │Visual│Leads │WA    │
└──────┴──────┴──────┴──────┴──────┘

Content submenu opens as bottom sheet:
┌────────────────────────────┐
│  📝 Content                │
│  ───────────────────────── │
│  🎨 Artworks               │
│  🏷️ Categories             │
│  ❓ FAQs                   │
│  🖼️ Media Library          │
└────────────────────────────┘
```

---

## Implementation Priority Order

### Sprint 1: Foundation (Week 1-2)

| #   | Task                    | Files                                   | Why First                          |
| --- | ----------------------- | --------------------------------------- | ---------------------------------- |
| 1   | Database migrations     | Supabase SQL                            | Everything depends on data         |
| 2   | Media Library           | `media-library.ts`, `MediaUploader.tsx` | All other modules need images      |
| 3   | Visual Asset System     | `visual-assets.ts`, overlay configs     | Categories need overlays           |
| 4   | Category Visual System  | `categories.ts` + UI                    | Homepage depends on category cards |
| 5   | Website Content Manager | `website-content.ts` + forms            | Eliminate hardcoded text           |

### Sprint 2: Content (Week 3-4)

| #   | Task                          | Files                           | Why Second             |
| --- | ----------------------------- | ------------------------------- | ---------------------- |
| 6   | Artwork Management (enhanced) | `artworks.ts` + forms + gallery | Core product           |
| 7   | FAQ Management                | `faqs.ts` + forms + sections    | Support + SEO          |
| 8   | Page Section Manager          | `pages.ts`, `page-sections.ts`  | Flexible page building |
| 9   | SEO Center                    | `seo.ts` + forms                | Search visibility      |

### Sprint 3: Business (Week 5-6)

| #   | Task             | Files                              | Why Third           |
| --- | ---------------- | ---------------------------------- | ------------------- |
| 10  | Lead Center      | `leads.ts` + CRM UI                | Business operations |
| 11  | WhatsApp Center  | `whatsapp-clicks.ts` + analytics   | Conversion tracking |
| 12  | Dashboard        | `dashboard-metrics.ts` + KPI cards | Business overview   |
| 13  | Admin Navigation | Sidebar, mobile nav, breadcrumbs   | Navigation polish   |

### Sprint 4: Polish (Week 7-8)

| #   | Task                | Files                          | Why Fourth       |
| --- | ------------------- | ------------------------------ | ---------------- |
| 14  | Image optimization  | WebP variants, lazy loading    | Performance      |
| 15  | Content seeding     | Predefined overlays, demo data | Ready for owner  |
| 16  | Admin onboarding    | Tooltips, empty states, guides | UX               |
| 17  | Testing & bug fixes | E2E tests, QA                  | Production-ready |

---

## TanStack Start Folder Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx           # Sidebar + header wrapper
│   │   ├── AdminSidebar.tsx          # Navigation sidebar
│   │   ├── AdminMobileNav.tsx        # Bottom tab bar (mobile)
│   │   ├── AdminHeader.tsx           # Top bar with search + profile
│   │   ├── KpiCard.tsx               # Dashboard KPI card
│   │   ├── ActivityFeed.tsx          # Dashboard activity list
│   │   ├── DataTable.tsx             # Reusable sortable/filterable table
│   │   ├── FormField.tsx             # Reusable form field wrapper
│   │   ├── ImageUploader.tsx         # Single image upload + preview
│   │   ├── MultiImageUploader.tsx    # Multiple image upload + gallery
│   │   ├── MediaPicker.tsx           # Modal to pick from media library
│   │   ├── RichTextEditor.tsx        # TipTap editor wrapper
│   │   ├── StatusBadge.tsx           # Status pill (published/draft/archived)
│   │   ├── CategoryCard.tsx          # Category card with visual layers
│   │   ├── ArtworkCard.tsx           # Artwork card (admin view)
│   │   ├── LeadPipeline.tsx          # Kanban board for leads
│   │   ├── LeadCard.tsx              # Lead card in pipeline
│   │   ├── SectionBuilder.tsx        # Page section builder
│   │   ├── SeoScore.tsx              # SEO health score display
│   │   └── ChartWidget.tsx           # Reusable chart wrapper
│   ├── ui/                           # Shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── accordion.tsx
│   │   ├── slider.tsx
│   │   ├── switch.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── skeleton.tsx
│   │   └── toast.tsx
│   ├── Header.tsx                    # Public site header
│   ├── Footer.tsx                    # Public site footer
│   ├── Layout.tsx                    # Public site layout
│   ├── NavDrawer.tsx                 # Mobile navigation drawer
│   ├── WhatsAppBar.tsx               # Mobile WhatsApp bar
│   └── ...
├── hooks/
│   ├── useAdmin.ts                   # Admin auth check
│   ├── useMediaLibrary.ts            # Media library query hook
│   ├── useVisualAssets.ts            # Visual assets query hook
│   ├── useWebsiteContent.ts          # Website content query hook
│   ├── usePageSections.ts            # Page sections query hook
│   ├── useLeadPipeline.ts            # Lead pipeline data hook
│   ├── useWhatsappAnalytics.ts       # WhatsApp analytics hook
│   └── useDashboardMetrics.ts        # Dashboard metrics hook
├── lib/
│   ├── artworks.ts                   # Artwork data layer
│   ├── categories.ts                 # Category data layer
│   ├── tags.ts                       # Tag data layer
│   ├── faqs.ts                       # FAQ data layer
│   ├── seo.ts                        # SEO data layer
│   ├── commissions.ts               # Commission data layer
│   ├── redirects.ts                  # Redirect data layer
│   ├── storage.ts                    # Supabase Storage helpers
│   ├── admin.ts                      # Admin auth helpers
│   ├── media-library.ts             # Media library data layer
│   ├── visual-assets.ts             # Visual assets data layer
│   ├── website-content.ts           # Website content data layer
│   ├── page-sections.ts             # Page sections data layer
│   ├── leads.ts                      # Lead CRM data layer
│   ├── whatsapp-clicks.ts           # WhatsApp analytics data layer
│   ├── dashboard-metrics.ts          # Dashboard metrics data layer
│   └── index.ts                     # Barrel exports
├── routes/
│   ├── __root.tsx                    # Root layout (public)
│   ├── index.tsx                     # Homepage (public)
│   ├── about.tsx                     # About page (public)
│   ├── contact.tsx                   # Contact page (public)
│   ├── portfolio.tsx                 # Portfolio page (public)
│   ├── artwork.$slug.tsx             # Artwork detail (public)
│   ├── faq.tsx                       # FAQ page (public)
│   ├── admin/
│   │   ├── route.tsx                 # Admin layout (guarded)
│   │   ├── login.tsx                 # Admin login
│   │   ├── index.tsx                 # Dashboard
│   │   ├── artworks/
│   │   │   ├── index.tsx             # Artwork list
│   │   │   ├── new.tsx               # New artwork
│   │   │   └── edit.$id.tsx          # Edit artwork
│   │   ├── categories/
│   │   │   ├── index.tsx             # Category list
│   │   │   └── edit.$id.tsx          # Edit category
│   │   ├── faqs/
│   │   │   ├── index.tsx             # FAQ list
│   │   │   ├── new.tsx               # New FAQ
│   │   │   └── edit.$id.tsx          # Edit FAQ
│   │   ├── media/
│   │   │   ├── index.tsx             # Media library
│   │   │   └── $id.tsx               # Media detail
│   │   ├── visual-assets/
│   │   │   ├── index.tsx             # Visual assets list
│   │   │   └── edit.$id.tsx          # Edit visual asset
│   │   ├── website-content/
│   │   │   ├── index.tsx             # Website content overview
│   │   │   ├── homepage.tsx          # Homepage content
│   │   │   ├── about.tsx             # About page content
│   │   │   ├── contact.tsx           # Contact page content
│   │   │   └── footer.tsx            # Footer content
│   │   ├── pages/
│   │   │   ├── index.tsx             # Page list
│   │   │   └── $pageId.tsx           # Page editor (section builder)
│   │   ├── seo/
│   │   │   ├── index.tsx             # SEO dashboard
│   │   │   ├── pages.tsx             # Page SEO list
│   │   │   ├── artworks.tsx          # Artwork SEO bulk editor
│   │   │   ├── categories.tsx        # Category SEO bulk editor
│   │   │   └── redirects.tsx         # Redirect manager
│   │   ├── leads/
│   │   │   ├── index.tsx             # Lead list (table view)
│   │   │   ├── pipeline.tsx          # Lead pipeline (kanban)
│   │   │   ├── $id.tsx              # Lead detail
│   │   │   └── new.tsx               # New lead
│   │   ├── whatsapp/
│   │   │   ├── index.tsx             # WhatsApp settings
│   │   │   ├── analytics.tsx         # WhatsApp analytics
│   │   │   └── templates.tsx         # Message templates
│   │   └── settings/
│   │       └── index.tsx             # General settings
├── integrations/
│   └── supabase/
│       ├── client.ts                 # Supabase client
│       ├── types.ts                  # Generated types
│       ├── auth-middleware.ts        # Auth middleware
│       └── auth-attacher.ts         # Auth attacher
├── styles.css                        # Global styles + Tailwind
├── router.tsx                        # Router configuration
├── start.ts                          # TanStack Start config
├── server.ts                         # Server entry (SSR)
└── vite.config.ts                    # Vite config
```

---

## Supabase Migration Plan

### Migration 1: Core Extensions

```sql
-- Extend existing tables with Phase 1 fields
-- Add new core tables (artwork_series, artwork_templates, etc.)
-- Add visual_asset_overlays (predefined)
```

### Migration 2: Media & Content

```sql
-- Create media_library, media_variants, media_usage_log
-- Create website_content, website_content_repeater_items
-- Create visual_assets, visual_asset_usage_log
```

### Migration 3: Business Modules

```sql
-- Create leads, lead_activities, lead_tags, lead_tag_items
-- Create whatsapp_clicks, whatsapp_click_daily_rollup
-- Create dashboard_metrics, dashboard_activity_feed
```

### Migration 4: Pages & SEO

```sql
-- Create pages, page_sections, section_type_definitions
-- Create sitemap_entries, seo_page_inventory
-- Create faq_sections, artwork_faqs, category_faqs
-- Add indexes and RLS policies
```

### Migration 5: Content Seeding

```sql
-- Seed predefined visual assets (overlays, textures)
-- Seed section type definitions
-- Seed default website content (homepage, about, contact, footer)
-- Seed default pages and sections
-- Seed FAQ sections
```

---

## API Design

### REST API Structure

```
/api/admin/
├── GET    /dashboard                      → DashboardData
├── GET    /dashboard/metrics              → MetricsResponse
├── GET    /dashboard/activity             → ActivityItem[]
│
├── GET    /artworks                     → Artwork[] (paginated)
├── POST   /artworks                     → Artwork
├── GET    /artworks/:id                 → Artwork
├── PUT    /artworks/:id                 → Artwork
├── DELETE /artworks/:id                 → void
├── POST   /artworks/:id/duplicate       → Artwork
│
├── GET    /categories                   → Category[]
├── POST   /categories                   → Category
├── GET    /categories/:id               → Category
├── PUT    /categories/:id               → Category
├── DELETE /categories/:id             → void
│
├── GET    /faqs                         → FAQ[]
├── POST   /faqs                         → FAQ
├── GET    /faqs/:id                     → FAQ
├── PUT    /faqs/:id                     → FAQ
├── DELETE /faqs/:id                     → void
│
├── GET    /media                        → MediaItem[] (paginated)
├── POST   /media/upload                 → MediaItem
├── GET    /media/:id                    → MediaItem
├── GET    /media/:id/usage              → MediaUsageResponse
├── DELETE /media/:id                    → void
│
├── GET    /visual-assets                → VisualAsset[]
├── POST   /visual-assets                → VisualAsset
├── GET    /visual-assets/:id            → VisualAsset
├── PUT    /visual-assets/:id            → VisualAsset
│
├── GET    /website-content              → WebsiteContent[]
├── PUT    /website-content/:key         → WebsiteContent
│
├── GET    /pages                        → Page[]
├── GET    /pages/:id/sections           → PageSection[]
├── POST   /pages/:id/sections           → PageSection
├── PUT    /pages/:id/sections/:sid      → PageSection
├── DELETE /pages/:id/sections/:sid      → void
│
├── GET    /seo/pages                    → SEOPage[]
├── PUT    /seo/pages/:id              → SEOMetadata
├── GET    /seo/artworks                 → SEOArtwork[]
├── PUT    /seo/artworks/:id             → SEOMetadata
├── GET    /seo/categories               → SEOCategory[]
├── PUT    /seo/categories/:id           → SEOMetadata
├── GET    /seo/redirects              → Redirect[]
├── POST   /seo/redirects              → Redirect
├── PUT    /seo/redirects/:id          → Redirect
├── DELETE /seo/redirects/:id          → void
│
├── GET    /leads                      → Lead[] (paginated)
├── POST   /leads                      → Lead
├── GET    /leads/:id                  → Lead
├── PUT    /leads/:id                  → Lead
├── POST   /leads/:id/activities       → LeadActivity
├── GET    /leads/pipeline             → LeadPipelineData
│
├── GET    /whatsapp/settings          → WhatsAppSettings
├── PUT    /whatsapp/settings          → WhatsAppSettings
├── GET    /whatsapp/analytics         → WhatsAppAnalytics
├── GET    /whatsapp/templates         → MessageTemplate[]
```

---

## Production Rollout Plan

### Pre-Launch (1 week before)

1. [ ] Run all Supabase migrations on production database
2. [ ] Seed predefined visual assets and overlays
3. [ ] Seed default website content (homepage, about, contact, footer)
4. [ ] Upload all existing artwork images to Media Library
5. [ ] Link existing artworks to media_library entries
6. [ ] Set up all category visual assets (card images, overlays)
7. [ ] Configure WhatsApp settings (number, CTA text, floating button)
8. [ ] Set up SEO metadata for all pages
9. [ ] Test admin login and all CRUD operations
10. [ ] Test public site (no broken images, all content loads)

### Launch Day

1. [ ] Deploy to Vercel (production branch)
2. [ ] Verify build succeeds with post-build script
3. [ ] Test admin dashboard loads
4. [ ] Test artwork CRUD end-to-end
5. [ ] Test category visual system (real artwork images, overlays)
6. [ ] Test media library upload and usage tracking
7. [ ] Test website content editing (homepage text changes)
8. [ ] Test FAQ management
9. [ ] Test SEO metadata editing
10. [ ] Test lead capture and CRM
11. [ ] Test WhatsApp CTA clicks and analytics
12. [ ] Monitor Vercel Function Logs for errors

### Post-Launch (Week 1)

1. [ ] Train business owner on admin usage
2. [ ] Document common workflows (add artwork, edit category, change homepage text)
3. [ ] Monitor analytics (traffic, leads, WhatsApp clicks)
4. [ ] Collect feedback from business owner
5. [ ] Fix any critical bugs
6. [ ] Optimize performance based on Core Web Vitals

### Success Criteria

| Metric                                                            | Target |
| ----------------------------------------------------------------- | ------ |
| Business owner can add artwork without developer help             | ✅     |
| Business owner can edit homepage text without developer help      | ✅     |
| Business owner can replace category images without developer help | ✅     |
| Business owner can manage FAQs without developer help             | ✅     |
| Business owner can edit SEO metadata without developer help       | ✅     |
| Business owner can view and manage leads without developer help   | ✅     |
| Business owner can view WhatsApp analytics without developer help | ✅     |
| No hardcoded text remains on the website                          | ✅     |
| No hardcoded images remain on the website                         | ✅     |
| Category cards always show real artwork images                    | ✅     |

---

**Document Version:** 1.0  
**Date:** 2025-06-24  
**Status:** Implementation Architecture  
**Next Step:** Approve priority order and begin Sprint 1 implementation
