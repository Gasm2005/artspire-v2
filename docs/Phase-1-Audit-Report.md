# Artspire V2 — CMS Phase 1 Audit Report

> **Date:** 2025-07-07  
> **Scope:** Phase 1 Implementation (13 modules)  
> **Source of Truth:** `docs/CMS-Architecture-Blueprint.md` + `docs/Phase-1-Implementation-Architecture.md`

---

## 1. EXISTING IMPLEMENTATION

### 1.1 Database (Already Exists)

| Table                 | Status      | Notes                                                                                                                                                                                                                                                                  |
| --------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `artworks`            | ✅ Partial  | Has 35 columns. Missing: `short_description`, `main_image_id`, `thumbnail_image_id`, `before_image_id`, `after_image_id`, `scheduled_publish_at`, `view_count`, `inquiry_count`, `created_by`, `updated_by`                                                            |
| `categories`          | ✅ Partial  | Missing: `short_summary`, `featured`, `card_artwork_image_id`, `card_overlay_id`, `card_overlay_opacity`, `card_gradient_style`, `card_text_position`, `banner_artwork_image_id`, `banner_overlay_id`, `thumbnail_image_id`, `og_image_id`, `created_by`, `updated_by` |
| `tags`                | ✅ Complete | Basic name/slug table                                                                                                                                                                                                                                                  |
| `artwork_tags`        | ✅ Partial  | Missing `display_order`                                                                                                                                                                                                                                                |
| `faqs`                | ✅ Partial  | Missing: `section_id`, `status`, `schema_type`, `created_by`, `updated_by`                                                                                                                                                                                             |
| `seo_metadata`        | ✅ Partial  | Missing: `og_image_id`, `twitter_card`, `twitter_image_id`, `robots_meta`, `canonical_url`, `schema_type`, `custom_schema`, `seo_score` (generated), `updated_by`                                                                                                      |
| `profiles`            | ✅ Complete | `id`, `role`, `display_name`, `avatar_url`, `created_at`, `updated_at`                                                                                                                                                                                                 |
| `redirects`           | ✅ Complete | Basic from_path/to_path/reason                                                                                                                                                                                                                                         |
| `commission_requests` | ✅ Complete | Standard inquiry table                                                                                                                                                                                                                                                 |

### 1.2 Admin UI (Already Exists)

| Route                      | File                                     | Status                                                          |
| -------------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| `/admin`                   | `src/routes/admin/index.tsx`             | ✅ Basic dashboard (4 stat cards)                               |
| `/admin/login`             | `src/routes/admin/login.tsx`             | ✅ Admin login with Supabase auth                               |
| `/admin/artworks`          | `src/routes/admin/artworks/index.tsx`    | ✅ List with filters (all/published/draft/archived)             |
| `/admin/artworks/new`      | `src/routes/admin/artworks/new.tsx`      | ✅ Create form                                                  |
| `/admin/artworks/edit/$id` | `src/routes/admin/artworks/edit.$id.tsx` | ✅ Edit form with loader                                        |
| `/admin` layout            | `src/routes/admin/route.tsx`             | ✅ Basic top bar + mobile nav (only Dashboard + Artworks links) |

### 1.3 Data Layer (Lib Files)

| File                     | Status      | Coverage                                                                                               |
| ------------------------ | ----------- | ------------------------------------------------------------------------------------------------------ |
| `src/lib/artworks.ts`    | ✅ Partial  | CRUD, slug gen, tags, publish/unpublish/archive. No media linkage, no gallery/process image management |
| `src/lib/categories.ts`  | ✅ Partial  | Basic CRUD. No visual asset management, no gallery/FAQ linkage                                         |
| `src/lib/faqs.ts`        | ✅ Partial  | Basic CRUD + reorder. No sections, no schema type                                                      |
| `src/lib/seo.ts`         | ✅ Partial  | Upsert + structured data helpers. No health score, no page inventory                                   |
| `src/lib/storage.ts`     | ✅ Partial  | Upload to `artwork-images` bucket only. No media library integration, no variants                      |
| `src/lib/admin.ts`       | ✅ Complete | Auth check, profile, sign out                                                                          |
| `src/lib/whatsapp.ts`    | ✅ Minimal  | Hardcoded number + link generator. No settings, no analytics                                           |
| `src/lib/commissions.ts` | ✅ Complete | Full CRUD for commission_requests                                                                      |
| `src/lib/redirects.ts`   | ✅ Complete | Not audited in detail, presumed complete                                                               |
| `src/lib/tags.ts`        | ✅ Complete | Presumed complete                                                                                      |
| `src/lib/index.ts`       | ✅ Complete | Barrel exports                                                                                         |

