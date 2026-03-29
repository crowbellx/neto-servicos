-- Supabase Storage setup for media uploads
-- Execute this script in Supabase SQL Editor.

-- 1) Create or update the media bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2) Remove existing policies for idempotency.
drop policy if exists "Public read media objects" on storage.objects;
drop policy if exists "Authenticated upload media objects" on storage.objects;
drop policy if exists "Authenticated update media objects" on storage.objects;
drop policy if exists "Authenticated delete media objects" on storage.objects;

-- 3) Public read for media bucket.
create policy "Public read media objects"
on storage.objects
for select
to public
using (bucket_id = 'media');

-- 4) Authenticated users can upload only in allowed folders.
create policy "Authenticated upload media objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'media'
  and (storage.foldername(name))[1] in ('uploads', 'midia', 'blog', 'portfolio')
);

-- 5) Authenticated users can update files in media bucket.
create policy "Authenticated update media objects"
on storage.objects
for update
to authenticated
using (bucket_id = 'media')
with check (bucket_id = 'media');

-- 6) Authenticated users can delete files in media bucket.
create policy "Authenticated delete media objects"
on storage.objects
for delete
to authenticated
using (bucket_id = 'media');
