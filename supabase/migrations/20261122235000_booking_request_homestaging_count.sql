-- How many photos the client asked to stage. Nullable and additive.
-- Older requests stay null. A count is only stored when homestaging was chosen,
-- and it cannot exceed the selected package or individual photo total.

alter table public.booking_requests
  add column homestaging_photo_count smallint;

alter table public.booking_requests
  add constraint booking_requests_homestaging_photo_count_check
  check (
    homestaging_photo_count is null
    or (
      'Digital Homestaging' = any (services)
      and homestaging_photo_count between 1 and 50
      and (
        (individual_photo_count is not null and homestaging_photo_count <= individual_photo_count)
        or (photo_package = 'bis-5-zimmer' and homestaging_photo_count <= 10)
        or (photo_package = 'bis-7-zimmer' and homestaging_photo_count <= 15)
        or (photo_package = 'bis-10-zimmer' and homestaging_photo_count <= 25)
        or (photo_package = '30-fotos' and homestaging_photo_count <= 30)
        or (photo_package = '40-fotos' and homestaging_photo_count <= 40)
        or (photo_package = '50-fotos' and homestaging_photo_count <= 50)
      )
    )
  );

comment on column public.booking_requests.homestaging_photo_count is
  'Photos the client asked to stage. Null when homestaging was not chosen. Not the whole photo package.';
