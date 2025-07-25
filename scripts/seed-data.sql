-- Insert FAQ categories
INSERT INTO faq_categories (name, slug, description, sort_order) VALUES
('Getting Started', 'getting-started', 'Basic information for new customers', 1),
('Products', 'products', 'Information about our zen cannabis products', 2),
('Orders & Shipping', 'orders-shipping', 'Order processing and delivery info', 3),
('Account & Payments', 'account-payments', 'Account management and payment options', 4),
('Legal & Compliance', 'legal-compliance', 'Age verification and legal requirements', 5);

-- Insert FAQ items
INSERT INTO faq_items (category_id, question, answer, sort_order) VALUES
(1, 'How do I create an account?', 'Creating your Green Panda account is simple! Click the "Login" button and select "Sign Up". You''ll need to provide basic information and verify your age (21+). Our zen pandas will guide you through the process peacefully.', 1),
(1, 'What is age verification?', 'We require all customers to be 21 or older. During registration, you''ll need to upload a valid government-issued ID. Our panda team reviews all documents to ensure compliance with local laws.', 2),
(1, 'How do loyalty points work?', 'Earn panda points with every purchase! 1 point = $0.01. Get bonus points for reviews, referrals, and special promotions. Redeem points at checkout for instant savings on your favorite zen products.', 3),

(2, 'What types of products do you offer?', 'Green Panda offers premium cannabis flower, delicious edibles (gummies, chocolates, cookies), concentrates, and smoking accessories. All products are carefully curated for the ultimate zen experience.', 1),
(2, 'How do I know which strain is right for me?', 'Our product pages include detailed information about effects, THC/CBD content, and strain type (Sativa, Indica, Hybrid). Start with lower doses and consult our chat support for personalized recommendations from our zen experts.', 2),
(2, 'Are your products lab tested?', 'All Green Panda products undergo rigorous third-party lab testing for potency, pesticides, and contaminants. Lab results are available on request for complete peace of mind.', 3),

(3, 'How long does shipping take?', 'Standard shipping takes 2-3 business days within state. Express shipping (1-2 days) is available for urgent zen needs. All orders are packaged discreetly with our signature panda care.', 1),
(3, 'Do you offer same-day delivery?', 'Yes! Same-day delivery is available in select metro areas. Check your zip code at checkout to see if you''re in our zen delivery zone.', 2),
(3, 'How can I track my order?', 'Once your order ships, you''ll receive a tracking number via email. You can also check your order status anytime in your account dashboard.', 3),

(4, 'What payment methods do you accept?', 'We accept major credit cards, debit cards, cryptocurrency (Bitcoin, Ethereum), and CashApp. Your payment information is always secure with our encrypted checkout process.', 1),
(4, 'Can I use my wallet balance for purchases?', 'Yes! Top up your Green Panda wallet for faster checkout. Wallet funds never expire and can be used for any purchase. Perfect for budgeting your zen shopping.', 2),
(4, 'How do I update my account information?', 'Visit your account dashboard to update personal information, shipping addresses, and payment methods. Changes are saved instantly for your convenience.', 3),

(5, 'Is cannabis legal in my state?', 'Cannabis laws vary by state. We only ship to states where cannabis is legal for adult use (21+). Our system automatically verifies your location during checkout.', 1),
(5, 'Do you ship internationally?', 'Currently, Green Panda only ships within the United States to states with legal cannabis programs. International shipping is not available due to federal regulations.', 2),
(5, 'How do you ensure privacy?', 'Your privacy is our priority. All packages are shipped in plain, unmarked boxes with no cannabis-related branding. Your personal information is never shared with third parties.', 3);

-- Insert categories
INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES
('Flower', 'flower', 'Premium cannabis flower strains for the ultimate zen experience', '/placeholder-flower1.png', 1),
('Edibles', 'edibles', 'Delicious cannabis-infused treats for peaceful relaxation', '/placeholder-gummies.png', 2),
('Concentrates', 'concentrates', 'High-potency extracts for experienced zen seekers', '/placeholder-defpf.png', 3),
('Accessories', 'accessories', 'Essential tools for your cannabis journey', '/placeholder-bong.png', 4);

