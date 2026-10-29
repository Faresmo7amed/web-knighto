-- Knowledge Site schema. Run this file once in the Supabase SQL Editor.
-- The owner account is added after creating the Auth user:
-- insert into public.owner_accounts (user_id) values ('AUTH_USER_UUID');

create extension if not exists pgcrypto;

create type public.content_status as enum ('draft', 'scheduled', 'published', 'archived');
create type public.page_kind as enum ('section', 'topic', 'article', 'cheatsheet');
create type public.node_kind as enum ('main', 'sub', 'optional', 'alternative', 'recommended');

create table public.owner_accounts (
    user_id uuid primary key references auth.users(id) on delete cascade,
    created_at timestamptz not null default now()
);

create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.owner_accounts where user_id = auth.uid()) $$;

create table public.pages (
    id uuid primary key default gen_random_uuid(),
    parent_id uuid references public.pages(id) on delete restrict,
    kind public.page_kind not null default 'article',
    title text not null check (char_length(title) between 1 and 180),
    slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    description text,
    icon text,
    banner_url text,
    locale text not null default 'en' check (locale in ('en', 'ar')),
    direction text not null default 'auto' check (direction in ('auto', 'ltr', 'rtl')),
    visibility public.content_status not null default 'draft',
    sort_order integer not null default 0,
    seo_title text,
    seo_description text,
    scheduled_at timestamptz,
    published_at timestamptz,
    deleted_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (parent_id, slug, locale)
);

create table public.articles (
    page_id uuid primary key references public.pages(id) on delete cascade,
    markdown text not null default '',
    reading_minutes integer not null default 1 check (reading_minutes > 0),
    package_tabs_enabled boolean not null default true,
    search_vector tsvector generated always as (to_tsvector('simple', coalesce(markdown, ''))) stored,
    updated_at timestamptz not null default now()
);

