# Artspire CMS Architecture Blueprint

## Product Architecture for India's Leading Custom Artwork Platform

**Version:** 1.0  
**Date:** 2025-06-24  
**Status:** Strategic Architecture Document

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Content Center](#section-1-content-center)
3. [Lead Center (CRM)](#section-2-lead-center)
4. [SEO Center](#section-3-seo-center)
5. [AEO Center (Answer Engine Optimization)](#section-4-aeo-center)
6. [GEO Center (Generative Engine Optimization)](#section-5-geo-center)
7. [AI Visibility Center](#section-6-ai-visibility-center)
8. [Analytics Center](#section-7-analytics-center)
9. [Knowledge Center](#section-8-knowledge-center)
10. [Automation Center](#section-9-automation-center)
11. [Permissions & Roles](#section-10-permissions--roles)
12. [Database Architecture](#section-11-database-architecture)
13. [Future Roadmap](#section-12-future-roadmap)

---

## Executive Summary

### Vision

Artspire is not just a custom artwork website. It is the **operating system for custom art in India** — a platform that connects artists, customers, and art lovers through technology, AI, and search visibility.

### Current State

- Custom artwork platform with 6 categories
- Manual inquiry process via WhatsApp
- Static content with basic SEO
- No CRM, no analytics, no automation

### Target State (12-24 Months)

- **Content Hub:** AI-assisted content creation, dynamic portfolios, automated testimonials
- **Lead Engine:** Full CRM with WhatsApp integration, sales pipeline, automated follow-ups
- **SEO Operating System:** Technical SEO, schema automation, index monitoring, rank tracking
- **AI Visibility:** Answer Engine Optimization, Generative Engine Optimization, AI crawler tracking
- **Marketplace V1:** Artist onboarding, commission marketplace, rating system
- **Analytics Intelligence:** Business intelligence dashboards, predictive lead scoring

### Architecture Philosophy

1. **Database-First:** Every module starts with data model design
2. **API-First:** All modules expose REST/GraphQL APIs for future integrations
3. **AI-Native:** Every feature considers AI consumption (not just human consumption)
4. **SEO-First:** Every content piece has structured data, semantic markup, and entity relationships
5. **Scalable:** Tables designed for 10x growth without schema changes
6. **Audit-Everything:** Every change is logged, versioned, and recoverable

---

## Section 1: Content Center

### 1.1 Artwork Management

#### Why This Module Exists

Artwork is the core product. Without a world-class artwork management system, the platform cannot scale. This module must handle:

- Single artworks (unique pieces)
- Commission artworks (custom orders)
- Series/collections (themed groups)
- Templates (starting points for commissions)

#### Database Tables

```sql
-- artworks (already exists - extend)
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS
  series_id uuid REFERENCES artwork_series(id),
  template_id uuid REFERENCES artwork_templates(id),
  commission_template boolean DEFAULT false,
  estimated_days integer, -- for commissions
  difficulty_level integer CHECK (difficulty_level BETWEEN 1 AND 5),
  materials jsonb, -- {"pencil": true, "charcoal": true}
  color_palette jsonb, -- ["#2C3E50", "#E74C3C"]
  mood_tags text[], -- ["romantic", "vibrant", "minimal"]
  occasion_tags text[], -- ["wedding", "birthday", "anniversary"]
  ai_generated_description text, -- AI-generated rich description
  ai_keywords text[], -- AI-extracted keywords for SEO
  content_score integer CHECK (content_score BETWEEN 0 AND 100),
  last_content_review_at timestamptz,
  version integer DEFAULT 1,
  created_by uuid REFERENCES profiles(id),
  updated_by uuid REFERENCES profiles(id);

-- artwork_series
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

-- artwork_templates
CREATE TABLE artwork_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  base_image_url text,
  category_id uuid REFERENCES categories(id),
  base_price numeric(10,2),
  customizable_fields jsonb, -- [{"field": "photo", "required": true}]
  estimated_days integer,
  difficulty_level integer,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- artwork_versions (audit trail)
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

-- artwork_media (media library linkage)
CREATE TABLE artwork_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id uuid REFERENCES artworks(id) ON DELETE CASCADE,
  media_id uuid REFERENCES media_library(id),
  media_type text CHECK (media_type IN ('primary', 'gallery', 'process', 'detail', 'video')),
  display_order integer DEFAULT 0,
  caption text,
  alt_text text,
  created_at timestamptz DEFAULT now()
);
```

#### Workflows Enabled

1. **Artwork Creation Flow:**
   - Admin creates artwork → Auto-generates slug → AI generates description/keywords → Content score calculated → Publish

2. **Commission Template Flow:**
   - Admin creates template → Sets customizable fields → Customer selects template → Uploads photo → System generates quote → Artist confirms

3. **Series Management Flow:**
   - Create series → Add artworks → Set series order → Auto-generates series landing page → Series SEO metadata → Publish

4. **Content Freshness Workflow:**
   - System tracks `last_content_review_at` → Alerts when artwork > 90 days old → Suggests AI refresh → Admin approves → Version incremented

#### Business Growth Impact

- **Scalability:** Series and templates enable bulk content creation
- **SEO:** AI-generated descriptions and keywords improve organic reach
- **Commissions:** Templates reduce quote time from hours to minutes
- **Analytics:** Content score helps prioritize which artworks to optimize

---

### 1.2 Category Management

#### Why This Module Exists

Categories are the primary navigation and SEO structure. They must support:

- Hierarchical navigation (parent/child)
- Landing pages with rich content
- Filtered artwork grids
- SEO-optimized URLs

#### Database Tables

```sql
-- categories (already exists - extend)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS
  parent_id uuid REFERENCES categories(id),
  depth integer DEFAULT 0,
  breadcrumb text[], -- ["Artworks", "Pencil Sketches", "Portrait Pencils"]
  landing_page_content jsonb, -- TipTap JSON for rich landing pages
  meta_title text,
  meta_description text,
  og_image_url text,
  faq_section_id uuid REFERENCES faq_sections(id),
  featured_artworks uuid[], -- Array of featured artwork IDs
  sort_options jsonb, -- [{"label": "Price: Low to High", "field": "price", "direction": "asc"}]
  filter_schema jsonb, -- [{"field": "price", "type": "range", "min": 0, "max": 50000}]
  created_by uuid REFERENCES profiles(id),
  updated_by uuid REFERENCES profiles(id);

-- category_tree (materialized path for fast queries)
CREATE TABLE category_tree (
  ancestor_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  descendant_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  depth integer DEFAULT 0,
  PRIMARY KEY (ancestor_id, descendant_id)
);

-- category_analytics
CREATE TABLE category_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  date date NOT NULL,
  page_views integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  artwork_clicks integer DEFAULT 0,
  inquiries integer DEFAULT 0,
  conversions integer DEFAULT 0,
  avg_time_on_page numeric(10,2),
  bounce_rate numeric(5,2),
  created_at timestamptz DEFAULT now()
);
```

#### Workflows Enabled

1. **Category Creation:**
   - Create category → Set parent → Auto-calculates depth and breadcrumb → Builds materialized path → Generates landing page → SEO optimization → Publish

2. **Category Reorganization:**
   - Move category → Updates all descendant breadcrumbs → Updates materialized path → Regenerates URLs → 301 redirects old URLs

3. **Featured Content Rotation:**
   - System tracks category analytics → Identifies underperforming categories → Suggests new featured artworks → Admin approves → Auto-updates

#### Business Growth Impact

- **SEO:** Hierarchical categories create natural topic clusters
- **UX:** Breadcrumbs and filters improve conversion rates
- **Analytics:** Category-level metrics identify growth opportunities
- **Scalability:** Materialized path enables fast subtree queries

---

### 1.3 FAQ Management

#### Why This Module Exists

FAQs serve three audiences:

1. **Humans:** Reduce support tickets, improve conversion
2. **Search Engines:** Rich snippets, featured snippets
3. **AI Models:** Training data for answer engines

#### Database Tables (Existing - Extended)

```sql
-- faq_sections (group FAQs by topic)
CREATE TABLE faq_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  entity_type text CHECK (entity_type IN ('global', 'artwork', 'category', 'service', 'commission')),
  entity_id uuid, -- nullable, for artwork/category-specific sections
  display_order integer DEFAULT 0,
  schema_type text DEFAULT 'FAQPage', -- FAQPage, QAPage, etc.
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- faqs (already exists - extend)
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS
  section_id uuid REFERENCES faq_sections(id),
  ai_answer text, -- AI-generated answer for AEO
  ai_confidence_score numeric(3,2), -- 0.00 to 1.00
  source_url text, -- where this answer was sourced from
  last_verified_at timestamptz,
  verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified', 'outdated')),
  search_volume integer, -- monthly search volume for this question
  difficulty_score integer CHECK (difficulty_score BETWEEN 0 AND 100),
  featured_snippet_target boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id),
  updated_by uuid REFERENCES profiles(id);

-- faq_clusters (group related questions for topic coverage)
CREATE TABLE faq_clusters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  primary_keyword text,
  related_keywords text[],
  target_entity text, -- "Artspire", "Pencil Sketches", "Custom Portraits"
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- faq_cluster_items (junction)
CREATE TABLE faq_cluster_items (
  cluster_id uuid REFERENCES faq_clusters(id) ON DELETE CASCADE,
  faq_id uuid REFERENCES faqs(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  PRIMARY KEY (cluster_id, faq_id)
);
```

#### Workflows Enabled

1. **FAQ Creation:**
   - Admin asks question → AI generates answer → Admin edits → SEO score calculated → Assign to cluster → Publish

2. **AEO Optimization:**
   - System identifies high-search-volume questions → AI generates optimized answers → Verification workflow → Mark as featured snippet target → Track performance

3. **FAQ Refresh:**
   - System tracks `last_verified_at` → Alerts when > 90 days old → Suggests AI refresh → Admin approves → Updates verification status

#### Business Growth Impact

- **Support:** Reduces inquiry volume by 30-40%
- **SEO:** FAQ schema markup improves SERP visibility
- **AEO:** Structured answers feed AI models (ChatGPT, Gemini, Perplexity)
- **Trust:** Comprehensive FAQs increase conversion rates

---

### 1.4 Media Library

#### Why This Module Exists

Centralized asset management is essential for:

- Image optimization (WebP, responsive sizes)
- SEO (alt text, structured data)
- AI (image analysis, caption generation)
- Reuse (same image across multiple artworks/pages)

#### Database Tables

```sql
CREATE TABLE media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_url text NOT NULL,
  storage_path text NOT NULL, -- Supabase Storage path
  file_size integer, -- bytes
  mime_type text,
  width integer,
  height integer,
  aspect_ratio numeric(5,2),
  dominant_colors jsonb, -- ["#2C3E50", "#E74C3C"]
  alt_text text,
  caption text,
  title text,
  description text,
  tags text[],
  ai_analysis jsonb, -- {"objects": ["person", "portrait"], "mood": "romantic"}
  ai_generated_alt text,
  ai_generated_caption text,
  ai_generated_tags text[],
  variants jsonb, -- {thumbnail: "url", medium: "url", large: "url", webp: "url"}
  usage_count integer DEFAULT 0,
  used_in jsonb, -- [{"entity_type": "artwork", "entity_id": "uuid"}]
  uploaded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- media_variants (separate table for query optimization)
CREATE TABLE media_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid REFERENCES media_library(id) ON DELETE CASCADE,
  variant_name text NOT NULL, -- 'thumbnail', 'medium', 'large', 'webp', 'avif'
  storage_path text NOT NULL,
  url text NOT NULL,
  width integer,
  height integer,
  file_size integer,
  mime_type text,
  created_at timestamptz DEFAULT now()
);
```

#### Workflows Enabled

1. **Upload Flow:**
   - Upload image → AI analyzes (objects, colors, mood) → Auto-generates alt text, caption, tags → Creates variants (thumbnail, medium, large, WebP) → Stores metadata

2. **Usage Tracking:**
   - Image attached to artwork → Increments usage_count → Records used_in → Prevents accidental deletion if usage_count > 0

3. **Batch Optimization:**
   - System identifies unoptimized images → Generates WebP/AVIF variants → Updates media record → Deletes old variants

#### Business Growth Impact

- **Performance:** Optimized images improve Core Web Vitals (SEO ranking factor)
- **SEO:** AI-generated alt text improves image search visibility
- **Reuse:** Centralized library prevents duplicate uploads
- **Analytics:** Usage tracking identifies popular visual assets

---

### 1.5 Testimonials & Social Proof

#### Why This Module Exists

Social proof is the #1 conversion driver for custom artwork:

- Customers need to see real results before trusting
- Video testimonials are 10x more effective than text
- Before/after comparisons show transformation

#### Database Tables

```sql
CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  customer_location text, -- "Mumbai, India"
  customer_photo_url text,
  artwork_id uuid REFERENCES artworks(id),
  category_id uuid REFERENCES categories(id),
  rating integer CHECK (rating BETWEEN 1 AND 5),
  title text, -- "Best gift I've ever given"
  testimonial_text text NOT NULL,
  ai_summary text, -- AI-generated summary
  sentiment_score numeric(3,2), -- AI-calculated sentiment
  video_url text, -- video testimonial
  before_image_url text,
  after_image_url text,
  order_value numeric(10,2), -- for ROI calculation
  display_order integer DEFAULT 0,
  featured boolean DEFAULT false,
  homepage boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
  verification_method text CHECK (verification_method IN ('manual', 'whatsapp', 'email', 'sms')),
  verified_at timestamptz,
  verified_by uuid REFERENCES profiles(id),
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- testimonial_categories (which categories this testimonial applies to)
CREATE TABLE testimonial_categories (
  testimonial_id uuid REFERENCES testimonials(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (testimonial_id, category_id)
);

-- testimonial_analytics
CREATE TABLE testimonial_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  testimonial_id uuid REFERENCES testimonials(id) ON DELETE CASCADE,
  date date NOT NULL,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  conversions integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```

#### Workflows Enabled

1. **Collection Flow:**
   - Order delivered → Automated WhatsApp request for review → Customer submits → Admin approves → AI generates summary → Publish

2. **Featured Rotation:**
   - System tracks testimonial analytics → Identifies highest-converting testimonials → Suggests rotation → Admin approves → Updates homepage/featured flags

3. **Verification Flow:**
   - New testimonial submitted → Send verification link via WhatsApp/SMS → Customer confirms → Mark verified → Publish

#### Business Growth Impact

- **Conversion:** Testimonials increase conversion rates by 34% (average)
- **Trust:** Video testimonials build emotional connection
- **SEO:** Testimonial pages rank for "[category] reviews" queries
- **Social:** Shareable testimonials drive organic traffic

---

### 1.6 Portfolio & Case Studies

#### Why This Module Exists

Portfolio pages are the primary conversion entry points. They must tell stories, not just display images.

#### Database Tables

```sql
CREATE TABLE portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text,
  description text,
  cover_image_url text,
  gallery_images uuid[], -- references media_library
  process_steps jsonb, -- [{"step": 1, "title": "Reference Photo", "description": "...", "image_url": "..."}]
  customer_quote text,
  customer_name text,
  customer_photo_url text,
  artwork_id uuid REFERENCES artworks(id),
  category_id uuid REFERENCES categories(id),
  tags text[],
  display_order integer DEFAULT 0,
  featured boolean DEFAULT false,
  homepage boolean DEFAULT false,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  meta_title text,
  meta_description text,
  og_image_url text,
  schema_type text DEFAULT 'CreativeWork',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- portfolio_analytics
CREATE TABLE portfolio_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid REFERENCES portfolios(id) ON DELETE CASCADE,
  date date NOT NULL,
  page_views integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  time_on_page numeric(10,2),
  scroll_depth numeric(5,2),
  inquiry_clicks integer DEFAULT 0,
  share_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```

#### Workflows Enabled

1. **Portfolio Creation:**
   - Select artwork → Add process steps → Add customer quote → AI generates description → SEO optimization → Publish

2. **Process Storytelling:**
   - Each portfolio shows the creation process (step-by-step) → Builds trust → Increases commission inquiries

#### Business Growth Impact

- **Differentiation:** Process stories differentiate from competitors
- **SEO:** Portfolio pages rank for long-tail keywords
- **Conversion:** Case studies convert 2-3x better than product pages
- **Social:** Shareable portfolios drive organic traffic

---

## Section 2: Lead Center (CRM)

### 2.1 Why Artspire Needs a CRM

Current state: WhatsApp messages are lost, follow-ups are forgotten, no lead tracking.

Target state: Every inquiry is tracked, scored, nurtured, and converted.

### 2.2 Database Architecture

```sql
-- leads (unified lead table)
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_number text UNIQUE NOT NULL, -- ART-2025-0001
  source text NOT NULL CHECK (source IN ('website', 'whatsapp', 'instagram', 'facebook', 'referral', 'google', 'direct', 'marketplace')),
  source_detail text, -- "Homepage Hero", "Pencil Sketches Page", "Instagram DM"

  -- Contact Info
  name text NOT NULL,
  email text,
  phone text,
  whatsapp_number text,
  location text,

  -- Lead Scoring
  score integer DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  score_factors jsonb, -- [{"factor": "budget_confirmed", "points": 20}]

  -- Interest
  category_id uuid REFERENCES categories(id),
  artwork_id uuid REFERENCES artworks(id),
  interest_type text CHECK (interest_type IN ('ready_to_buy', 'exploring', 'price_inquiry', 'commission', 'gift')),
  budget_range text CHECK (budget_range IN ('under_1000', '1000-5000', '5000-10000', '10000-25000', '25000+')),
  urgency text CHECK (urgency IN ('immediate', '1_week', '2_weeks', '1_month', 'flexible')),

  -- Status Pipeline
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'negotiating', 'confirmed', 'in_production', 'ready_for_delivery', 'delivered', 'closed_won', 'closed_lost')),
  status_changed_at timestamptz DEFAULT now(),

  -- Assignment
  assigned_to uuid REFERENCES profiles(id),

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- lead_activities (complete interaction history)
CREATE TABLE lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  activity_type text NOT NULL CHECK (activity_type IN ('inquiry', 'call', 'whatsapp', 'email', 'sms', 'meeting', 'quote_sent', 'quote_accepted', 'payment_received', 'follow_up', 'note', 'status_change', 'assignment')),

  -- Content
  subject text,
  body text,

  -- Media
  attachments jsonb, -- [{"url": "...", "type": "image"}]

  -- Metadata
  direction text CHECK (direction IN ('inbound', 'outbound')),
  channel text CHECK (channel IN ('website', 'whatsapp', 'email', 'phone', 'sms', 'in_person')),

  -- Automation
  is_automated boolean DEFAULT false,
  automation_id uuid,

  -- Actor
  created_by uuid REFERENCES profiles(id), -- null for system/automated
  created_at timestamptz DEFAULT now()
);

-- lead_quotes
CREATE TABLE lead_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  quote_number text UNIQUE NOT NULL,

  -- Line Items
  items jsonb NOT NULL, -- [{"description": "A4 Pencil Portrait", "quantity": 1, "unit_price": 2500, "total": 2500}]
  subtotal numeric(10,2) NOT NULL,
  discount_amount numeric(10,2) DEFAULT 0,
  discount_reason text,
  tax_amount numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) NOT NULL,

  -- Terms
  delivery_days integer,
  revision_count integer DEFAULT 2,
  payment_terms text, -- "50% advance, 50% on delivery"

  -- Status
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  sent_at timestamptz,
  viewed_at timestamptz,
  accepted_at timestamptz,
  rejected_at timestamptz,
  expiry_date date,

  -- Metadata
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- lead_orders (converted from quote)
CREATE TABLE lead_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id),
  quote_id uuid REFERENCES lead_quotes(id),
  order_number text UNIQUE NOT NULL,

  -- Order Details
  artwork_description text NOT NULL,
  category_id uuid REFERENCES categories(id),

  -- Pricing
  subtotal numeric(10,2) NOT NULL,
  discount_amount numeric(10,2) DEFAULT 0,
  tax_amount numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) NOT NULL,
  amount_paid numeric(10,2) DEFAULT 0,
  balance_due numeric(10,2) GENERATED ALWAYS AS (total_amount - amount_paid) STORED,

  -- Status
  status text DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'advance_paid', 'in_production', 'quality_check', 'ready_for_delivery', 'out_for_delivery', 'delivered', 'cancelled')),
  status_changed_at timestamptz DEFAULT now(),

  -- Delivery
  delivery_address jsonb,
  delivery_date date,
  tracking_number text,
  delivery_notes text,

  -- Assignment
  artist_id uuid, -- future: assign to artist
  assigned_to uuid REFERENCES profiles(id),

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- lead_follow_ups (scheduled follow-ups)
CREATE TABLE lead_follow_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,

  -- Schedule
  scheduled_at timestamptz NOT NULL,
  timezone text DEFAULT 'Asia/Kolkata',

  -- Content
  channel text CHECK (channel IN ('whatsapp', 'email', 'sms', 'call')),
  template_id uuid, -- reference to message templates
  custom_message text,

  -- Status
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'delivered', 'read', 'replied', 'failed', 'cancelled')),

  -- Execution
  executed_at timestamptz,
  error_message text,

  -- Metadata
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- lead_tags
CREATE TABLE lead_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text DEFAULT '#3B82F6',
  description text,
  created_at timestamptz DEFAULT now()
);

-- lead_tag_items (junction)
CREATE TABLE lead_tag_items (
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES lead_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (lead_id, tag_id)
);

-- message_templates (for automation)
CREATE TABLE message_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  channel text CHECK (channel IN ('whatsapp', 'email', 'sms')),
  subject text, -- for email
  body text NOT NULL,
  variables jsonb, -- [{"name": "customer_name", "description": "Customer's first name"}]
  category text CHECK (category IN ('follow_up', 'quote', 'order_update', 'delivery', 'review_request', 'welcome')),
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);
```

### 2.3 Workflows

#### Lead Capture Flow

1. Customer fills inquiry form / sends WhatsApp / clicks CTA
2. System creates lead → Assigns lead number → Auto-scores based on data completeness
3. If WhatsApp: Auto-reply with welcome message + next steps
4. If high score (>70): Auto-assign to sales manager + immediate notification

#### Lead Nurture Flow

1. Lead enters "new" → Day 1: Auto-send WhatsApp welcome
2. Day 3: Follow-up if no response → Day 7: Send portfolio link
3. Day 14: Send testimonial video → Day 21: "Last chance" offer
4. If lead opens WhatsApp: Update score + notify assigned user

#### Quote to Order Flow

1. Sales creates quote → System sends via WhatsApp/Email
2. Customer views quote → System tracks view
3. Customer accepts → System auto-generates order → Requests advance payment
4. Payment received → Status: "in_production" → Notify artist

### 2.4 Business Growth Impact

- **Conversion:** Systematic follow-ups increase conversion by 40-60%
- **Revenue:** Lead scoring prioritizes high-value inquiries
- **Efficiency:** Automation handles 70% of routine communication
- **Analytics:** Complete funnel visibility from inquiry to delivery

---

## Section 3: SEO Center

### 3.1 Philosophy

SEO is not a feature. It is a **continuous operating system** that:

1. Makes content discoverable by search engines
2. Structures data for AI consumption
3. Monitors and reacts to algorithm changes

### 3.2 Database Architecture

```sql
-- seo_metadata (already exists - extend)
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS
  ai_summary text, -- AI-generated summary for featured snippets
  canonical_url text,
  robots_meta text, -- "index, follow", "noindex, nofollow", etc.
  hreflang_tags jsonb, -- [{"lang": "en", "url": "..."}, {"lang": "hi", "url": "..."}]
  breadcrumbs jsonb, -- [{"name": "Home", "url": "/"}, {"name": "Artworks", "url": "/artworks"}]
  article_schema jsonb, -- Article schema properties
  product_schema jsonb, -- Product schema properties
  faq_schema jsonb, -- FAQ schema properties
  breadcrumb_schema jsonb, -- Breadcrumb schema
  howto_schema jsonb, -- HowTo schema
  video_schema jsonb, -- Video schema
  image_schema jsonb, -- Image schema
  review_schema jsonb, -- Review schema
  aggregate_rating_schema jsonb, -- AggregateRating schema
  organization_schema jsonb, -- Organization schema
  local_business_schema jsonb, -- LocalBusiness schema
  custom_schema jsonb, -- Any additional schema

  -- Technical SEO
  core_web_vitals jsonb, -- {"lcp": 1.2, "fid": 15, "cls": 0.05}
  mobile_friendly boolean,
  structured_data_valid boolean,
  amp_version_url text,

  -- AI Search Optimization
  ai_friendly_score integer CHECK (ai_friendly_score BETWEEN 0 AND 100),
  ai_entities text[], -- entities extracted by AI
  ai_relationships jsonb, -- [{"entity": "Pencil Sketches", "relationship": "is_a", "target": "Artwork Category"}]

  -- Monitoring
  last_crawled_at timestamptz,
  last_indexed_at timestamptz,
  index_status text CHECK (index_status IN ('indexed', 'not_indexed', 'crawled_not_indexed', 'blocked', 'error')),

  -- Rank Tracking
  target_keywords text[],
  current_rankings jsonb, -- {"keyword": "custom pencil portrait", "position": 3, "date": "2025-06-01"}

  created_by uuid REFERENCES profiles(id),
  updated_by uuid REFERENCES profiles(id);

-- sitemap_entries
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

-- redirects (already exists - extend)
ALTER TABLE redirects ADD COLUMN IF NOT EXISTS
  redirect_reason text, -- "page_deleted", "url_restructure", "seo_consolidation"
  traffic_count integer DEFAULT 0,
  last_accessed_at timestamptz,
  created_by uuid REFERENCES profiles(id);

-- page_speed_monitoring
CREATE TABLE page_speed_monitoring (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  device_type text CHECK (device_type IN ('mobile', 'desktop')),
  test_date date NOT NULL,

  -- Core Web Vitals
  lcp numeric(10,2), -- Largest Contentful Paint
  inp numeric(10,2), -- Interaction to Next Paint
  cls numeric(10,4), -- Cumulative Layout Shift
  fcp numeric(10,2), -- First Contentful Paint
  ttfb numeric(10,2), -- Time to First Byte

  -- Scores
  performance_score integer CHECK (performance_score BETWEEN 0 AND 100),
  accessibility_score integer CHECK (accessibility_score BETWEEN 0 AND 100),
  best_practices_score integer CHECK (best_practices_score BETWEEN 0 AND 100),
  seo_score integer CHECK (seo_score BETWEEN 0 AND 100),

  -- Issues
  issues jsonb, -- [{"severity": "warning", "description": "..."}]

  created_at timestamptz DEFAULT now()
);

-- index_monitoring
CREATE TABLE index_monitoring (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  check_date date NOT NULL,
  is_indexed boolean,
  is_crawled boolean,
  crawl_date timestamptz,
  index_date timestamptz,
  robots_txt_blocked boolean,
  meta_robots_blocked boolean,
  canonical_mismatch boolean,
  hreflang_issue boolean,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- keyword_rankings
CREATE TABLE keyword_rankings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  url text,
  search_engine text DEFAULT 'google' CHECK (search_engine IN ('google', 'bing', 'duckduckgo')),
  device_type text CHECK (device_type IN ('mobile', 'desktop')),
  location text DEFAULT 'India',
  check_date date NOT NULL,
  position integer,
  previous_position integer,
  position_change integer,
  search_volume integer,
  difficulty integer CHECK (difficulty BETWEEN 0 AND 100),
  cpc numeric(10,2), -- cost per click
  serp_features text[], -- ["featured_snippet", "people_also_ask", "images"]
  created_at timestamptz DEFAULT now()
);

-- backlink_monitoring
CREATE TABLE backlink_monitoring (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url text NOT NULL,
  target_url text NOT NULL,
  anchor_text text,
  link_type text CHECK (link_type IN ('dofollow', 'nofollow', 'ugc', 'sponsored')),
  domain_authority integer,
  page_authority integer,
  traffic_estimate integer,
  discovered_at timestamptz DEFAULT now(),
  last_checked_at timestamptz,
  is_active boolean DEFAULT true,
  lost_at timestamptz
);
```

### 3.3 Admin Capabilities

#### Meta Management

- Auto-generate meta titles/descriptions from AI
- A/B test meta variations
- Bulk edit meta tags across categories

#### Schema Management

- Auto-generate JSON-LD schemas from content
- Custom schema builder (drag-and-drop)
- Schema validation against Google standards
- Rich snippet preview

#### Technical SEO

- Automated page speed monitoring (weekly)
- Core Web Vitals tracking
- Mobile-friendliness checks
- Structured data validation
- Index status monitoring

#### Rank Tracking

- Track target keyword positions
- Competitor rank comparison
- SERP feature tracking (featured snippets, PAA, etc.)
- Position change alerts

### 3.4 Business Growth Impact

- **Organic Traffic:** SEO-optimized content ranks for high-intent keywords
- **AI Visibility:** Structured data feeds AI models (ChatGPT, Gemini, Perplexity)
- **Trust:** Rich snippets increase CTR by 20-30%
- **Efficiency:** Automated monitoring catches issues before they impact rankings

---

## Section 4: AEO Center (Answer Engine Optimization)

### 4.1 Why AEO Matters

AI models (ChatGPT, Gemini, Claude, Perplexity) are becoming primary information sources. AEO ensures your brand appears in AI-generated answers.

### 4.2 Database Architecture

```sql
-- aeo_question_bank
CREATE TABLE aeo_question_bank (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  question_normalized text, -- lowercase, stemmed
  question_type text CHECK (question_type IN ('what', 'how', 'why', 'when', 'where', 'who', 'which', 'comparison', 'list')),

  -- Intent Analysis
  search_intent text CHECK (search_intent IN ('informational', 'navigational', 'transactional', 'commercial')),
  target_funnel_stage text CHECK (target_funnel_stage IN ('awareness', 'consideration', 'decision', 'retention')),

  -- Search Data
  search_volume integer,
  difficulty_score integer CHECK (difficulty_score BETWEEN 0 AND 100),
  cpc numeric(10,2),

  -- AI Optimization
  ai_answer text, -- Optimized answer for AI models
  ai_answer_length integer, -- character count
  ai_answer_sources text[], -- URLs cited in answer
  ai_confidence_score numeric(3,2),

  -- Status
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),

  -- Metadata
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- aeo_answer_bank
CREATE TABLE aeo_answer_bank (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES aeo_question_bank(id) ON DELETE CASCADE,

  -- Answer Content
  answer_type text CHECK (answer_type IN ('paragraph', 'list', 'table', 'step_by_step', 'comparison', 'definition')),
  answer text NOT NULL,
  answer_summary text, -- 1-2 sentence summary

  -- Supporting Evidence
  sources jsonb, -- [{"url": "...", "title": "...", "type": "primary"}]
  citations text[], -- inline citation markers

  -- Entity Relationships
  primary_entity text, -- "Artspire"
  related_entities text[], -- ["Pencil Sketches", "Custom Portraits"]

  -- AI Optimization
  ai_friendly_score integer CHECK (ai_friendly_score BETWEEN 0 AND 100),
  readability_score integer CHECK (readability_score BETWEEN 0 AND 100),
  fact_density_score integer CHECK (fact_density_score BETWEEN 0 AND 100),

  -- Performance
  featured_snippet_achieved boolean DEFAULT false,
  ai_citation_count integer DEFAULT 0,
  last_cited_at timestamptz,

  -- Status
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),

  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- aeo_faq_clusters (groups of questions for comprehensive coverage)
CREATE TABLE aeo_faq_clusters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  primary_keyword text,
  related_keywords text[],
  target_entities text[], -- ["Artspire", "Custom Artwork"]
  coverage_score integer CHECK (coverage_score BETWEEN 0 AND 100),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz DEFAULT now()
);

-- aeo_faq_cluster_items
CREATE TABLE aeo_faq_cluster_items (
  cluster_id uuid REFERENCES aeo_faq_clusters(id) ON DELETE CASCADE,
  question_id uuid REFERENCES aeo_question_bank(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  PRIMARY KEY (cluster_id, question_id)
);

-- aeo_brand_facts
CREATE TABLE aeo_brand_facts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fact_type text CHECK (fact_type IN ('identity', 'offering', 'process', 'achievement', 'differentiator', 'testimonial')),
  fact_statement text NOT NULL,
  supporting_evidence text,
  source_url text,
  confidence_score numeric(3,2),

  -- AI Consumption
  ai_citation_count integer DEFAULT 0,
  last_cited_at timestamptz,

  -- Status
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'verified', 'published', 'deprecated')),
  verified_by uuid REFERENCES profiles(id),
  verified_at timestamptz,

  created_at timestamptz DEFAULT now()
);

-- aeo_ai_citations (track when AI models cite our content)
CREATE TABLE aeo_ai_citations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_model text NOT NULL, -- "ChatGPT", "Gemini", "Claude", "Perplexity"
  query text NOT NULL,
  response_summary text,
  cited_url text,
  cited_content text,
  citation_context text, -- surrounding text in AI response
  discovered_at timestamptz DEFAULT now(),
  verified boolean DEFAULT false
);
```

### 4.3 Workflows

#### Question Discovery

1. AI scans Google Search Console, competitor sites, Reddit, Quora
2. Identifies questions about custom artwork
3. Scores questions by search volume + AI citation potential
4. Suggests questions to content team

#### Answer Generation

1. Content team selects question
2. AI generates optimized answer (structured, factual, concise)
3. Editor reviews and enhances
4. AI scores answer for AI-friendliness
5. Publish + monitor for AI citations

#### Citation Monitoring

1. System periodically queries AI models with target questions
2. Checks if AI responses cite Artspire
3. Logs citations in `aeo_ai_citations`
4. Alerts when new citations are detected

### 4.4 Business Growth Impact

- **AI Visibility:** Brand appears in AI-generated answers
- **Trust:** AI citations build authority
- **Traffic:** AI answers drive referral traffic
- **Differentiation:** Most competitors ignore AEO entirely

---

## Section 5: GEO Center (Generative Engine Optimization)

### 5.1 Why GEO Matters

Generative AI models (ChatGPT, Gemini, Claude) don't just retrieve links — they synthesize information. GEO ensures your brand is part of the synthesized knowledge.

### 5.2 Database Architecture

```sql
-- geo_entities
CREATE TABLE geo_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_name text NOT NULL,
  entity_type text CHECK (entity_type IN ('brand', 'product', 'service', 'person', 'location', 'category', 'concept', 'material')),
  entity_slug text UNIQUE NOT NULL,

  -- Description
  description text,
  short_description text, -- 1-2 sentences for AI consumption

  -- Identifiers
  wikidata_id text, -- Wikidata Q-ID
  schema_org_type text, -- "Organization", "Product", "LocalBusiness"
  same_as_urls text[], -- ["https://www.wikidata.org/wiki/Q123", "https://www.wikipedia.org/wiki/Artspire"]

  -- Knowledge Graph
  knowledge_panel jsonb, -- structured data for knowledge panels

  -- Authority Signals
  authority_score integer CHECK (authority_score BETWEEN 0 AND 100),
  citation_count integer DEFAULT 0,
  mention_count integer DEFAULT 0,

  -- Status
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- geo_relationships
CREATE TABLE geo_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_entity_id uuid REFERENCES geo_entities(id) ON DELETE CASCADE,
  relationship_type text CHECK (relationship_type IN ('is_a', 'has_a', 'part_of', 'related_to', 'offers', 'located_in', 'created_by', 'uses', 'produces')),
  object_entity_id uuid REFERENCES geo_entities(id) ON DELETE CASCADE,
  confidence_score numeric(3,2),
  source text, -- "manual", "ai_extracted", "schema"
  created_at timestamptz DEFAULT now()
);

-- geo_topic_clusters
CREATE TABLE geo_topic_clusters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  primary_entity_id uuid REFERENCES geo_entities(id),
  related_entities uuid[],
  target_keywords text[],
  content_pieces jsonb, -- [{"type": "article", "url": "..."}]
  authority_score integer CHECK (authority_score BETWEEN 0 AND 100),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz DEFAULT now()
);

-- geo_ai_snippets
CREATE TABLE geo_ai_snippets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid REFERENCES geo_entities(id) ON DELETE CASCADE,

  -- Snippet Content
  snippet_type text CHECK (snippet_type IN ('definition', 'comparison', 'list', 'how_to', 'fact', 'quote')),
  content text NOT NULL,
  source_url text,

  -- AI Optimization
  ai_friendly_score integer CHECK (ai_friendly_score BETWEEN 0 AND 100),
  entity_density numeric(3,2), -- how many entities are mentioned

  -- Performance
  ai_citation_count integer DEFAULT 0,
  last_cited_at timestamptz,

  created_at timestamptz DEFAULT now()
);

-- geo_brand_knowledge_base
CREATE TABLE geo_brand_knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text CHECK (category IN ('identity', 'products', 'services', 'process', 'team', 'locations', 'policies', 'differentiators', 'testimonials')),

  -- Content
  key text NOT NULL, -- "founder_name", "established_year", "specialty"
  value text NOT NULL,
  value_type text CHECK (value_type IN ('text', 'number', 'date', 'url', 'boolean', 'json')),

  -- AI Consumption
  ai_importance_score integer CHECK (ai_importance_score BETWEEN 0 AND 100),
  ai_entities text[], -- entities mentioned in this fact

  -- Verification
  verified boolean DEFAULT false,
  verified_by uuid REFERENCES profiles(id),
  verified_at timestamptz,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 5.3 Example Entity Relationships

```
Artspire (Brand)
  → is_a → Custom Artwork Platform
  → offers → Pencil Sketches
  → offers → Colour Portraits
  → offers → Paintings
  → offers → Mirror Art
  → offers → Clay Art
  → offers → Personalized Gifts
  → located_in → India
  → created_by → [Artist Name]

Pencil Sketches (Category)
  → is_a → Artwork Category
  → part_of → Custom Artwork
  → related_to → Portrait Art
  → uses → Pencil
  → uses → Paper
  → produces → Custom Portrait
```

### 5.4 Business Growth Impact

- **AI Knowledge:** AI models understand what Artspire is and what it offers
- **Synthesis:** When users ask "What are the best custom artwork platforms in India?", Artspire appears
- **Authority:** Structured entity relationships build topical authority
- **Future-Proof:** GEO is the next evolution of SEO

---

## Section 6: AI Visibility Center

### 6.1 What Is Technically Possible

AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.) scrape websites to train models. We can:

1. **Detect** them via User-Agent strings
2. **Log** their visits
3. **Track** which pages they crawl
4. **Analyze** crawl patterns
5. **Optimize** content for AI consumption

### 6.2 What Is NOT Possible

1. **Direct API to AI models:** We cannot query ChatGPT to ask "Do you know about Artspire?"
2. **Real-time citation tracking:** We cannot know when an AI model cites us in real-time
3. **Model training data:** We cannot see what data the AI models have about us
4. **Influence training:** We cannot directly influence what AI models learn

### 6.3 Database Architecture

```sql
-- ai_crawler_visits
CREATE TABLE ai_crawler_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Crawler Identity
  user_agent text NOT NULL,
  crawler_name text NOT NULL, -- "GPTBot", "ClaudeBot", "PerplexityBot"
  crawler_version text,

  -- Request Details
  ip_address text,
  request_path text NOT NULL,
  request_method text DEFAULT 'GET',
  referer text,

  -- Response
  response_status integer,
  response_time_ms integer,

  -- Content
  pages_crawled integer DEFAULT 1,
  content_type text,

  -- Timestamps
  visited_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- ai_crawler_stats
CREATE TABLE ai_crawler_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crawler_name text NOT NULL,
  date date NOT NULL,

  -- Metrics
  visit_count integer DEFAULT 0,
  unique_pages integer DEFAULT 0,
  total_pages integer DEFAULT 0,
  avg_response_time_ms integer,
  error_count integer DEFAULT 0,

  -- Content
  pages_crawled text[],

  PRIMARY KEY (crawler_name, date)
);

-- ai_crawler_block_rules
CREATE TABLE ai_crawler_block_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crawler_name text NOT NULL,
  rule_type text CHECK (rule_type IN ('allow', 'disallow', 'crawl_delay')),
  path_pattern text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ai_crawler_pages
CREATE TABLE ai_crawler_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,

  -- Crawler Data
  gptbot_crawled boolean DEFAULT false,
  gptbot_last_crawled timestamptz,
  gptbot_crawl_count integer DEFAULT 0,

  claudebot_crawled boolean DEFAULT false,
  claudebot_last_crawled timestamptz,
  claudebot_crawl_count integer DEFAULT 0,

  perplexitybot_crawled boolean DEFAULT false,
  perplexitybot_last_crawled timestamptz,
  perplexitybot_crawl_count integer DEFAULT 0,

  google_extended_crawled boolean DEFAULT false,
  google_extended_last_crawled timestamptz,
  google_extended_crawl_count integer DEFAULT 0,

  -- Analysis
  content_freshness_score integer CHECK (content_freshness_score BETWEEN 0 AND 100),
  ai_optimization_score integer CHECK (ai_optimization_score BETWEEN 0 AND 100),

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 6.4 AI Crawler User-Agent Strings

| Crawler         | User-Agent                                                                                               | Status                    |
| --------------- | -------------------------------------------------------------------------------------------------------- | ------------------------- |
| GPTBot          | `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.0; +https://openai.com/gptbot)` | Active                    |
| ClaudeBot       | `Mozilla/5.0 (compatible; ClaudeBot/1.0; +https://www.anthropic.com/claudebot)`                          | Active                    |
| PerplexityBot   | `Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)`                      | Active                    |
| Google-Extended | `Google-Extended`                                                                                        | Active (for AI training)  |
| Amazonbot       | `Mozilla/5.0 (compatible; Amazonbot/1.0)`                                                                | Active                    |
| Bytespider      | `Mozilla/5.0 (compatible; Bytespider/1.0)`                                                               | Active (ByteDance/TikTok) |

### 6.5 Implementation Strategy

1. **Middleware Detection:** Add Express/Vite middleware to detect AI crawlers
2. **Logging:** Log every AI crawler visit to `ai_crawler_visits`
3. **Dashboard:** Show crawler visit stats, most-crawled pages, crawl frequency
4. **Alerts:** Notify when new crawlers are detected, when crawl frequency changes
5. **Optimization:** Prioritize AI-optimized content for pages that crawlers visit most

### 6.6 Visualization

- **Crawler Timeline:** Line chart showing daily visits per crawler
- **Page Heatmap:** Which pages are crawled most
- **Crawler Comparison:** Side-by-side stats for each crawler
- **Content Optimization:** Suggest pages to optimize based on crawler interest

---

## Section 7: Analytics Center

### 7.1 Philosophy

Analytics is not just tracking. It is **business intelligence** that drives decisions.

### 7.2 Database Architecture

```sql
-- analytics_events (unified event tracking)
CREATE TABLE analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Event Details
  event_type text NOT NULL CHECK (event_type IN ('page_view', 'artwork_view', 'category_view', 'inquiry', 'whatsapp_click', 'phone_click', 'email_click', 'quote_request', 'order_placed', 'payment_made', 'share', 'search', 'filter', 'sort', 'scroll', 'time_on_page')),

  -- User
  visitor_id text, -- anonymous visitor ID (cookie-based)
  user_id uuid REFERENCES profiles(id), -- logged-in user
  session_id text,

  -- Page/Context
  page_url text,
  page_path text,
  referrer text,

  -- Content
  artwork_id uuid REFERENCES artworks(id),
  category_id uuid REFERENCES categories(id),
  portfolio_id uuid REFERENCES portfolios(id),

  -- Metadata
  device_type text CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  browser text,
  os text,
  country text,
  city text,

  -- Engagement
  duration_ms integer,
  scroll_depth integer CHECK (scroll_depth BETWEEN 0 AND 100),

  -- Timestamps
  event_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- analytics_daily_rollup
CREATE TABLE analytics_daily_rollup (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,

  -- Traffic
  total_sessions integer DEFAULT 0,
  total_page_views integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  returning_visitors integer DEFAULT 0,

  -- Engagement
  avg_session_duration_ms integer,
  avg_pages_per_session numeric(5,2),
  bounce_rate numeric(5,2),

  -- Content
  top_artworks jsonb, -- [{"artwork_id": "uuid", "views": 100}]
  top_categories jsonb,
  top_landing_pages jsonb,
  top_exit_pages jsonb,

  -- Conversions
  total_inquiries integer DEFAULT 0,
  total_quotes integer DEFAULT 0,
  total_orders integer DEFAULT 0,
  total_revenue numeric(12,2),
  conversion_rate numeric(5,2),

  -- SEO
  organic_sessions integer DEFAULT 0,
  organic_page_views integer DEFAULT 0,
  organic_inquiries integer DEFAULT 0,

  -- AI
  ai_crawler_visits integer DEFAULT 0,

  PRIMARY KEY (date)
);

-- analytics_kpi_targets
CREATE TABLE analytics_kpi_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_name text NOT NULL,
  target_value numeric(10,2) NOT NULL,
  current_value numeric(10,2),
  period text CHECK (period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  start_date date,
  end_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- analytics_funnels
CREATE TABLE analytics_funnels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_name text NOT NULL,
  steps jsonb NOT NULL, -- [{"step_name": "Homepage Visit", "event_type": "page_view", "path": "/"}]

  -- Performance
  total_entries integer DEFAULT 0,
  completions integer DEFAULT 0,
  conversion_rate numeric(5,2),

  -- Step Breakdown
  step_metrics jsonb, -- [{"step": 1, "visitors": 1000, "dropoff": 200}]

  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

### 7.3 Dashboards

#### Traffic Dashboard

- Sessions over time (line chart)
- Top pages (table)
- Device breakdown (pie chart)
- Geography (map)
- Referrers (table)

#### Lead Dashboard

- Lead funnel (visual pipeline)
- Lead sources (pie chart)
- Lead score distribution (histogram)
- Conversion rate by source (bar chart)
- Response time by stage (line chart)

#### SEO Dashboard

- Organic traffic (line chart)
- Keyword rankings (table with sparklines)
- Core Web Vitals (gauge charts)
- Index status (pie chart)
- Backlink growth (line chart)

#### AI Visibility Dashboard

- AI crawler visits (line chart)
- Most-crawled pages (table)
- AEO citation count (number + trend)
- GEO entity coverage (radar chart)
- AI-friendly content score (gauge)

#### Revenue Dashboard

- Revenue by category (bar chart)
- Revenue by source (pie chart)
- Average order value (number + trend)
- Customer lifetime value (line chart)
- Commission vs. ready-made revenue (stacked bar)

### 7.4 Business Growth Impact

- **Data-Driven:** Decisions based on data, not gut feeling
- **Optimization:** Identify bottlenecks in conversion funnel
- **ROI:** Track which marketing channels deliver highest ROI
- **Prediction:** Use historical data to predict future trends

---

## Section 8: Knowledge Center

### 8.1 Why This Module Exists

A single source of truth for:

- **Humans:** Staff training, customer support, content creation
- **Search Engines:** Structured knowledge for rich snippets
- **AI Models:** Training data for accurate brand representation

### 8.2 Database Architecture

```sql
-- knowledge_base
CREATE TABLE knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,

  -- Content
  title text NOT NULL,
  content text NOT NULL,
  content_type text CHECK (content_type IN ('policy', 'process', 'guideline', 'faq', 'fact', 'definition', 'tutorial')),

  -- Categorization
  category text CHECK (category IN ('brand', 'products', 'services', 'delivery', 'pricing', 'quality', 'policies', 'processes', 'team', 'contact')),
  tags text[],

  -- AI Optimization
  ai_summary text,
  ai_entities text[],
  ai_keywords text[],
  ai_friendly_score integer CHECK (ai_friendly_score BETWEEN 0 AND 100),

  -- Verification
  verified boolean DEFAULT false,
  verified_by uuid REFERENCES profiles(id),
  verified_at timestamptz,

  -- Usage
  usage_count integer DEFAULT 0,
  last_used_at timestamptz,

  -- Status
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),

  -- Metadata
  created_by uuid REFERENCES profiles(id),
  updated_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- knowledge_base_versions
CREATE TABLE knowledge_base_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_base_id uuid REFERENCES knowledge_base(id) ON DELETE CASCADE,
  version integer NOT NULL,
  title text,
  content text,
  change_reason text,
  changed_by uuid REFERENCES profiles(id),
  changed_at timestamptz DEFAULT now()
);

-- knowledge_base_relationships
CREATE TABLE knowledge_base_relationships (
  source_id uuid REFERENCES knowledge_base(id) ON DELETE CASCADE,
  relationship_type text CHECK (relationship_type IN ('related', 'prerequisite', 'supersedes', 'contradicts')),
  target_id uuid REFERENCES knowledge_base(id) ON DELETE CASCADE,
  PRIMARY KEY (source_id, target_id)
);
```

### 8.3 Example Knowledge Entries

| Category | Title                   | Content Type | AI Summary                                                                           |
| -------- | ----------------------- | ------------ | ------------------------------------------------------------------------------------ |
| Brand    | "What is Artspire?"     | Definition   | "Artspire is India's premier custom artwork platform..."                             |
| Products | "Pencil Sketch Process" | Process      | "1. Reference photo → 2. Sketch outline → 3. Shading → 4. Details → 5. Final review" |
| Delivery | "Delivery Timeline"     | Policy       | "Standard delivery: 5-7 days. Express delivery: 2-3 days (+₹500)"                    |
| Quality  | "Quality Standards"     | Guideline    | "All artworks are hand-drawn by professional artists. No digital printing."          |

### 8.4 Business Growth Impact

- **Consistency:** All staff reference same knowledge base
- **AI Training:** AI models learn accurate brand information
- **SEO:** Knowledge base pages rank for informational queries
- **Support:** Reduces support tickets by 40-50%

---

## Section 9: Automation Center

### 9.1 Philosophy

Automate repetitive tasks so humans can focus on creativity and relationships.

### 9.2 Database Architecture

```sql
-- automation_rules
CREATE TABLE automation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,

  -- Trigger
  trigger_type text NOT NULL CHECK (trigger_type IN ('event', 'schedule', 'condition')),
  trigger_config jsonb NOT NULL, -- {"event": "lead_created", "filters": [{"field": "source", "operator": "equals", "value": "whatsapp"}]}

  -- Conditions
  conditions jsonb, -- [{"field": "lead.score", "operator": ">", "value": 70}]

  -- Actions
  actions jsonb NOT NULL, -- [{"type": "send_whatsapp", "template": "welcome_high_value"}]

  -- Status
  is_active boolean DEFAULT true,
  run_count integer DEFAULT 0,
  last_run_at timestamptz,

  -- Metadata
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- automation_logs
CREATE TABLE automation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid REFERENCES automation_rules(id),

  -- Execution
  status text CHECK (status IN ('success', 'failed', 'skipped')),
  error_message text,

  -- Context
  trigger_data jsonb,
  action_results jsonb,

  created_at timestamptz DEFAULT now()
);

-- automation_schedules
CREATE TABLE automation_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid REFERENCES automation_rules(id),
  schedule_type text CHECK (schedule_type IN ('once', 'daily', 'weekly', 'monthly', 'custom')),
  cron_expression text,
  next_run_at timestamptz,
  last_run_at timestamptz,
  is_active boolean DEFAULT true
);
```

### 9.3 Example Automations

| Name              | Trigger      | Condition                               | Action                                               |
| ----------------- | ------------ | --------------------------------------- | ---------------------------------------------------- |
| Welcome New Lead  | Lead created | Source = "website"                      | Send WhatsApp welcome message                        |
| High-Value Alert  | Lead created | Score > 70                              | Notify sales manager + assign immediately            |
| Follow-Up Day 3   | Time-based   | 3 days after lead creation, no activity | Send portfolio link via WhatsApp                     |
| Quote Follow-Up   | Time-based   | 2 days after quote sent, not viewed     | Send reminder via WhatsApp                           |
| SEO Content Alert | Schedule     | Weekly                                  | Alert when content freshness score < 50              |
| AI Crawler Alert  | Event        | New AI crawler detected                 | Send notification to admin                           |
| Indexing Alert    | Schedule     | Daily                                   | Alert when index status = "not_indexed" for > 7 days |
| Review Request    | Event        | Order delivered                         | Send review request via WhatsApp after 3 days        |

### 9.4 Business Growth Impact

- **Efficiency:** 70% of routine communication automated
- **Consistency:** No leads forgotten, no follow-ups missed
- **Speed:** Instant response to inquiries increases conversion
- **Scale:** Handle 10x more leads without adding staff

---

## Section 10: Permissions & Roles

### 10.1 Role Hierarchy

```
Super Admin
├── Content Manager
│   ├── Artwork Editor
│   ├── Category Editor
│   └── FAQ Editor
├── SEO Manager
│   ├── SEO Analyst
│   └── Content Optimizer
├── Sales Manager
│   ├── Sales Rep
│   └── Lead Qualifier
├── Support Manager
│   └── Support Agent
└── Viewer (Read-only)
```

### 10.2 Permissions Matrix

| Module           | Super Admin | Content Manager | SEO Manager | Sales Manager | Support Manager | Viewer |
| ---------------- | ----------- | --------------- | ----------- | ------------- | --------------- | ------ |
| Artwork CRUD     | ✅          | ✅              | ❌          | ❌            | ❌              | 👁️     |
| Category CRUD    | ✅          | ✅              | ❌          | ❌            | ❌              | 👁️     |
| FAQ CRUD         | ✅          | ✅              | ✅          | ❌            | ✅              | 👁️     |
| SEO Metadata     | ✅          | ❌              | ✅          | ❌            | ❌              | 👁️     |
| Redirects        | ✅          | ❌              | ✅          | ❌            | ❌              | ❌     |
| Sitemap          | ✅          | ❌              | ✅          | ❌            | ❌              | ❌     |
| Lead Management  | ✅          | ❌              | ❌          | ✅            | ✅              | ❌     |
| Quote Management | ✅          | ❌              | ❌          | ✅            | ❌              | ❌     |
| Order Management | ✅          | ❌              | ❌          | ✅            | ❌              | ❌     |
| Follow-Up System | ✅          | ❌              | ❌          | ✅            | ✅              | ❌     |
| Analytics        | ✅          | 👁️              | 👁️          | 👁️            | 👁️              | ❌     |
| AI Visibility    | ✅          | ❌              | ✅          | ❌            | ❌              | ❌     |
| Automation       | ✅          | ❌              | ✅          | ❌            | ❌              | ❌     |
| Knowledge Base   | ✅          | ✅              | ✅          | ✅            | ✅              | 👁️     |
| User Management  | ✅          | ❌              | ❌          | ❌            | ❌              | ❌     |
| Settings         | ✅          | ❌              | ❌          | ❌            | ❌              | ❌     |

### 10.3 Database Architecture

```sql
-- roles (extends existing enum)
-- user_role enum already has: "admin" | "customer"
-- Add: "content_manager", "seo_manager", "sales_manager", "support_manager", "viewer"

-- permissions (granular permission system)
CREATE TABLE permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource text NOT NULL, -- "artwork", "category", "lead", "order"
  action text NOT NULL, -- "create", "read", "update", "delete", "publish", "assign"
  description text,
  created_at timestamptz DEFAULT now()
);

-- role_permissions (junction)
CREATE TABLE role_permissions (
  role user_role NOT NULL,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role, permission_id)
);

-- user_roles (multiple roles per user)
CREATE TABLE user_roles (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  assigned_by uuid REFERENCES profiles(id),
  assigned_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  PRIMARY KEY (user_id, role)
);

-- audit_logs (comprehensive audit trail)
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Actor
  user_id uuid REFERENCES profiles(id),
  user_role user_role,

  -- Action
  action text NOT NULL, -- "create", "update", "delete", "login", "logout", "export"
  resource text NOT NULL, -- "artwork", "lead", "order"
  resource_id uuid,

  -- Details
  old_values jsonb,
  new_values jsonb,
  change_summary text,

  -- Context
  ip_address text,
  user_agent text,

  created_at timestamptz DEFAULT now()
);
```

---

## Section 11: Database Architecture

### 11.1 Entity Relationship Diagram (High-Level)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   profiles      │     │   artworks      │     │   categories    │
│  (users)        │◄────┤  (products)     │◄────┤  (taxonomy)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                       │
         │              ┌─────────┴─────────┐              │
         │              │                     │              │
         │       ┌──────┴──────┐       ┌────┴────┐         │
         │       │ artwork_   │       │ artwork │         │
         │       │ _tags      │       │ _media  │         │
         │       └─────────────┘       └─────────┘         │
         │                                                 │
         │              ┌─────────────────┐                │
         └──────────────┤   leads         │────────────────┘
                        │  (CRM)          │
                        └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
       ┌──────┴──────┐    ┌─────┴─────┐    ┌──────┴──────┐
       │ lead_       │    │ lead_     │    │ lead_       │
       │ activities  │    │ quotes    │    │ orders      │
       └─────────────┘    └───────────┘    └─────────────┘
                                 │
                        ┌────────┴────────┐
                        │  testimonials   │
                        │  portfolios     │
                        │  media_library  │
                        └─────────────────┘
```

### 11.2 Indexes Strategy

```sql
-- Performance-critical indexes
CREATE INDEX idx_artworks_status_category ON artworks(status, category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_artworks_slug ON artworks(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_artworks_featured ON artworks(featured) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_artworks_homepage ON artworks(show_on_homepage) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_artworks_price ON artworks(price) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_artworks_created_at ON artworks(created_at DESC);
CREATE INDEX idx_artworks_published_at ON artworks(published_at DESC);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_score ON leads(score DESC);

CREATE INDEX idx_seo_metadata_entity ON seo_metadata(entity_type, entity_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type, event_at);
CREATE INDEX idx_analytics_events_visitor ON analytics_events(visitor_id, event_at);

CREATE INDEX idx_faqs_entity ON faqs(entity_type, entity_id);
CREATE INDEX idx_faqs_status ON faqs(status) WHERE status = 'published';

-- Full-text search (for future)
-- CREATE INDEX idx_artworks_fts ON artworks USING gin(to_tsvector('english', title || ' ' || summary || ' ' || story_content));
```

### 11.3 Search Strategy

**Phase 1 (Now):** PostgreSQL `ILIKE` + `tsvector`  
**Phase 2:** Supabase Full-Text Search  
**Phase 3:** Meilisearch/Algolia for instant search  
**Phase 4:** AI-powered semantic search (vector embeddings)

```sql
-- Full-text search setup
CREATE INDEX idx_artworks_search ON artworks
USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(ai_summary, '')));

CREATE INDEX idx_categories_search ON categories
USING gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));
```

### 11.4 Audit & Versioning Strategy

Every table has:

- `created_at`, `updated_at` timestamps
- `created_by`, `updated_by` user references
- `deleted_at` for soft deletes
- `_versions` table for full history
- `audit_logs` for compliance tracking

### 11.5 Scalability Considerations

| Table            | Current Rows | Expected Growth | Strategy                             |
| ---------------- | ------------ | --------------- | ------------------------------------ |
| artworks         | < 100        | 10,000          | Partition by status                  |
| leads            | < 1,000      | 100,000         | Partition by year                    |
| analytics_events | < 10,000     | 10,000,000      | Time-series, aggregate after 90 days |
| seo_metadata     | < 500        | 50,000          | Index by entity_type                 |
| media_library    | < 1,000      | 100,000         | Supabase Storage, not DB             |

---

## Section 12: Future Roadmap

### V1: Foundation (0-3 Months) — CURRENT FOCUS

**Goal:** Get the core platform working reliably.

| Module              | Features                               | Business Value           |
| ------------------- | -------------------------------------- | ------------------------ |
| Artwork Management  | CRUD, image upload, publish workflow   | Content goes live        |
| Category Management | Hierarchical categories, landing pages | SEO structure            |
| FAQ Management      | Basic FAQs, global + artwork-specific  | Support reduction        |
| SEO Metadata        | Basic meta tags, structured data       | Search visibility        |
| Lead Management     | Inquiry capture, basic tracking        | No more lost leads       |
| Admin Dashboard     | Stats cards, artwork list              | Visibility into business |
| Deployment          | Vercel + Supabase, stable builds       | Production-ready         |

### V2: Growth (3-6 Months)

**Goal:** Scale content and convert more leads.

| Module               | Features                               | Business Value          |
| -------------------- | -------------------------------------- | ----------------------- |
| CRM Full             | Lead scoring, pipeline, quotes, orders | 40% conversion increase |
| WhatsApp Integration | Auto-replies, templates, follow-ups    | Instant response        |
| Testimonials         | Collection, verification, display      | Social proof            |
| Portfolio            | Case studies, process stories          | Differentiation         |
| Media Library        | AI analysis, auto-optimization         | Performance + SEO       |
| Analytics v1         | Traffic, lead, SEO dashboards          | Data-driven decisions   |
| Automation v1        | Welcome messages, follow-ups           | Efficiency              |

### V3: Intelligence (6-12 Months)

**Goal:** AI-powered optimization and competitive advantage.

| Module        | Features                                              | Business Value        |
| ------------- | ----------------------------------------------------- | --------------------- |
| AI Content    | AI-generated descriptions, alt text, keywords         | 10x content speed     |
| AEO Center    | Question bank, answer optimization, citation tracking | AI visibility         |
| SEO OS        | Rank tracking, index monitoring, technical SEO        | Search dominance      |
| GEO Center    | Entity management, knowledge graph, topic clusters    | AI knowledge          |
| AI Visibility | Crawler tracking, optimization alerts                 | Future-proof          |
| Analytics v2  | Predictive lead scoring, funnel optimization          | Revenue growth        |
| Automation v2 | Smart follow-ups, content freshness alerts            | Hands-free operations |

### V4: Marketplace (12-24 Months)

**Goal:** Transform from studio to platform.

| Module                 | Features                               | Business Value     |
| ---------------------- | -------------------------------------- | ------------------ |
| Artist Onboarding      | Profiles, portfolios, verification     | Supply growth      |
| Commission Marketplace | Open commissions, artist matching      | Transaction volume |
| Rating System          | Reviews, ratings, reputation           | Trust              |
| Artist Analytics       | Earnings, performance, insights        | Artist retention   |
| Multi-vendor SEO       | Artist-specific SEO, canonical URLs    | Network effect     |
| Payment System         | Escrow, payouts, invoicing             | Revenue stream     |
| International          | Multi-currency, shipping, localization | Global expansion   |

### Priority Matrix

| Feature               | Business Impact | Effort    | Priority |
| --------------------- | --------------- | --------- | -------- |
| Stable deployment     | Critical        | Low       | **NOW**  |
| Artwork CRUD          | Critical        | Medium    | **NOW**  |
| Lead CRM              | High            | Medium    | **V2**   |
| WhatsApp automation   | High            | Medium    | **V2**   |
| AI content generation | High            | Medium    | **V3**   |
| AEO/GEO               | Medium          | High      | **V3**   |
| Marketplace           | Transformative  | High      | **V4**   |
| International         | Transformative  | Very High | **V4**   |

---

## Architecture Summary

### Technology Stack

| Layer      | Technology                             | Reason                       |
| ---------- | -------------------------------------- | ---------------------------- |
| Frontend   | TanStack Start + React 19 + Tailwind   | SSR, performance, DX         |
| Backend    | Supabase (PostgreSQL + Edge Functions) | Database, auth, realtime     |
| Storage    | Supabase Storage                       | Images, media                |
| Search     | PostgreSQL FTS → Meilisearch           | Scalable search              |
| AI         | OpenAI API + Anthropic Claude          | Content generation, analysis |
| Analytics  | Plausible + Custom DB                  | Privacy + flexibility        |
| Deployment | Vercel + Nitro                         | Edge SSR, performance        |
| CRM        | Custom + WhatsApp Business API         | Native integration           |
| SEO        | Custom + Google Search Console API     | Full control                 |

### Data Flow

```
Customer Visit
    ↓
TanStack Start SSR (Vercel Edge)
    ↓
Supabase Client (RLS enforced)
    ↓
PostgreSQL (row-level security)
    ↓
AI Services (content generation, analysis)
    ↓
Analytics (event tracking)
    ↓
Automation (triggered actions)
    ↓
WhatsApp Business API (customer communication)
```

### Success Metrics

| Metric          | Current  | V1 Target | V2 Target | V3 Target |
| --------------- | -------- | --------- | --------- | --------- |
| Organic Traffic | Baseline | +50%      | +200%     | +500%     |
| Lead Conversion | ~5%      | 10%       | 20%       | 30%       |
| Response Time   | Hours    | < 1 hour  | < 5 min   | Instant   |
| Content Pieces  | ~50      | 100       | 500       | 2,000     |
| AI Citations    | 0        | 10        | 100       | 1,000     |
| Monthly Revenue | Baseline | +30%      | +100%     | +300%     |

---

**Document Version:** 1.0  
**Next Review:** After V1 deployment  
**Author:** Product Architecture Team