### 1.4 Components (Already Exists)

| Component                        | Status                                                       |
| -------------------------------- | ------------------------------------------------------------ |
| `ArtworkForm.tsx`                | ✅ Full create/edit form with image upload, tags, categories |
| `ImageUploader.tsx`              | ✅ Single image upload with preview                          |
| `ImageWithFallback.tsx`          | ✅ Image with fallback handling                              |
| `BeforeAfterSlider.tsx`          | ✅ Public before/after slider                                |
| `Header.tsx`                     | ✅ Public header with hardcoded logo, nav, WhatsApp CTA      |
| `Footer.tsx`                     | ✅ Public footer with hardcoded links, text, social icons    |
| `Layout.tsx`                     | ✅ Public page wrapper                                       |
| `NavDrawer.tsx`                  | ✅ Mobile navigation drawer                                  |
| `WhatsAppBar.tsx`                | ✅ Mobile WhatsApp bar                                       |
| All `ui/*.tsx` shadcn components | ✅ Complete library                                          |

### 1.5 Public Pages (Already Exists)

| Route            | File                           | Notes                                                                  |
| ---------------- | ------------------------------ | ---------------------------------------------------------------------- |
| `/`              | `src/routes/index.tsx`         | Homepage with ALL images hardcoded (Unsplash URLs), ALL text hardcoded |
| `/about`         | `src/routes/about.tsx`         | Presumed hardcoded                                                     |
| `/contact`       | `src/routes/contact.tsx`       | Presumed hardcoded                                                     |
| `/faq`           | `src/routes/faq.tsx`           | Reads from DB but page structure is hardcoded                          |
| `/portfolio`     | `src/routes/portfolio.tsx`     | Presumed hardcoded                                                     |
| `/pricing`       | `src/routes/pricing.tsx`       | Presumed hardcoded                                                     |
| `/services`      | `src/routes/services.tsx`      | Presumed hardcoded                                                     |
| `/artwork/$slug` | `src/routes/artwork.$slug.tsx` | Dynamic, reads from DB                                                 |

### 1.6 Infrastructure

| Item                                             | Status |
| ------------------------------------------------ | ------ |
| TanStack Start + React 19 + Tailwind v4 + Vite 7 | ✅     |
| Supabase client + auth + types                   | ✅     |
| Vercel deployment                                | ✅     |
| `artwork-images` storage bucket                  | ✅     |
| `avatars` storage bucket                         | ✅     |
| Post-build script                                | ✅     |
| `is_admin()` RPC function                        | ✅     |

---

## 2. MISSING IMPLEMENTATION

### 2.1 Database Tables (NOT Created)

#### Sprint 1: Foundation (Critical)

| Table                            | Module                  | Priority |
| -------------------------------- | ----------------------- | -------- |
| `media_library`                  | Media Library           | 🔴 P0    |
| `media_variants`                 | Media Library           | 🔴 P0    |
| `media_usage_log`                | Media Library           | 🔴 P0    |
| `visual_assets`                  | Visual Asset Manager    | 🔴 P0    |
| `visual_asset_usage_log`         | Visual Asset Manager    | 🔴 P0    |
| `visual_asset_overlays`          | Category Management     | 🔴 P0    |
| `website_content`                | Website Content Manager | 🔴 P0    |
| `website_content_repeater_items` | Website Content Manager | 🔴 P0    |
| `category_gallery_images`        | Category Management     | 🟡 P1    |
| `category_faqs`                  | Category Management     | 🟡 P1    |

#### Sprint 2: Content

| Table                      | Module               | Priority |
| -------------------------- | -------------------- | -------- |
| `artwork_gallery_images`   | Artwork Management   | 🟡 P1    |
| `artwork_process_images`   | Artwork Management   | 🟡 P1    |
| `faq_sections`             | FAQ Management       | 🟡 P1    |
| `artwork_faqs`             | FAQ Management       | 🟡 P1    |
| `pages`                    | Page Section Manager | 🟡 P1    |
| `page_sections`            | Page Section Manager | 🟡 P1    |
| `section_type_definitions` | Page Section Manager | 🟡 P1    |
| `sitemap_entries`          | SEO Center           | 🟡 P1    |
| `seo_page_inventory`       | SEO Center           | 🟡 P1    |

#### Sprint 3: Business

