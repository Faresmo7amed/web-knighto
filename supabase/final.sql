alter table public.roadmaps add column if not exists featured boolean not null default false;
alter table public.site_settings add column if not exists extra jsonb not null default '{}'::jsonb;
insert into public.site_settings (id) values (true) on conflict do nothing;
insert into public.legal_pages (kind, title) values
    ('about', 'About'), ('terms', 'Terms and Conditions'), ('privacy', 'Privacy Policy'),
    ('copyright', 'Copyright Notice'), ('contact', 'Contact')
on conflict (kind) do nothing;