-- Insert products
INSERT INTO products (name, slug, description, short_description, category_id, price, original_price, sku, stock_quantity, thc_content, cbd_content, strain_type, effects, images, is_featured) VALUES
('Zen Master Kush', 'zen-master-kush', 'A perfectly balanced hybrid strain that brings inner peace and tranquility. Grown with love by our panda cultivators, this premium flower delivers a smooth, euphoric high perfect for meditation and relaxation.', 'Premium hybrid strain for ultimate zen relaxation', 1, 45.00, 55.00, 'ZMK-001', 25, '22%', '1%', 'hybrid', '["relaxed", "euphoric", "peaceful", "creative"]', '["/placeholder-flower1.png", "/placeholder-flower2.png"]', true),

('Panda''s Dream Indica', 'pandas-dream-indica', 'Drift into peaceful slumber with this potent indica strain. Perfect for evening meditation or winding down after a long day. Notes of earth and pine create a grounding experience.', 'Potent indica for deep relaxation and sleep', 1, 42.00, 50.00, 'PDI-002', 18, '25%', '0.5%', 'indica', '["sleepy", "relaxed", "calm", "pain-relief"]', '["/placeholder-flower3.png", "/placeholder-flower4.png"]', true),

('Bamboo Sativa Sunrise', 'bamboo-sativa-sunrise', 'Start your day with this energizing sativa blend. Citrusy and uplifting, perfect for creative projects and social gatherings. Grown sustainably in our bamboo gardens.', 'Energizing sativa for creativity and focus', 1, 48.00, 58.00, 'BSS-003', 22, '20%', '2%', 'sativa', '["energetic", "creative", "uplifted", "focused"]', '["/placeholder-flower1.png", "/placeholder-flower2.png"]', false),

('Zen Garden Gummies', 'zen-garden-gummies', 'Delicious fruit-flavored gummies infused with premium cannabis extract. Each gummy contains 10mg THC for precise dosing. Perfect for micro-dosing throughout your zen journey.', 'Premium cannabis gummies - 10mg each', 2, 25.00, 30.00, 'ZGG-004', 50, '10mg per piece', '0mg', 'hybrid', '["relaxed", "happy", "euphoric"]', '["/placeholder-gummies.png"]', true),

('Panda Chocolate Bliss', 'panda-chocolate-bliss', 'Rich, dark chocolate infused with cannabis for the ultimate indulgent experience. Made with organic cacao and natural ingredients. Each bar contains 100mg THC divided into 10 pieces.', 'Premium cannabis chocolate bar - 100mg total', 2, 35.00, 40.00, 'PCB-005', 30, '100mg total', '5mg', 'indica', '["relaxed", "euphoric", "sleepy"]', '["/placeholder-chocolate.png"]', false),

('Zen Cookies', 'zen-cookies', 'Homemade-style cookies with a cannabis twist. Soft, chewy, and perfectly dosed at 20mg THC per cookie. Made with organic ingredients and lots of panda love.', 'Cannabis-infused cookies - 20mg each', 2, 15.00, 18.00, 'ZC-006', 40, '20mg per cookie', '1mg', 'hybrid', '["happy", "relaxed", "creative"]', '["/placeholder-cookies.png"]', false),

('Peaceful Brownies', 'peaceful-brownies', 'Fudgy, decadent brownies that deliver both flavor and relaxation. Each brownie contains 25mg THC for a perfect evening treat. Gluten-free options available.', 'Cannabis brownies - 25mg each', 2, 18.00, 22.00, 'PB-007', 35, '25mg per brownie', '2mg', 'indica', '["relaxed", "euphoric", "sleepy"]', '["/placeholder-brownies.png"]', false),

('Bamboo Bong Deluxe', 'bamboo-bong-deluxe', 'Handcrafted bamboo bong with panda engravings. Eco-friendly and smooth-hitting, perfect for the environmentally conscious cannabis enthusiast. Includes cleaning kit.', 'Eco-friendly bamboo bong with panda design', 4, 85.00, 100.00, 'BBD-008', 15, null, null, null, null, '["/placeholder-bong.png"]', true),