| Table                         | Module          | Priority |
| ----------------------------- | --------------- | -------- |
| `leads`                       | Lead Center     | 🟢 P2    |
| `lead_activities`             | Lead Center     | 🟢 P2    |
| `lead_tags`                   | Lead Center     | 🟢 P2    |
| `lead_tag_items`              | Lead Center     | 🟢 P2    |
| `whatsapp_clicks`             | WhatsApp Center | 🟢 P2    |
| `whatsapp_click_daily_rollup` | WhatsApp Center | 🟢 P2    |
| `dashboard_metrics`           | Dashboard       | 🟢 P2    |
| `dashboard_activity_feed`     | Dashboard       | 🟢 P2    |

#### Sprint 4: Future (Not Phase 1)

| Table                    | Module              | Priority |
| ------------------------ | ------------------- | -------- |
| `artwork_series`         | Artwork Management  | ⚪ P3    |
| `artwork_templates`      | Artwork Management  | ⚪ P3    |
| `artwork_versions`       | Artwork Management  | ⚪ P3    |
| `category_tree`          | Category Management | ⚪ P3    |
| `category_analytics`     | Category Management | ⚪ P3    |
| `testimonials`           | Testimonials        | ⚪ P3    |
| `testimonial_categories` | Testimonials        | ⚪ P3    |
| `portfolios`             | Portfolio           | ⚪ P3    |
| `lead_quotes`            | Lead Center         | ⚪ P3    |
| `lead_orders`            | Lead Center         | ⚪ P3    |
| `lead_follow_ups`        | Lead Center         | ⚪ P3    |
| `message_templates`      | WhatsApp Center     | ⚪ P3    |
| `page_speed_monitoring`  | SEO Center          | ⚪ P3    |
| `index_monitoring`       | SEO Center          | ⚪ P3    |
| `keyword_rankings`       | SEO Center          | ⚪ P3    |
| `backlink_monitoring`    | SEO Center          | ⚪ P3    |

### 2.2 Database Extensions (ALTER TABLE)

| Table          | Missing Columns                                                                                                                                                                                                                                               | Module              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `artworks`     | `short_description`, `main_image_id`, `thumbnail_image_id`, `before_image_id`, `after_image_id`, `scheduled_publish_at`, `view_count`, `inquiry_count`, `created_by`, `updated_by`                                                                            | Artwork Management  |
| `categories`   | `short_summary`, `featured`, `card_artwork_image_id`, `card_overlay_id`, `card_overlay_opacity`, `card_gradient_style`, `card_text_position`, `banner_artwork_image_id`, `banner_overlay_id`, `thumbnail_image_id`, `og_image_id`, `created_by`, `updated_by` | Category Management |
| `artwork_tags` | `display_order`                                                                                                                                                                                                                                               | Artwork Management  |
| `faqs`         | `section_id`, `status`, `schema_type`, `created_by`, `updated_by`                                                                                                                                                                                             | FAQ Management      |
| `seo_metadata` | `og_image_id`, `twitter_card`, `twitter_image_id`, `robots_meta`, `canonical_url`, `schema_type`, `custom_schema`, `seo_score` (generated), `updated_by`                                                                                                      | SEO Center          |

### 2.3 Admin UI Routes (NOT Created)

