    -- ABEX Industrial Pumps - Product Population Script
    -- Run this in the Supabase SQL Editor to populate your store.

    -- Note: This script assumes your table uses 'specs_json' (jsonb). 
    -- If your table was created with 'specs_text' (text), run the following ALTER first:
    -- ALTER TABLE products RENAME COLUMN specs_text TO specs_json;
    -- ALTER TABLE products ALTER COLUMN specs_json TYPE jsonb USING specs_json::jsonb;

    INSERT INTO products (name, slug, price_sgd, image_url, pdf_manual_url, specs_json, stock_level)
    VALUES 
    (
    'Paragon P-Series End Suction Pump', 
    'paragon-p-series-end-suction', 
    2450.00, 
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1000&auto=format&fit=crop', 
    '/manuals/paragon-p-series.pdf', 
    '{"Flow Rate": "450 GPM", "Max Head": "120 ft", "Power": "10 HP", "Material": "Ductile Iron", "Efficiency": "78%"}',
    12
    ),
    (
    'Paragon HSC Double Suction Split Case', 
    'paragon-hsc-double-suction', 
    5800.00, 
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop', 
    '/manuals/paragon-hsc.pdf', 
    '{"Flow Rate": "1200 GPM", "Max Head": "200 ft", "Power": "25 HP", "Material": "Cast Iron / Bronze", "Bearing": "Heavy Duty Rollers"}',
    5
    ),
    (
    'American Marsh 480 Series Slurry Unit', 
    'american-marsh-480-slurry', 
    4200.00, 
    'https://images.unsplash.com/photo-1542332213-9b5a5a3fab35?q=80&w=1000&auto=format&fit=crop', 
    '/manuals/am-480-slurry.pdf', 
    '{"Applications": "Abrasive Slurries", "Solids Handling": "Up to 3 inches", "Power": "20 HP", "Lining": "Hardened Chrome Steel"}',
    8
    ),
    (
    'American Marsh Vertical Turbine Pump', 
    'american-marsh-vt-pump', 
    6500.00, 
    'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=1000&auto=format&fit=crop', 
    '/manuals/am-vt-series.pdf', 
    '{"Stages": "Multi-stage Vertical", "Efficiency": "85%", "Flow Rate": "2000 GPM", "Discharge Size": "12 inches"}',
    3
    ),
    (
    'ABEX Submersible Cutter Wastewater Pump', 
    'abex-submersible-cutter', 
    1250.00, 
    'https://images.unsplash.com/photo-1581094288338-2314dddb7ec4?q=80&w=1000&auto=format&fit=crop', 
    null, 
    '{"Type": "Waste Grinder", "Immersion Depth": "20m", "Cutter Material": "Tungsten Carbide", "Motor": "3 HP"}',
    25
    ),
    (
    'ABEX Portable Dewatering Pump', 
    'abex-portable-dewatering', 
    450.00, 
    'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=1000&auto=format&fit=crop', 
    null, 
    '{"Portability": "Lightweight with Handle", "Flow Rate": "80 GPM", "Max Head": "40 ft", "Connection": "2-inch Camlock"}',
    50
    ),
    (
    'Paragon Multi-Stage Vertical Booster', 
    'paragon-multistage-booster', 
    3800.00, 
    'https://images.unsplash.com/photo-1541888941295-1844641cd460?q=80&w=1000&auto=format&fit=crop', 
    '/manuals/paragon-booster.pdf', 
    '{"Pressure": "15 Bar", "Stages": "10-Stage", "Motor": "15 HP", "Material": "Stainless Steel SS316"}',
    10
    ),
    (
    'ABEX Digital Flow Control Module', 
    'abex-digital-flow-controller', 
    850.00, 
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop', 
    null, 
    '{"Display": "LCD Multi-color Digital", "Communication": "MODBUS / RS485", "Voltage": "220V Single Phase", "Protection": "IP65 Rated"}',
    100
    );
