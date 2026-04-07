-- ABEX E-COMMERCE - FULL DATABASE SETUP
-- RUN THIS FIRST IN THE SUPABASE SQL EDITOR

-- 1. CLEANUP (Optional: Uncomment if you want to reset)
-- DROP TABLE IF EXISTS inquiries;
-- DROP TABLE IF EXISTS orders;
-- DROP TABLE IF EXISTS pages;
-- DROP TABLE IF EXISTS products;

-- 2. CREATE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT auth.uid(), -- Or use gen_random_uuid() for public records
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price_sgd NUMERIC NOT NULL,
  image_url TEXT,
  pdf_manual_url TEXT,
  specs_json JSONB DEFAULT '{}',
  stock_level INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CREATE PAGES TABLE (For CMS)
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content_json JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CREATE ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email TEXT NOT NULL,
  total_sgd NUMERIC NOT NULL,
  items_json JSONB NOT NULL,
  stripe_session_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CREATE INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES

-- Products: Public Read, Admin All
CREATE POLICY "Allow public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow admin full access for products" ON products TO authenticated USING (true);

-- Pages: Public Read, Admin All
CREATE POLICY "Allow public read access for pages" ON pages FOR SELECT USING (true);
CREATE POLICY "Allow admin full access for pages" ON pages TO authenticated USING (true);

-- Inquiries: Public Insert, Admin Read/Write
CREATE POLICY "Allow public insert for inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin full access for inquiries" ON inquiries TO authenticated USING (true);

-- Orders: Admin Only
CREATE POLICY "Allow admin full access for orders" ON orders TO authenticated USING (true);

-- 8. SEED DATA (INDUSTRIAL PUMPS)
INSERT INTO products (id, name, slug, price_sgd, image_url, pdf_manual_url, specs_json, stock_level)
VALUES 
(gen_random_uuid(), 'Paragon P-Series End Suction Pump', 'paragon-p-series-end-suction', 2450.00, 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1000&auto=format&fit=crop', '/manuals/paragon-p-series.pdf', '{"Flow Rate": "450 GPM", "Max Head": "120 ft", "Power": "10 HP", "Material": "Ductile Iron", "Efficiency": "78%"}', 12),
(gen_random_uuid(), 'Paragon HSC Double Suction Split Case', 'paragon-hsc-double-suction', 5800.00, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop', '/manuals/paragon-hsc.pdf', '{"Flow Rate": "1200 GPM", "Max Head": "200 ft", "Power": "25 HP", "Material": "Cast Iron / Bronze", "Bearing": "Heavy Duty Rollers"}', 5),
(gen_random_uuid(), 'American Marsh 480 Series Slurry Unit', 'american-marsh-480-slurry', 4200.00, 'https://images.unsplash.com/photo-1542332213-9b5a5a3fab35?q=80&w=1000&auto=format&fit=crop', '/manuals/am-480-slurry.pdf', '{"Applications": "Abrasive Slurries", "Solids Handling": "Up to 3 inches", "Power": "20 HP", "Lining": "Hardened Chrome Steel"}', 8),
(gen_random_uuid(), 'American Marsh Vertical Turbine Pump', 'american-marsh-vt-pump', 6500.00, 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=1000&auto=format&fit=crop', '/manuals/am-vt-series.pdf', '{"Stages": "Multi-stage Vertical", "Efficiency": "85%", "Flow Rate": "2000 GPM", "Discharge Size": "12 inches"}', 3),
(gen_random_uuid(), 'ABEX Submersible Cutter Wastewater Pump', 'abex-submersible-cutter', 1250.00, 'https://images.unsplash.com/photo-1581094288338-2314dddb7ec4?q=80&w=1000&auto=format&fit=crop', null, '{"Type": "Waste Grinder", "Immersion Depth": "20m", "Cutter Material": "Tungsten Carbide", "Motor": "3 HP"}', 25),
(gen_random_uuid(), 'ABEX Portable Dewatering Pump', 'abex-portable-dewatering', 450.00, 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=1000&auto=format&fit=crop', null, '{"Portability": "Lightweight with Handle", "Flow Rate": "80 GPM", "Max Head": "40 ft", "Connection": "2-inch Camlock"}', 50),
(gen_random_uuid(), 'Paragon Multi-Stage Vertical Booster', 'paragon-multistage-booster', 3800.00, 'https://images.unsplash.com/photo-1541888941295-1844641cd460?q=80&w=1000&auto=format&fit=crop', '/manuals/paragon-booster.pdf', '{"Pressure": "15 Bar", "Stages": "10-Stage", "Motor": "15 HP", "Material": "Stainless Steel SS316"}', 10),
(gen_random_uuid(), 'ABEX Digital Flow Control Module', 'abex-digital-flow-controller', 850.00, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop', null, '{"Display": "LCD Multi-color Digital", "Communication": "MODBUS / RS485", "Voltage": "220V Single Phase", "Protection": "IP65 Rated"}', 100);
