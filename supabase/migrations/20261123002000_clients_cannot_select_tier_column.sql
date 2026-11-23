-- A table-level SELECT grant covers every column, so a column REVOKE does not
-- hide pricing_tier. Grant SELECT back on every other column. The service role
-- keeps its table grant and can still read the tier for the CRM.

revoke select on table public.clients from anon, authenticated;

grant select (
  id,
  company_name,
  email,
  phone,
  street,
  zip_code,
  city,
  country,
  created_at,
  contact_first_name,
  contact_last_name,
  lexoffice_contact_id,
  contact_name,
  billing_address,
  lexoffice_id,
  contact_persons,
  billing_street,
  billing_city,
  billing_postal_code,
  billing_country,
  address_supplement,
  user_id,
  first_name,
  last_name,
  company_address,
  phone_number,
  is_approved
) on table public.clients to anon, authenticated;

revoke select on table public.pricing_tier_prices from authenticated;

grant select (
  id,
  item_key,
  label_de,
  label_en,
  unit,
  price_net_cents,
  sort_order,
  active,
  updated_at
) on table public.pricing_tier_prices to authenticated;
