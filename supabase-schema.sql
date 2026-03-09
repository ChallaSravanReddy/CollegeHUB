create table if not exists public.problems (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  screenshot_url text,
  contact_email text,
  tags text[] default '{}',
  admin_note text,
  solution_comment text,
  votes integer not null default 0,
  is_public boolean not null default false,
  is_opportunity boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.problems enable row level security;

create policy "Public read only public posts"
on public.problems
for select
using (is_public = true);
