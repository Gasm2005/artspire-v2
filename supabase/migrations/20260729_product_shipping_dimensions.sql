-- ─── STRUCTURED WEIGHT & DIMENSIONS FOR SHIPPING ──────────────
-- Task 6c. products.weight and products.dimensions are free text ("1000 Gm",
-- "600*100*20"), which can't be used to compute volumetric weight reliably.
-- Add numeric columns and backfill from the text where it parses. The free-text
-- columns are LEFT IN PLACE (still shown to customers as a description) — this
-- migration is additive and destroys nothing.

alter table public.products
  add column if not exists weight_grams integer,
  add column if not exists length_mm integer,
  add column if not exists width_mm integer,
  add column if not exists height_mm integer,
  add column if not exists is_fragile boolean not null default false;

-- Backfill weight: "1000 Gm" / "800 g" → grams, "1.2 kg" → 1200.
update public.products
set weight_grams = case
  when weight ~* 'k'                      -- kilograms
    then round((regexp_match(weight, '([0-9]+\.?[0-9]*)'))[1]::numeric * 1000)
  else round((regexp_match(weight, '([0-9]+\.?[0-9]*)'))[1]::numeric)
end
where weight_grams is null
  and weight is not null
  and weight ~ '[0-9]';

-- Backfill dimensions: "600*100*20" or "20 x 15 x 20" → mm (bare numbers in this
-- catalogue are already millimetres; explicit "cm" text is scaled ×10).
with parsed as (
  select id,
         regexp_matches(dimensions, '([0-9]+\.?[0-9]*)\D+([0-9]+\.?[0-9]*)\D+([0-9]+\.?[0-9]*)') as m,
         (dimensions ~* 'cm') as is_cm
  from public.products
  where dimensions is not null and dimensions ~ '[0-9]'
)
update public.products p
set length_mm = round(parsed.m[1]::numeric * case when parsed.is_cm then 10 else 1 end),
    width_mm  = round(parsed.m[2]::numeric * case when parsed.is_cm then 10 else 1 end),
    height_mm = round(parsed.m[3]::numeric * case when parsed.is_cm then 10 else 1 end)
from parsed
where p.id = parsed.id
  and p.length_mm is null;

comment on column public.products.weight_grams is 'Actual parcel weight in grams. Drives shipping (src/lib/shipping.ts).';
comment on column public.products.length_mm is 'Packed length in mm — used for volumetric weight.';
comment on column public.products.is_fragile is 'Clay/cement/mirror/glass — reserved for the fragile surcharge hook.';
