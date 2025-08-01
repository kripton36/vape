-- Insert default categories
INSERT INTO categories (name, slug, description, is_active) VALUES
('Flower', 'flower', 'Premium cannabis flower strains for the ultimate zen experience', true),
('Edibles', 'edibles', 'Delicious cannabis-infused treats and gummies', true),
('Concentrates', 'concentrates', 'High-quality concentrates and extracts', true),
('Vapes', 'vapes', 'Portable vaporizers and cartridges', true),
('Topicals', 'topicals', 'Cannabis-infused creams, balms, and lotions', true),
('Accessories', 'accessories', 'Everything you need for the perfect session', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (
    name, slug, description, price, original_price, category_id, 
    thc_content, cbd_content, effects, flavors, in_stock, stock_count,
    is_featured, is_new, rating, review_count
) VALUES
(
    'Zen Master OG',
    'zen-master-og',
    'A calming indica strain perfect for meditation and deep relaxation. This premium flower offers earthy pine flavors with hints of sweet honey.',
    45.99,
    55.99,
    (SELECT id FROM categories WHERE slug = 'flower'),
    '24%',
    '2%',
    '["Relaxed", "Happy", "Sleepy", "Euphoric"]',
    '["Earthy", "Pine", "Sweet", "Honey"]',
    true,
    25,
    true,
    false,
    4.8,
    124
),
(
    'Panda Express',
    'panda-express',
    'An energizing sativa perfect for creative bamboo sessions. Uplifting effects with tropical citrus flavors.',
    38.99,
    42.99,
    (SELECT id FROM categories WHERE slug = 'flower'),
    '19%',
    '0.5%',
    '["Energetic", "Creative", "Uplifted", "Focused"]',
    '["Citrus", "Tropical", "Sweet", "Mango"]',
    true,
    18,
    true,
    true,
    4.6,
    89
),
(
    'Bamboo Bliss Gummies',
    'bamboo-bliss-gummies',
    'Delicious gummies infused with zen energy. Each gummy contains 10mg THC for the perfect micro-dose experience.',
    25.99,
    null,
    (SELECT id FROM categories WHERE slug = 'edibles'),
    '10mg per piece',
    '2mg per piece',
    '["Relaxed", "Happy", "Creative"]',
    '["Berry", "Tropical", "Sweet"]',
    true,
    50,
    false,
    true,
    4.7,
    156
),
(
    'Zen Warrior Concentrate',
    'zen-warrior-concentrate',
    'Premium live resin concentrate with intense flavor and potency. Perfect for experienced users seeking powerful effects.',
    65.99,
    null,
    (SELECT id FROM categories WHERE slug = 'concentrates'),
    '78%',
    '1%',
    '["Euphoric", "Relaxed", "Creative"]',
    '["Diesel", "Earthy", "Pungent"]',
    true,
    12,
    true,
    false,
    4.9,
    45
),
(
    'Peaceful Panda Vape',
    'peaceful-panda-vape',
    'Smooth and flavorful vape cartridge with balanced hybrid effects. Perfect for on-the-go zen moments.',
    42.99,
    null,
    (SELECT id FROM categories WHERE slug = 'vapes'),
    '85%',
    '5%',
    '["Balanced", "Relaxed", "Uplifted"]',
    '["Vanilla", "Sweet", "Floral"]',
    true,
    30,
    false,
    false,
    4.5,
    78
),
(
    'Zen Garden Topical',
    'zen-garden-topical',
    'Soothing cannabis-infused balm for muscle relief and relaxation. Made with organic ingredients.',
    28.99,
    null,
    (SELECT id FROM categories WHERE slug = 'topicals'),
    '100mg',
    '200mg',
    '["Pain Relief", "Relaxed", "Soothing"]',
    '["Eucalyptus", "Lavender", "Mint"]',
    true,
    40,
    false,
    false,
    4.4,
    67
),
(
    'Bamboo Dreams Edibles',
    'bamboo-dreams-edibles',
    'Artisanal chocolate bars infused with premium cannabis. Rich, smooth chocolate with perfect dosing.',
    35.99,
    null,
    (SELECT id FROM categories WHERE slug = 'edibles'),
    '100mg total',
    '20mg total',
    '["Euphoric", "Relaxed", "Happy"]',
    '["Chocolate", "Vanilla", "Caramel"]',
    true,
    22,
    false,
    true,
    4.3,
    91
),
(
    'Meditation Master',
    'meditation-master',
    'High-CBD strain perfect for mindfulness and meditation practices. Calming effects without heavy psychoactivity.',
    48.99,
    null,
    (SELECT id FROM categories WHERE slug = 'flower'),
    '8%',
    '18%',
    '["Calm", "Focused", "Clear-headed"]',
    '["Herbal", "Floral", "Citrus"]',
    true,
    15,
    true,
    false,
    4.6,
    103
)
ON CONFLICT (slug) DO NOTHING;

-- Insert product variants for some products
INSERT INTO product_variants (product_id, name, price, stock_count, weight_grams) VALUES
((SELECT id FROM products WHERE slug = 'zen-master-og'), '1g', 45.99, 25, 1.0),
((SELECT id FROM products WHERE slug = 'zen-master-og'), '3.5g', 140.99, 15, 3.5),
((SELECT id FROM products WHERE slug = 'zen-master-og'), '7g', 260.99, 8, 7.0),
((SELECT id FROM products WHERE slug = 'panda-express'), '1g', 38.99, 18, 1.0),
((SELECT id FROM products WHERE slug = 'panda-express'), '3.5g', 125.99, 12, 3.5),
((SELECT id FROM products WHERE slug = 'bamboo-bliss-gummies'), '10 pack', 25.99, 50, 100.0),
((SELECT id FROM products WHERE slug = 'bamboo-bliss-gummies'), '20 pack', 45.99, 30, 200.0)
ON CONFLICT DO NOTHING;

-- Create admin user (password: admin123!)
INSERT INTO users (
    email, password_hash, first_name, last_name, role, is_verified,
    loyalty_points, wallet_balance
) VALUES (
    'admin@pandacannabis.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVoxFxHlElLiTf2i',
    'Admin',
    'Panda',
    'admin',
    true,
    0,
    0.00
) ON CONFLICT (email) DO NOTHING;

-- Create sample test user (password: password123!)
INSERT INTO users (
    email, password_hash, first_name, last_name, role, is_verified,
    loyalty_points, wallet_balance
) VALUES (
    'user@example.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVoxFxHlElLiTf2i',
    'Test',
    'User',
    'user',
    true,
    250,
    50.00
) ON CONFLICT (email) DO NOTHING;

-- Insert some sample coupons
INSERT INTO coupons (code, type, value, minimum_order_amount, usage_limit, is_active, expires_at) VALUES
('WELCOME10', 'percentage', 10.00, 50.00, 100, true, CURRENT_TIMESTAMP + INTERVAL '30 days'),
('PANDA20', 'fixed_amount', 20.00, 100.00, 50, true, CURRENT_TIMESTAMP + INTERVAL '60 days'),
('NEWUSER', 'percentage', 15.00, 75.00, 200, true, CURRENT_TIMESTAMP + INTERVAL '90 days')
ON CONFLICT (code) DO NOTHING;