('Zen Rolling Papers', 'zen-rolling-papers', 'Ultra-thin, slow-burning rolling papers made from sustainable hemp. Each pack contains 32 papers with tips included. Perfect for the traditional smoking experience.', 'Premium hemp rolling papers - 32 pack', 4, 8.00, 10.00, 'ZRP-009', 100, null, null, null, null, '["/placeholder-papers.png"]', false),

('Panda Grinder Pro', 'panda-grinder-pro', 'Professional-grade 4-piece grinder with panda logo. Sharp teeth and smooth action for perfect herb preparation. Includes pollen catcher and scraper tool.', '4-piece professional herb grinder', 4, 45.00, 55.00, 'PGP-010', 25, null, null, null, null, '["/placeholder-grinder.png"]', false),

('Zen Dab Rig', 'zen-dab-rig', 'Premium glass dab rig with panda-themed design. Perfect for concentrate enthusiasts. Includes quartz banger, carb cap, and dab tool. Smooth hits guaranteed.', 'Premium glass dab rig with accessories', 4, 120.00, 150.00, 'ZDR-011', 12, null, null, null, null, '["/placeholder-rig.png"]', false);

-- Insert admin user
INSERT INTO admin_users (email, password_hash, name, role, permissions) VALUES
('admin@greenpanda.com', '$2b$10$rQZ8kqVZ8qVZ8qVZ8qVZ8O', 'Panda Admin', 'super_admin', '{"all": true}'),
('support@greenpanda.com', '$2b$10$rQZ8kqVZ8qVZ8qVZ8qVZ8O', 'Support Panda', 'support', '{"chat": true, "orders": true}');

-- Insert promo codes
INSERT INTO promo_codes (code, description, discount_type, discount_value, minimum_order_amount, usage_limit, starts_at, expires_at) VALUES
('WELCOME10', 'Welcome to Green Panda - 10% off your first order', 'percentage', 10.00, 25.00, 1000, NOW(), NOW() + INTERVAL '30 days'),
('ZENMODE', 'Zen Mode Activated - $15 off orders over $75', 'fixed', 15.00, 75.00, 500, NOW(), NOW() + INTERVAL '14 days'),
('PANDA20', 'Panda Power - 20% off everything', 'percentage', 20.00, 50.00, 200, NOW(), NOW() + INTERVAL '7 days');

-- Insert sample user (password is 'password123')
INSERT INTO users (email, password_hash, first_name, last_name, phone, is_verified, kyc_status, loyalty_points, wallet_balance) VALUES
('customer@example.com', '$2b$10$rQZ8kqVZ8qVZ8qVZ8qVZ8O', 'Zen', 'Customer', '555-0123', true, 'approved', 150, 25.50);

-- Insert sample reviews
INSERT INTO product_reviews (product_id, user_id, rating, title, review_text, is_verified_purchase, is_approved) VALUES
(1, 1, 5, 'Perfect for meditation!', 'This strain is absolutely perfect for my evening meditation sessions. The effects are exactly as described - peaceful and euphoric without being overwhelming. Will definitely order again!', true, true),
(4, 1, 5, 'Best gummies ever!', 'These gummies are amazing! Perfect dosing and they taste incredible. The effects are smooth and long-lasting. Green Panda has won me over completely.', true, true),
(8, 1, 4, 'Beautiful craftsmanship', 'The bamboo bong is gorgeous and hits so smooth. Love the panda engravings and the eco-friendly aspect. Only wish it came with a carrying case.', true, true);

-- Update sequences to avoid conflicts
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('admin_users_id_seq', (SELECT MAX(id) FROM admin_users));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('faq_categories_id_seq', (SELECT MAX(id) FROM faq_categories));
SELECT setval('faq_items_id_seq', (SELECT MAX(id) FROM faq_items));
SELECT setval('promo_codes_id_seq', (SELECT MAX(id) FROM promo_codes));
SELECT setval('product_reviews_id_seq', (SELECT MAX(id) FROM product_reviews));