| Route                             | File                                            | Module                  | Priority |
| --------------------------------- | ----------------------------------------------- | ----------------------- | -------- |
| `/admin/categories`               | `src/routes/admin/categories/index.tsx`         | Category Management     | 🔴 P0    |
| `/admin/categories/edit/$id`      | `src/routes/admin/categories/edit.$id.tsx`      | Category Management     | 🔴 P0    |
| `/admin/media`                    | `src/routes/admin/media/index.tsx`              | Media Library           | 🔴 P0    |
| `/admin/media/$id`                | `src/routes/admin/media/$id.tsx`                | Media Library           | 🔴 P0    |
| `/admin/visual-assets`            | `src/routes/admin/visual-assets/index.tsx`      | Visual Asset Manager    | 🔴 P0    |
| `/admin/visual-assets/edit/$id`   | `src/routes/admin/visual-assets/edit.$id.tsx`   | Visual Asset Manager    | 🔴 P0    |
| `/admin/website-content`          | `src/routes/admin/website-content/index.tsx`    | Website Content Manager | 🔴 P0    |
| `/admin/website-content/homepage` | `src/routes/admin/website-content/homepage.tsx` | Website Content Manager | 🔴 P0    |
| `/admin/website-content/about`    | `src/routes/admin/website-content/about.tsx`    | Website Content Manager | 🔴 P0    |
| `/admin/website-content/contact`  | `src/routes/admin/website-content/contact.tsx`  | Website Content Manager | 🔴 P0    |
| `/admin/website-content/footer`   | `src/routes/admin/website-content/footer.tsx`   | Website Content Manager | 🔴 P0    |
| `/admin/faqs`                     | `src/routes/admin/faqs/index.tsx`               | FAQ Management          | 🟡 P1    |
| `/admin/faqs/new`                 | `src/routes/admin/faqs/new.tsx`                 | FAQ Management          | 🟡 P1    |
| `/admin/faqs/edit/$id`            | `src/routes/admin/faqs/edit.$id.tsx`            | FAQ Management          | 🟡 P1    |
| `/admin/faqs/sections`            | `src/routes/admin/faqs/sections.tsx`            | FAQ Management          | 🟡 P1    |
| `/admin/seo`                      | `src/routes/admin/seo/index.tsx`                | SEO Center              | 🟡 P1    |
| `/admin/seo/pages`                | `src/routes/admin/seo/pages.tsx`                | SEO Center              | 🟡 P1    |
| `/admin/seo/artworks`             | `src/routes/admin/seo/artworks.tsx`             | SEO Center              | 🟡 P1    |
| `/admin/seo/categories`           | `src/routes/admin/seo/categories.tsx`           | SEO Center              | 🟡 P1    |
| `/admin/seo/redirects`            | `src/routes/admin/seo/redirects.tsx`            | SEO Center              | 🟡 P1    |
| `/admin/leads`                    | `src/routes/admin/leads/index.tsx`              | Lead Center             | 🟢 P2    |
| `/admin/leads/pipeline`           | `src/routes/admin/leads/pipeline.tsx`           | Lead Center             | 🟢 P2    |
| `/admin/leads/$id`                | `src/routes/admin/leads/$id.tsx`                | Lead Center             | 🟢 P2    |
| `/admin/leads/new`                | `src/routes/admin/leads/new.tsx`                | Lead Center             | 🟢 P2    |
| `/admin/whatsapp`                 | `src/routes/admin/whatsapp/index.tsx`           | WhatsApp Center         | 🟢 P2    |
| `/admin/whatsapp/analytics`       | `src/routes/admin/whatsapp/analytics.tsx`       | WhatsApp Center         | 🟢 P2    |
| `/admin/whatsapp/templates`       | `src/routes/admin/whatsapp/templates.tsx`       | WhatsApp Center         | 🟢 P2    |
| `/admin/pages`                    | `src/routes/admin/pages/index.tsx`              | Page Section Manager    | 🟡 P1    |
| `/admin/pages/$pageId`            | `src/routes/admin/pages/$pageId.tsx`            | Page Section Manager    | 🟡 P1    |
| `/admin/settings`                 | `src/routes/admin/settings/index.tsx`           | Settings                | 🟢 P2    |

### 2.4 Data Layer (Lib Files NOT Created)

| File                           | Module                  | Priority |
| ------------------------------ | ----------------------- | -------- |
| `src/lib/media-library.ts`     | Media Library           | 🔴 P0    |
| `src/lib/visual-assets.ts`     | Visual Asset Manager    | 🔴 P0    |
| `src/lib/website-content.ts`   | Website Content Manager | 🔴 P0    |
| `src/lib/page-sections.ts`     | Page Section Manager    | 🟡 P1    |
| `src/lib/leads.ts`             | Lead Center             | 🟢 P2    |
| `src/lib/whatsapp-clicks.ts`   | WhatsApp Center         | 🟢 P2    |
| `src/lib/dashboard-metrics.ts` | Dashboard               | 🟢 P2    |

### 2.5 Components (NOT Created)

| Component                | Purpose                                | Module               | Priority |
| ------------------------ | -------------------------------------- | -------------------- | -------- |
| `AdminSidebar.tsx`       | Full navigation sidebar                | Admin Navigation     | 🔴 P0    |
| `AdminMobileNav.tsx`     | Bottom tab bar (mobile)                | Admin Navigation     | 🔴 P0    |
| `AdminHeader.tsx`        | Top bar with search + profile          | Admin Navigation     | 🔴 P0    |
| `MediaPicker.tsx`        | Modal to pick from media library       | Media Library        | 🔴 P0    |
| `MultiImageUploader.tsx` | Multiple image upload + gallery        | Media Library        | 🔴 P0    |
| `CategoryCard.tsx`       | Category card with visual layers       | Category Management  | 🔴 P0    |
| `DataTable.tsx`          | Reusable sortable/filterable table     | Shared               | 🟡 P1    |
| `StatusBadge.tsx`        | Status pill (published/draft/archived) | Shared               | 🟡 P1    |
| `RichTextEditor.tsx`     | TipTap editor wrapper                  | Shared               | 🟡 P1    |
| `LeadPipeline.tsx`       | Kanban board for leads                 | Lead Center          | 🟢 P2    |
| `LeadCard.tsx`           | Lead card in pipeline                  | Lead Center          | 🟢 P2    |
| `SectionBuilder.tsx`     | Page section builder                   | Page Section Manager | 🟡 P1    |
| `SeoScore.tsx`           | SEO health score display               | SEO Center           | 🟡 P1    |
| `ChartWidget.tsx`        | Reusable chart wrapper                 | Dashboard            | 🟢 P2    |
| `KpiCard.tsx`            | Dashboard KPI card                     | Dashboard            | 🟢 P2    |
| `ActivityFeed.tsx`       | Dashboard activity list                | Dashboard            | 🟢 P2    |

