alter table public.settings enable row level security;

drop policy if exists "authenticated read settings" on public.settings;
drop policy if exists "authenticated insert settings" on public.settings;
drop policy if exists "authenticated update settings" on public.settings;

create policy "authenticated read settings" on public.settings for select to authenticated using (true);
create policy "authenticated insert settings" on public.settings for insert to authenticated with check (true);
create policy "authenticated update settings" on public.settings for update to authenticated using (true) with check (true);
