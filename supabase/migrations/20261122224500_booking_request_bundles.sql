-- Real-estate bundles are optional. A request can still be built from
-- single services. Both columns are nullable and nothing is removed.

alter table public.booking_requests
  add column bundle text;

alter table public.booking_requests
  add constraint booking_requests_bundle_check
  check (bundle is null or bundle in ('premium-home', 'luxury-makler'));

alter table public.booking_requests
  add column highlight_room text;

alter table public.booking_requests
  add constraint booking_requests_highlight_room_length_check
  check (highlight_room is null or char_length(highlight_room) between 1 and 200);

alter table public.booking_requests
  add constraint booking_requests_bundle_photos_check
  check (
    bundle is null
    or (photo_package is not null and individual_photo_count is null)
  );

alter table public.booking_requests
  add constraint booking_requests_highlight_room_bundle_check
  check (highlight_room is null or bundle = 'premium-home');

update public.booking_requests
set services = array_replace(services, 'Agent branding Video', 'Agent Branding Video')
where 'Agent branding Video' = any (services);

comment on column public.booking_requests.bundle is
  'Real-estate bundle: premium-home or luxury-makler. Null when the client builds their own selection.';

comment on column public.booking_requests.highlight_room is
  'Optional room for the Premium Home highlight video. Null for every other request.';
