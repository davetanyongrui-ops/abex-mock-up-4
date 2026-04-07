-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    price_sgd DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    pdf_manual_url TEXT,
    specs_text TEXT,
    stock_level INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Pages Table (Dynamic Page Builder)
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_email TEXT NOT NULL,
    total_sgd DECIMAL(10, 2) NOT NULL,
    items_json JSONB NOT NULL,
    stripe_session_id TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Inquiries Table
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'contact' or 'quote'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Setup
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS (Products & Pages)
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to pages" ON pages FOR SELECT USING (true);

-- PUBLIC INSERT ACCESS (Inquiries only)
CREATE POLICY "Allow public insert queries" ON inquiries FOR INSERT WITH CHECK (true);

-- ADMIN FULL ACCESS (Must be authenticated user from auth.users)
-- (Assuming Admins are simply any authenticated user in this setup)
CREATE POLICY "Allow authenticated full access to products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to pages" ON pages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to inquiries" ON inquiries FOR ALL USING (auth.role() = 'authenticated');
