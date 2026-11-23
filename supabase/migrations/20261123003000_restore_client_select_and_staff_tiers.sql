-- Restore table-level SELECT for signed-in users. Column grants made select('*') fail
-- for staff and for website clients. Row access stays on RLS.
--
-- The tier value moves to client_pricing_tiers, which only staff (and the service
-- role) can read. public.clients becomes a view: select * still works, and
-- pricing_tier is null unless the caller is staff or the service role.

create table public.client_pricing_tiers (
  client_id uuid primary key references public.clients (id) on delete cascade,
  tier text not null,
  updated_at timestamptz not null default now(),
  constraint client_pricing_tiers_tier_check
    check (tier in ('standard', 'legacy', 'corporate'))
);

insert into public.client_pricing_tiers (client_id, tier)
select id, pricing_tier
from public.clients
where pricing_tier is not null;

alter table public.client_pricing_tiers enable row level security;

create policy client_pricing_tiers_staff_all
  on public.client_pricing_tiers
  for all
  to authenticated
  using (private.is_staff())
  with check (private.is_staff());

revoke all on table public.client_pricing_tiers from public, anon;
grant select, insert, update, delete on table public.client_pricing_tiers to authenticated;
grant all on table public.client_pricing_tiers to service_role;

comment on table public.client_pricing_tiers is
  'Staff-only pricing tier for a client. Clients cannot read this table. public.clients.pricing_tier is derived from it and is null for non-staff.';

create or replace function private.preserve_client_approval()
returns trigger
language plpgsql
security definer
set search_path to public
as $$
begin
  if auth.role() = 'service_role' or private.is_staff() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.is_approved := false;
    return new;
  end if;

  new.is_approved := old.is_approved;
  return new;
end;
$$;

drop policy if exists "Clients can insert own client record" on public.clients;

create policy "Clients can insert own client record"
  on public.clients
  for insert
  to public
  with check (
    user_id = auth.uid()
    and is_approved = false
  );

alter table public.clients drop column pricing_tier;

alter table public.clients set schema private;

create view public.clients
with (security_invoker = true) as
select
  base.id,
  base.company_name,
  base.email,
  base.phone,
  base.street,
  base.zip_code,
  base.city,
  base.country,
  base.created_at,
  base.contact_first_name,
  base.contact_last_name,
  base.lexoffice_contact_id,
  base.contact_name,
  base.billing_address,
  base.lexoffice_id,
  base.contact_persons,
  base.billing_street,
  base.billing_city,
  base.billing_postal_code,
  base.billing_country,
  base.address_supplement,
  base.user_id,
  base.first_name,
  base.last_name,
  base.company_address,
  base.phone_number,
  base.is_approved,
  (
    select assigned.tier
    from public.client_pricing_tiers as assigned
    where assigned.client_id = base.id
  ) as pricing_tier
from private.clients as base;

comment on view public.clients is
  'Client profile. pricing_tier is visible only to staff and the service role; other callers get null. @primaryKey id';

create or replace function public.clients_view_insert()
returns trigger
language plpgsql
security invoker
set search_path = public, private
as $$
declare
  new_id uuid;
begin
  insert into private.clients (
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
  ) values (
    coalesce(new.id, gen_random_uuid()),
    new.company_name,
    new.email,
    new.phone,
    new.street,
    new.zip_code,
    new.city,
    new.country,
    coalesce(new.created_at, timezone('utc', now())),
    new.contact_first_name,
    new.contact_last_name,
    new.lexoffice_contact_id,
    new.contact_name,
    new.billing_address,
    new.lexoffice_id,
    coalesce(new.contact_persons, '[]'::jsonb),
    new.billing_street,
    new.billing_city,
    new.billing_postal_code,
    new.billing_country,
    new.address_supplement,
    new.user_id,
    new.first_name,
    new.last_name,
    new.company_address,
    new.phone_number,
    coalesce(new.is_approved, false)
  )
  returning id into new_id;

  if (auth.role() = 'service_role' or private.is_staff()) and new.pricing_tier is not null then
    if new.pricing_tier not in ('standard', 'legacy', 'corporate') then
      raise exception 'pricing_tier must be standard, legacy, or corporate';
    end if;
    insert into public.client_pricing_tiers (client_id, tier)
    values (new_id, new.pricing_tier);
  end if;

  new.id := new_id;
  new.pricing_tier := (
    select assigned.tier
    from public.client_pricing_tiers as assigned
    where assigned.client_id = new_id
  );
  return new;