create table public.tags (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.page_tags (
    page_id uuid not null references public.pages(id) on delete cascade,
    tag_id uuid not null references public.tags(id) on delete cascade,
    primary key (page_id, tag_id)
);

create table public.roadmaps (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    title text not null,
    description text not null default '',
    category text not null default 'General',
    icon text,
    status public.content_status not null default 'draft',
    deleted_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.roadmap_nodes (
    id uuid primary key default gen_random_uuid(),
    roadmap_id uuid not null references public.roadmaps(id) on delete cascade,
    parent_id uuid references public.roadmap_nodes(id) on delete cascade,
    slug text not null,
    title text not null,
    description text not null default '',
    markdown text not null default '',
    kind public.node_kind not null default 'sub',
    is_locked boolean not null default false,
    sort_order integer not null default 0,
    deleted_at timestamptz,
    unique (roadmap_id, slug)
);

create table public.node_resources (
    id uuid primary key default gen_random_uuid(),
    node_id uuid not null references public.roadmap_nodes(id) on delete cascade,
    title text not null,
    href text not null,
    resource_type text not null check (resource_type in ('docs', 'article', 'video')),
    sort_order integer not null default 0
);

create table public.media (
    id uuid primary key default gen_random_uuid(),
    object_key text not null unique,
    public_url text not null,
    alt_text text not null default '',
    mime_type text not null,
    byte_size bigint not null check (byte_size > 0),
    created_at timestamptz not null default now(),
    deleted_at timestamptz
);

create table public.nav_links (
    id uuid primary key default gen_random_uuid(),
    label text not null,
    href text not null,
    placement text not null default 'main' check (placement in ('main', 'more', 'footer')),
    sort_order integer not null default 0,
    is_visible boolean not null default true
);

create table public.social_links (
    id uuid primary key default gen_random_uuid(),
    label text not null,
    href text not null,
    icon text not null,
    sort_order integer not null default 0,
    is_visible boolean not null default true
);

create table public.site_settings (
    id boolean primary key default true check (id),
    name text not null default '[Site name]',
    owner_name text not null default '[Owner name]',
    description text not null default '',
    default_locale text not null default 'en',
    updated_at timestamptz not null default now()
);

create table public.theme_tokens (
    id uuid primary key default gen_random_uuid(),
    theme text not null check (theme in ('light', 'dark')),
    token text not null,
    value text not null,
    unique (theme, token)
);

create table public.syntax_colors (
    id uuid primary key default gen_random_uuid(),
    theme text not null check (theme in ('light', 'dark')),
    token text not null,
    value text not null,
    unique (theme, token)
);

create table public.package_managers (
    id uuid primary key default gen_random_uuid(),
    id_key text not null unique,
    label text not null,
    install_command text not null,
    run_command text not null,
    sort_order integer not null default 0,
    is_enabled boolean not null default true
);

create table public.legal_pages (
    id uuid primary key default gen_random_uuid(),
    kind text not null unique check (kind in ('about', 'terms', 'privacy', 'copyright', 'contact')),
    title text not null,
    markdown text not null default '',
    updated_at timestamptz not null default now()
);

create table public.article_versions (
    id uuid primary key default gen_random_uuid(),
    page_id uuid not null references public.pages(id) on delete cascade,
    markdown text not null,
    title text not null,
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now()
);

create index pages_parent_sort_idx on public.pages(parent_id, sort_order) where deleted_at is null;
create index pages_published_idx on public.pages(visibility, published_at) where deleted_at is null;
create index articles_search_idx on public.articles using gin(search_vector);
create index roadmap_nodes_roadmap_sort_idx on public.roadmap_nodes(roadmap_id, sort_order) where deleted_at is null;
create index media_active_idx on public.media(created_at desc) where deleted_at is null;

create or replace function public.limit_page_depth()
returns trigger language plpgsql as $$
declare depth integer := 1; ancestor uuid := new.parent_id;
begin
    while ancestor is not null loop
        depth := depth + 1;
        if depth > 4 then raise exception 'Pages may not exceed four levels'; end if;
        select parent_id into ancestor from public.pages where id = ancestor;
    end loop;
    return new;
end $$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

create trigger pages_depth before insert or update of parent_id on public.pages for each row execute function public.limit_page_depth();
create trigger pages_touch before update on public.pages for each row execute function public.touch_updated_at();
create trigger roadmaps_touch before update on public.roadmaps for each row execute function public.touch_updated_at();
create trigger settings_touch before update on public.site_settings for each row execute function public.touch_updated_at();

alter table public.owner_accounts enable row level security;
alter table public.pages enable row level security;
alter table public.articles enable row level security;
alter table public.tags enable row level security;
alter table public.page_tags enable row level security;
alter table public.roadmaps enable row level security;
alter table public.roadmap_nodes enable row level security;
alter table public.node_resources enable row level security;
alter table public.media enable row level security;
alter table public.nav_links enable row level security;
alter table public.social_links enable row level security;
alter table public.site_settings enable row level security;
alter table public.theme_tokens enable row level security;
alter table public.syntax_colors enable row level security;
alter table public.package_managers enable row level security;
alter table public.legal_pages enable row level security;
alter table public.article_versions enable row level security;

create policy "owner manages all" on public.owner_accounts for all using (public.is_owner()) with check (public.is_owner());
create policy "published pages are public" on public.pages for select using ((visibility = 'published' and deleted_at is null) or public.is_owner());
create policy "owner manages pages" on public.pages for all using (public.is_owner()) with check (public.is_owner());
create policy "published article content is public" on public.articles for select using (exists (select 1 from public.pages p where p.id = page_id and p.visibility = 'published' and p.deleted_at is null) or public.is_owner());
create policy "owner manages articles" on public.articles for all using (public.is_owner()) with check (public.is_owner());
create policy "public tags" on public.tags for select using (true);
create policy "owner manages tags" on public.tags for all using (public.is_owner()) with check (public.is_owner());
create policy "public page tags" on public.page_tags for select using (true);
create policy "owner manages page tags" on public.page_tags for all using (public.is_owner()) with check (public.is_owner());
create policy "published roadmaps are public" on public.roadmaps for select using ((status = 'published' and deleted_at is null) or public.is_owner());
create policy "owner manages roadmaps" on public.roadmaps for all using (public.is_owner()) with check (public.is_owner());
create policy "published nodes are public" on public.roadmap_nodes for select using (exists (select 1 from public.roadmaps r where r.id = roadmap_id and r.status = 'published' and r.deleted_at is null) or public.is_owner());
create policy "owner manages nodes" on public.roadmap_nodes for all using (public.is_owner()) with check (public.is_owner());
create policy "public node resources" on public.node_resources for select using (true);
create policy "owner manages node resources" on public.node_resources for all using (public.is_owner()) with check (public.is_owner());
create policy "public active media" on public.media for select using (deleted_at is null or public.is_owner());
create policy "owner manages media" on public.media for all using (public.is_owner()) with check (public.is_owner());
create policy "public visible nav" on public.nav_links for select using (is_visible or public.is_owner());
create policy "owner manages nav" on public.nav_links for all using (public.is_owner()) with check (public.is_owner());
create policy "public visible social" on public.social_links for select using (is_visible or public.is_owner());
create policy "owner manages social" on public.social_links for all using (public.is_owner()) with check (public.is_owner());
create policy "public settings" on public.site_settings for select using (true);
create policy "owner manages settings" on public.site_settings for all using (public.is_owner()) with check (public.is_owner());
create policy "public theme tokens" on public.theme_tokens for select using (true);
create policy "owner manages theme tokens" on public.theme_tokens for all using (public.is_owner()) with check (public.is_owner());
create policy "public syntax colors" on public.syntax_colors for select using (true);
create policy "owner manages syntax colors" on public.syntax_colors for all using (public.is_owner()) with check (public.is_owner());
create policy "public enabled managers" on public.package_managers for select using (is_enabled or public.is_owner());
create policy "owner manages managers" on public.package_managers for all using (public.is_owner()) with check (public.is_owner());
create policy "public legal pages" on public.legal_pages for select using (true);
create policy "owner manages legal" on public.legal_pages for all using (public.is_owner()) with check (public.is_owner());
create policy "owner manages versions" on public.article_versions for all using (public.is_owner()) with check (public.is_owner());

-- RLS decides which rows each API role may see. PostgreSQL privileges allow
-- those roles to access the tables so the policies can be evaluated.
grant usage on schema public to anon, authenticated, service_role;
grant select on all tables in schema public to anon, authenticated;
grant all privileges on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;

alter default privileges in schema public grant select on tables to anon, authenticated;
alter default privileges in schema public grant all privileges on tables to service_role;
alter default privileges in schema public grant usage, select on sequences to authenticated, service_role;
