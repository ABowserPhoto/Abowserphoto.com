-- Website shoot requests stay pending until the studio approves them.
-- public.bookings is unchanged. Its property-status check cannot store inquiries,
-- and clients can select their own rows, so an approval token does not belong there.
-- This table is additive. Staff can read it. The website writes with the service role.

create table public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  user_id uuid references auth.users (id) on delete set null,
  kind text not null,
  status text not null default 'pending',
  approval_token_hash text not null,
  locale text not null,
  company_name text not null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text not null,
  account_email text,
  location_address text,
  property_status text,
  services text[] not null default '{}',
  photo_package text,
  category_slug text,
  notes text,
  requested_date date not null,
  requested_time time not null,
  time_zone text not null,
  event_summary text not null,
  calendar_event_id text,
  calendar_html_link text,
  decided_at timestamptz,
  constraint booking_requests_kind_check check (kind in ('immobilien', 'inquiry')),
  constraint booking_requests_status_check check (status in ('pending', 'confirmed', 'declined')),
  constraint booking_requests_locale_check check (locale in ('de', 'en')),
  constraint booking_requests_approval_token_hash_key unique (approval_token_hash),
  constraint booking_requests_token_hash_check check (char_length(approval_token_hash) = 64)
);

create unique index booking_requests_one_active_slot_idx
  on public.booking_requests (requested_date, requested_time)
  where status in ('pending', 'confirmed');

alter table public.booking_requests enable row level security;

revoke all on table public.booking_requests from public;
revoke all on table public.booking_requests from anon;
revoke all on table public.booking_requests from authenticated;

grant select on table public.booking_requests to authenticated;
grant select, insert, update, delete on table public.booking_requests to service_role;

create policy booking_requests_staff_select
  on public.booking_requests
  for select
  to authenticated
  using (private.is_staff());

comment on table public.booking_requests is
  'Pending and decided website shoot requests. The approval token is stored only as a SHA-256 hash.';

comment on column public.booking_requests.approval_token_hash is
  'SHA-256 hex digest of the single-use approval token emailed to the studio.';
