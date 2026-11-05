create table if not exists public.business_branches (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.business_sales (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.business_stock (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.business_customers (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.business_suppliers (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.business_expenses (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.business_employees (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.store_accounts (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.store_accounts enable row level security;

drop policy if exists "store_accounts_public_read" on public.store_accounts;
create policy "store_accounts_public_read"
  on public.store_accounts for select
  to anon, authenticated
  using (true);

drop policy if exists "store_accounts_public_write" on public.store_accounts;
create policy "store_accounts_public_write"
  on public.store_accounts for all
  to anon, authenticated
  using (true)
  with check (true);

alter table public.business_sales enable row level security;

drop policy if exists "business_sales_public_read" on public.business_sales;
create policy "business_sales_public_read"
  on public.business_sales for select
  to anon, authenticated
  using (true);

drop policy if exists "business_sales_public_write" on public.business_sales;
create policy "business_sales_public_write"
  on public.business_sales for all
  to anon, authenticated
  using (true)
  with check (true);
