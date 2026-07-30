-- ─── FIX "METALIC" MISSPELLING + PRESERVE THE OLD URL ─────────
-- Task 8. The product name and URL slug read "Metalic" while the <title> tag
-- correctly said "Metallic". Fix both, and record a permanent 301 so existing
-- links and any indexed URL keep working.
--
-- Safe: cart_items and order_items reference products by product_id (verified:
-- 8/8 and 5/5 rows), never by slug, so renaming the slug breaks no cart or order.

update public.products
set title = replace(title, 'Metalic', 'Metallic'),
    slug  = replace(slug,  'metalic', 'metallic'),
    meta_title = replace(coalesce(meta_title, ''), 'Metalic', 'Metallic'),
    meta_description = replace(coalesce(meta_description, ''), 'Metalic', 'Metallic'),
    summary = replace(coalesce(summary, ''), 'Metalic', 'Metallic'),
    description = replace(coalesce(description, ''), 'Metalic', 'Metallic')
where title ilike '%metalic%' or slug ilike '%metalic%';

-- Permanent redirect for the old product URL. The product route consults this
-- table when a slug isn't found (src/routes/shop.product.$slug.tsx), so any
-- future slug change only needs a row here — no deploy.
insert into public.redirects (from_path, to_path, type, reason)
values (
  '/shop/product/handcrafted-metalic-lamp',
  '/shop/product/handcrafted-metallic-lamp',
  '301',
  'Task 8: corrected "Metalic" misspelling in the product slug.'
)
on conflict do nothing;
