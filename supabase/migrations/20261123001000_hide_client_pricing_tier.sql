-- Clients must not be able to read their pricing tier name.
-- Staff CRM uses the service role, which keeps full access.
-- Profile reads of the other client columns stay granted.

revoke select (pricing_tier) on table public.clients from anon, authenticated;
revoke select (tier) on table public.pricing_tier_prices from anon, authenticated;

drop policy if exists pricing_tier_prices_select_own_tier on public.pricing_tier_prices;

create or replace function public.get_my_booking_prices()
returns table (
  item_key text,
  label_de text,
  label_en text,
  unit text,
  price_net_cents integer,
  sort_order integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    price.item_key,
    price.label_de,
    price.label_en,
    price.unit,
    price.price_net_cents,
    price.sort_order
  from public.pricing_tier_prices as price
  join public.clients as client_profile
    on client_profile.pricing_tier = price.tier
  where client_profile.user_id = auth.uid()
    and client_profile.is_approved is true
    and client_profile.pricing_tier is not null
    and price.active is true
  order by price.sort_order nulls last, price.item_key;
$$;

revoke all on function public.get_my_booking_prices() from public;
revoke all on function public.get_my_booking_prices() from anon;
grant execute on function public.get_my_booking_prices() to authenticated;

comment on function public.get_my_booking_prices() is
  'Active booking prices for the signed-in approved client. Does not return the tier name.';

comment on table public.pricing_tier_prices is
  'Net prices per tier and item. Staff read the table with the service role. Clients use get_my_booking_prices(), which does not return the tier.';
