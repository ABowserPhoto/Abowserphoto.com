-- Individual real-estate photos are a quantity from 1 to 9.
-- They cannot be stored together with a photo package.

alter table public.booking_requests
  add column individual_photo_count smallint;

alter table public.booking_requests
  add constraint booking_requests_individual_count_check
  check (individual_photo_count is null or individual_photo_count between 1 and 9);

alter table public.booking_requests
  add constraint booking_requests_photo_choice_check
  check (photo_package is null or individual_photo_count is null);

comment on column public.booking_requests.individual_photo_count is
  '1–9 individual photos for a real-estate request. Mutually exclusive with photo_package.';
