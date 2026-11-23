-- Stores the tier and net prices shown to the client when they submitted.
-- Nullable and additive. Requests with no tier keep a null snapshot.
-- This does not change pricing_tier_prices or clients.

alter table public.booking_requests
  add column price_snapshot jsonb;

alter table public.booking_requests
  add constraint booking_requests_price_snapshot_object_check
  check (price_snapshot is null or jsonb_typeof(price_snapshot) = 'object');

comment on column public.booking_requests.price_snapshot is
  'Tier, priced line items, and estimated net total captured from the client session. Null when no prices were shown.';
