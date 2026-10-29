-- Sign-in attempts, written by the server only (service role), readable by the owner.
create table if not exists public.login_attempts (
    id uuid primary key default gen_random_uuid(),
    email text not null,
    ip text,
    succeeded boolean not null,
    created_at timestamptz not null default now()
);
create index if not exists login_attempts_email_time_idx on public.login_attempts (email, created_at desc);
alter table public.login_attempts enable row level security;
create policy "owner reads attempts" on public.login_attempts for select using (public.is_owner());
grant select on public.login_attempts to authenticated;
grant all privileges on public.login_attempts to service_role;

-- The owner now counts as owner only after the 2FA step, once 2FA is enrolled.
create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path = public
as $$
    select exists (select 1 from public.owner_accounts where user_id = auth.uid())
    and (
        coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
        or not exists (select 1 from auth.mfa_factors where user_id = auth.uid() and status = 'verified')
    )
$$;