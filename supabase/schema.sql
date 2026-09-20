-- ==========================================
-- WISHES (Ønskeskyen Alternative) Schema
-- ==========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- Trigger to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. WISHLISTS
create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  slug text unique not null,
  event_date date,
  cover_theme text default 'nordic', -- 'nordic', 'rose', 'sage', 'sky', 'sunset', 'amber'
  is_public boolean default true not null,
  hide_reservations_from_owner boolean default true not null, -- GoWish surprise mode
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists wishlists_slug_idx on public.wishlists(slug);
create index if not exists wishlists_user_id_idx on public.wishlists(user_id);


-- 3. WISHES
create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid references public.wishlists(id) on delete cascade not null,
  title text not null,
  description text,
  price numeric(10, 2),
  currency text default 'DKK' not null,
  url text,
  image_url text,
  store_name text,
  priority text default 'normal', -- 'must_have', 'normal', 'nice_to_have'
  order_index integer default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists wishes_wishlist_id_idx on public.wishes(wishlist_id);


-- 4. RESERVATIONS
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  wish_id uuid references public.wishes(id) on delete cascade not null unique,
  reserver_name text not null,
  reserver_email text,
  session_token text not null, -- Secret token saved in guest's browser to allow cancellation
  notes text,
  created_at timestamptz default now() not null
);

create index if not exists reservations_wish_id_idx on public.reservations(wish_id);
create index if not exists reservations_session_token_idx on public.reservations(session_token);


-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

alter table public.profiles enable row level security;
alter table public.wishlists enable row level security;
alter table public.wishes enable row level security;
alter table public.reservations enable row level security;

-- PROFILES policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- WISHLISTS policies
create policy "Public wishlists are viewable by anyone"
  on public.wishlists for select
  using (is_public = true or auth.uid() = user_id);

create policy "Users can insert their own wishlists"
  on public.wishlists for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own wishlists"
  on public.wishlists for update
  using (auth.uid() = user_id);

create policy "Users can delete their own wishlists"
  on public.wishlists for delete
  using (auth.uid() = user_id);

-- WISHES policies
create policy "Wishes in visible wishlists are viewable by anyone"
  on public.wishes for select
  using (
    exists (
      select 1 from public.wishlists w
      where w.id = wishes.wishlist_id
      and (w.is_public = true or w.user_id = auth.uid())
    )
  );

create policy "Wishlist owners can insert wishes"
  on public.wishes for insert
  with check (
    exists (
      select 1 from public.wishlists w
      where w.id = wishlist_id
      and w.user_id = auth.uid()
    )
  );

create policy "Wishlist owners can update wishes"
  on public.wishes for update
  using (
    exists (
      select 1 from public.wishlists w
      where w.id = wishes.wishlist_id
      and w.user_id = auth.uid()
    )
  );

create policy "Wishlist owners can delete wishes"
  on public.wishes for delete
  using (
    exists (
      select 1 from public.wishlists w
      where w.id = wishes.wishlist_id
      and w.user_id = auth.uid()
    )
  );

-- RESERVATIONS policies
create policy "Reservations can be viewed for public wishes"
  on public.reservations for select
  using (
    exists (
      select 1 from public.wishes wi
      join public.wishlists wl on wl.id = wi.wishlist_id
      where wi.id = reservations.wish_id
      and (wl.is_public = true or wl.user_id = auth.uid())
    )
  );

create policy "Guests can reserve an unreserved wish"
  on public.reservations for insert
  with check (
    exists (
      select 1 from public.wishes wi
      join public.wishlists wl on wl.id = wi.wishlist_id
      where wi.id = wish_id
      and wl.is_public = true
    )
  );

create policy "Guests can cancel their own reservation"
  on public.reservations for delete
  using (
    session_token is not null
  );
