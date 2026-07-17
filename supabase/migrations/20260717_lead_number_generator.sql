-- ─── LEAD NUMBER GENERATOR ──────────────────────────────────────
-- `leads.lead_number` is NOT NULL UNIQUE but nothing ever generated
-- one, because nothing on the public site ever inserted into `leads`
-- (the contact form just opened WhatsApp — see audit finding #2, the
-- CRM was completely dead). This function lets the contact form
-- create a real lead record, same pattern as generate_order_number().

CREATE OR REPLACE FUNCTION generate_lead_number()
RETURNS text AS $$
DECLARE
  today_str text := to_char(now(), 'YYYYMMDD');
  seq_num integer;
BEGIN
  SELECT COUNT(*) + 1 INTO seq_num
  FROM leads
  WHERE lead_number LIKE 'LEAD-' || today_str || '-%';

  RETURN 'LEAD-' || today_str || '-' || lpad(seq_num::text, 4, '0');
END;
$$ LANGUAGE plpgsql;
