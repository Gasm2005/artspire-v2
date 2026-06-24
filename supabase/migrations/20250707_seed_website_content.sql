-- ============================================================
-- Artspire V2 — Seed Default Website Content
-- Date: 2025-07-07
-- Populates website_content with all current hardcoded text.
-- Business owner can edit any of these from the CMS.
-- ============================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM website_content LIMIT 1) THEN
    RETURN;
  END IF;

  -- ===== HOMEPAGE =====
  INSERT INTO website_content (content_key, page, section, field_name, value_text, field_type, description) VALUES
    ('homepage.hero.heading', 'homepage', 'hero', 'heading', 'Custom Handmade Art for Your Most Treasured Memories', 'text', 'Main headline on homepage hero'),
    ('homepage.hero.subheading', 'homepage', 'hero', 'subheading', 'Transform your memories into handcrafted pencil sketches, paintings, and clay masterpieces.', 'textarea', 'Subheadline below main heading'),
    ('homepage.hero.cta_text', 'homepage', 'hero', 'cta_text', 'Commission Art', 'text', 'Primary CTA button text'),
    ('homepage.hero.cta_link', 'homepage', 'hero', 'cta_link', '/portfolio', 'text', 'Primary CTA button link'),
    ('homepage.hero.tagline', 'homepage', 'hero', 'tagline', 'Handmade. Personalized. Yours.', 'text', 'Small tagline above heading'),
    ('homepage.hero.secondary_cta_text', 'homepage', 'hero', 'secondary_cta_text', 'View Portfolio', 'text', 'Secondary CTA button text'),
    ('homepage.hero.stats_text', 'homepage', 'hero', 'stats_text', '500+ Customers · 1000+ Artworks · 4.9★', 'text', 'Stats line below CTAs'),

    ('homepage.trust_strip.text', 'homepage', 'trust_strip', 'text', '11+ Years • 1000+ Artworks • One Artist • Handcrafted', 'text', 'Trust strip text'),

    ('homepage.services.heading', 'homepage', 'services', 'heading', 'What Would You Like to Create?', 'text', 'Services section heading'),
    ('homepage.services.subheading', 'homepage', 'services', 'subheading', 'Choose from our signature handcrafted art services, each made with care and precision.', 'textarea', 'Services section description'),

    ('homepage.before_after.heading', 'homepage', 'before_after', 'heading', 'Your Photo. Our Masterpiece.', 'text', 'Before/After section heading'),
    ('homepage.before_after.subheading', 'homepage', 'before_after', 'subheading', 'See the transformation from photo to handcrafted art.', 'textarea', 'Before/After section description'),
    ('homepage.before_after.cta_text', 'homepage', 'before_after', 'cta_text', 'Commission Your Artwork', 'text', 'Before/After CTA button'),

    ('homepage.how_it_works.heading', 'homepage', 'how_it_works', 'heading', 'Simple. Personal. Yours.', 'text', 'How it works section heading'),
    ('homepage.how_it_works.subheading', 'homepage', 'how_it_works', 'subheading', 'Four easy steps from idea to delivered artwork.', 'textarea', 'How it works section description'),
    ('homepage.how_it_works.step_1_title', 'homepage', 'how_it_works', 'step_1_title', 'Share Your Idea', 'text', 'Step 1 title'),
    ('homepage.how_it_works.step_1_description', 'homepage', 'how_it_works', 'step_1_description', 'Send us your favorite photo and tell us what makes it special to you.', 'textarea', 'Step 1 description'),
    ('homepage.how_it_works.step_2_title', 'homepage', 'how_it_works', 'step_2_title', 'We Discuss & Confirm', 'text', 'Step 2 title'),
    ('homepage.how_it_works.step_2_description', 'homepage', 'how_it_works', 'step_2_description', 'We''ll help you choose the best style and size, and share a final quote.', 'textarea', 'Step 2 description'),
    ('homepage.how_it_works.step_3_title', 'homepage', 'how_it_works', 'step_3_title', 'Watch It Come to Life', 'text', 'Step 3 title'),
    ('homepage.how_it_works.step_3_description', 'homepage', 'how_it_works', 'step_3_description', 'Receive updates as our artist meticulously crafts your one-of-a-kind piece.', 'textarea', 'Step 3 description'),
    ('homepage.how_it_works.step_4_title', 'homepage', 'how_it_works', 'step_4_title', 'Delivered to Your Door', 'text', 'Step 4 title'),
    ('homepage.how_it_works.step_4_description', 'homepage', 'how_it_works', 'step_4_description', 'Safely packaged and shipped right to you, ready to be displayed and cherished.', 'textarea', 'Step 4 description'),

    ('homepage.categories.heading', 'homepage', 'categories', 'heading', 'Explore by Category', 'text', 'Category grid heading'),
    ('homepage.categories.subheading', 'homepage', 'categories', 'subheading', 'Browse our handcrafted art collections.', 'textarea', 'Category grid description'),

    ('homepage.recent_work.heading', 'homepage', 'recent_work', 'heading', 'Recent Work', 'text', 'Recent work section heading'),
    ('homepage.recent_work.subheading', 'homepage', 'recent_work', 'subheading', 'A selection of our latest handcrafted commissions.', 'textarea', 'Recent work section description'),
    ('homepage.recent_work.cta_text', 'homepage', 'recent_work', 'cta_text', 'View All Work', 'text', 'Recent work CTA button'),

    ('homepage.testimonials.heading', 'homepage', 'testimonials', 'heading', 'What Our Clients Say', 'text', 'Testimonials section heading'),
    ('homepage.testimonials.quote_1', 'homepage', 'testimonials', 'quote_1', 'She saw details I never mentioned. It''s like she captured his soul, not just his face.', 'textarea', 'Testimonial 1 quote'),
    ('homepage.testimonials.author_1', 'homepage', 'testimonials', 'author_1', '— Rajiv M.', 'text', 'Testimonial 1 author'),
    ('homepage.testimonials.quote_2', 'homepage', 'testimonials', 'quote_2', 'The clay sculpture made me cry. It''s the most precious thing in our home now.', 'textarea', 'Testimonial 2 quote'),
    ('homepage.testimonials.author_2', 'homepage', 'testimonials', 'author_2', '— Sneha K.', 'text', 'Testimonial 2 author'),
    ('homepage.testimonials.quote_3', 'homepage', 'testimonials', 'quote_3', 'She redid the eyes because she wasn''t happy with them. That dedication to perfection is rare.', 'textarea', 'Testimonial 3 quote'),
    ('homepage.testimonials.author_3', 'homepage', 'testimonials', 'author_3', '— Anjali & Vikram S.', 'text', 'Testimonial 3 author'),

    ('homepage.gifts.heading', 'homepage', 'gifts', 'heading', 'Find the Perfect Gift', 'text', 'Gift section heading'),
    ('homepage.gifts.subheading', 'homepage', 'gifts', 'subheading', 'Handcrafted art for every special occasion.', 'textarea', 'Gift section description'),
    ('homepage.gifts.corporate_text', 'homepage', 'gifts', 'corporate_text', 'Corporate & Bulk Orders', 'text', 'Corporate orders banner text'),

    ('homepage.about.tagline', 'homepage', 'about', 'tagline', 'The Artist Behind Artspire', 'text', 'About artist section tagline'),
    ('homepage.about.heading', 'homepage', 'about', 'heading', 'Hi, I''m Himangi.', 'text', 'About artist heading'),
    ('homepage.about.description', 'homepage', 'about', 'description', 'For over 11 years, I''ve been helping people capture their most precious moments through art. Every stroke and detail is infused with passion and precision.', 'textarea', 'About artist description'),
    ('homepage.about.cta_text', 'homepage', 'about', 'cta_text', 'Read My Story →', 'text', 'About artist CTA');

  -- ===== ABOUT PAGE =====
  INSERT INTO website_content (content_key, page, section, field_name, value_text, field_type, description) VALUES
    ('about.hero.heading', 'about', 'hero', 'heading', 'About Artspire', 'text', 'About page hero heading'),
    ('about.hero.subheading', 'about', 'hero', 'subheading', 'Discover the story behind every masterpiece.', 'textarea', 'About page hero subheading'),
    ('about.story.content', 'about', 'story', 'content', 'For over 11 years, Artspire has been transforming precious memories into timeless art. What began as a passion for sketching has grown into a trusted studio serving hundreds of happy customers across India.', 'textarea', 'About story content'),
    ('about.mission.statement', 'about', 'mission', 'statement', 'To transform precious memories into timeless art that brings joy for generations.', 'textarea', 'Mission statement'),
    ('about.vision.statement', 'about', 'vision', 'statement', 'To become India''s most trusted custom art studio, known for quality, care, and craftsmanship.', 'textarea', 'Vision statement');

  -- ===== CONTACT PAGE =====
  INSERT INTO website_content (content_key, page, section, field_name, value_text, field_type, description) VALUES
    ('contact.info.phone', 'contact', 'info', 'phone', '+91 74086 90994', 'text', 'Primary phone number'),
    ('contact.info.whatsapp', 'contact', 'info', 'whatsapp', '+91 74086 90994', 'text', 'WhatsApp number'),
    ('contact.info.email', 'contact', 'info', 'email', 'Ajju_pandey@outlook.com', 'text', 'Primary email'),
    ('contact.info.address', 'contact', 'info', 'address', 'India — Shipping Pan India', 'textarea', 'Business address'),
    ('contact.hours.text', 'contact', 'hours', 'text', 'Mon–Sat, 9am–9pm', 'text', 'Business hours display'),
    ('contact.social.instagram', 'contact', 'social', 'instagram', 'https://www.instagram.com/himusketching_gallery', 'text', 'Instagram URL'),
    ('contact.social.facebook', 'contact', 'social', 'facebook', 'https://facebook.com/artspire', 'text', 'Facebook URL'),
    ('contact.social.whatsapp', 'contact', 'social', 'whatsapp', 'https://wa.me/917408690994', 'text', 'WhatsApp direct link');

  -- ===== FOOTER =====
  INSERT INTO website_content (content_key, page, section, field_name, value_text, field_type, description) VALUES
    ('footer.brand.tagline', 'footer', 'brand', 'tagline', 'Crafting Your Vision', 'text', 'Footer brand tagline'),
    ('footer.brand.description', 'footer', 'brand', 'description', 'Handcrafted art for life''s most meaningful moments. Every piece tells a story.', 'textarea', 'Footer brand description'),
    ('footer.copyright.text', 'footer', 'copyright', 'text', '© 2025 Artspire Studio · All Rights Reserved', 'text', 'Copyright text');

END $$;
