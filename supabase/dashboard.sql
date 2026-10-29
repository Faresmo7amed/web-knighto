drop policy if exists "published pages are public" on public.pages;
create policy "published pages are public" on public.pages for select using (
    ((visibility = 'published' or (visibility = 'scheduled' and scheduled_at <= now())) and deleted_at is null) or public.is_owner()
);
drop policy if exists "published article content is public" on public.articles;
create policy "published article content is public" on public.articles for select using (
    exists (select 1 from public.pages p where p.id = page_id and (p.visibility = 'published' or (p.visibility = 'scheduled' and p.scheduled_at <= now())) and p.deleted_at is null)
    or public.is_owner()
);
create index if not exists article_versions_page_time_idx on public.article_versions (page_id, created_at desc);