end;
$$;

create or replace function public.clients_view_update()
returns trigger
language plpgsql
security invoker
set search_path = public, private
as $$
begin
  update private.clients
  set
    company_name = new.company_name,
    email = new.email,
    phone = new.phone,
    street = new.street,
    zip_code = new.zip_code,
    city = new.city,
    country = new.country,
    contact_first_name = new.contact_first_name,
    contact_last_name = new.contact_last_name,
    lexoffice_contact_id = new.lexoffice_contact_id,
    contact_name = new.contact_name,
    billing_address = new.billing_address,
    lexoffice_id = new.lexoffice_id,
    contact_persons = new.contact_persons,
    billing_street = new.billing_street,
    billing_city = new.billing_city,
    billing_postal_code = new.billing_postal_code,
    billing_country = new.billing_country,
    address_supplement = new.address_supplement,
    user_id = new.user_id,
    first_name = new.first_name,
    last_name = new.last_name,
    company_address = new.company_address,
    phone_number = new.phone_number,
    is_approved = new.is_approved
  where id = old.id;

  if auth.role() = 'service_role' or private.is_staff() then
    if new.pricing_tier is null then
      delete from public.client_pricing_tiers where client_id = old.id;
    elsif new.pricing_tier in ('standard', 'legacy', 'corporate') then
      insert into public.client_pricing_tiers (client_id, tier)
      values (old.id, new.pricing_tier)
      on conflict (client_id) do update
        set tier = excluded.tier,
            updated_at = now();
    else
      raise exception 'pricing_tier must be standard, legacy, or corporate';
    end if;
  end if;

  new.pricing_tier := (
    select assigned.tier
    from public.client_pricing_tiers as assigned
    where assigned.client_id = old.id
  );
  return new;
end;
$$;

create or replace function public.clients_view_delete()
returns trigger
language plpgsql
security invoker
set search_path = public, private
as $$
begin
  delete from private.clients where id = old.id;
  return old;
end;
$$;

create trigger clients_instead_of_insert
  instead of insert on public.clients
  for each row
  execute function public.clients_view_insert();

create trigger clients_instead_of_update
  instead of update on public.clients
  for each row
  execute function public.clients_view_update();

create trigger clients_instead_of_delete
  instead of delete on public.clients
  for each row
  execute function public.clients_view_delete();

grant select, insert, update, delete on table private.clients to authenticated;
grant select on table private.clients to anon;

revoke all on table public.clients from public, anon;
grant select, insert, update, delete on table public.clients to authenticated;
grant all on table public.clients to service_role;

grant select, insert, update, delete on table public.pricing_tier_prices to authenticated;

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
set search_path = public, private
as $$
  select
    price.item_key,
    price.label_de,
    price.label_en,
    price.unit,
    price.price_net_cents,
    price.sort_order
  from public.pricing_tier_prices as price
  join public.client_pricing_tiers as assigned
    on assigned.tier = price.tier
  join private.clients as client_profile
    on client_profile.id = assigned.client_id
  where client_profile.user_id = auth.uid()
    and client_profile.is_approved is true
    and price.active is true
  order by price.sort_order nulls last, price.item_key;
$$;

revoke all on function public.get_my_booking_prices() from public, anon;
grant execute on function public.get_my_booking_prices() to authenticated;

notify pgrst, 'reload schema';
