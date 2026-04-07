insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'product-images' );

create policy "Auth Insert" 
on storage.objects for insert 
with check ( bucket_id = 'product-images' and auth.role() = 'authenticated' );