### 2.6 Hooks (NOT Created)

| Hook                      | Purpose                    | Priority |
| ------------------------- | -------------------------- | -------- |
| `useMediaLibrary.ts`      | Media library query hook   | 🔴 P0    |
| `useVisualAssets.ts`      | Visual assets query hook   | 🔴 P0    |
| `useWebsiteContent.ts`    | Website content query hook | 🔴 P0    |
| `usePageSections.ts`      | Page sections query hook   | 🟡 P1    |
| `useLeadPipeline.ts`      | Lead pipeline data hook    | 🟢 P2    |
| `useWhatsappAnalytics.ts` | WhatsApp analytics hook    | 🟢 P2    |
| `useDashboardMetrics.ts`  | Dashboard metrics hook     | 🟢 P2    |

---

## 3. CRITICAL GAPS

### 3.1 Visual Asset Gap (SEVERE)

**The entire website is using hardcoded images:**

- Homepage hero: 4 Unsplash images hardcoded in `src/routes/index.tsx`
- Services section: 6 Unsplash images hardcoded
- Before/After: 6 Unsplash images hardcoded
- Recent Work: 6 hardcoded cards with CSS pattern backgrounds (no real artwork)
- Category cards: CSS pattern classes only (`art-cat-sketches`, etc.) — no real artwork images
- Gift section: 4 Unsplash images hardcoded
- About section: 1 Unsplash image hardcoded
- Header logo: `/artspire-Logo.svg` (file-based, not CMS-managed)
- Footer: Hardcoded social links, text, email, phone
- WhatsApp number: Hardcoded in `src/lib/whatsapp.ts`

**This violates the core requirement:** _"The CMS must control ALL website visuals."_

### 3.2 Content Management Gap (SEVERE)

**All text on the website is hardcoded:**

- Homepage hero heading, subheading, CTA text
- Trust strip text
- Services section titles, descriptions, prices
- How it works steps
- Testimonials (quotes + names)
- About Himangi section
- Footer all columns
- Contact page info
- FAQ page structure

**No `website_content` table exists.** The business owner cannot change a single word without a developer.

### 3.3 Category Visual System Gap (SEVERE)

Categories currently use CSS pattern classes (`art-cat-sketches`, `art-cat-portraits`, etc.) with no real artwork images. The Phase 1 architecture **requires** real artwork images on every category card with:

- Layer 1: Real artwork image (80% visual weight)
- Layer 2: Decorative overlay (10%)
- Layer 3: Gradient overlay (5%)
- Layer 4: Text (5%)

### 3.4 Media Management Gap (SEVERE)

- No centralized media library
- Images are uploaded directly to `artwork-images` bucket with no metadata tracking
- No usage tracking (can't tell where an image is used)
- No variant generation (thumbnail, medium, large, WebP)
- No alt text management beyond the artwork table
- No delete prevention based on usage

### 3.5 Admin Navigation Gap (HIGH)

Current admin nav only has: Dashboard + Artworks. The architecture requires 13+ modules with grouped sidebar navigation.

---

## 4. SUMMARY

| Category            | Existing | Missing           | Completion |
| ------------------- | -------- | ----------------- | ---------- |
| Database Tables     | 9        | 22+               | ~29%       |
| Database Extensions | 0        | 5 ALTER TABLE ops | 0%         |
| Admin Routes        | 4        | 28+               | ~13%       |
| Data Layer (lib)    | 10       | 7                 | ~59%       |
| Reusable Components | 10       | 15+               | ~40%       |
| Hooks               | 2        | 7                 | ~22%       |
| **OVERALL**         | **~35**  | **~85**           | **~29%**   |

---

_Next: See `docs/Phase-1-Implementation-Plan.md` for the detailed implementation roadmap._
