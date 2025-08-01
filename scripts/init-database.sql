-- Green Panda Cannabis Store Database Schema

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS promo_code_usage CASCADE;
DROP TABLE IF EXISTS promo_codes CASCADE;
DROP TABLE IF EXISTS faq_items CASCADE;
DROP TABLE IF EXISTS faq_categories CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS loyalty_transactions CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    avatar TEXT,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
    loyalty_points INTEGER DEFAULT 0,
    wallet_balance DECIMAL(10,2) DEFAULT 0.00,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    weight DECIMAL(8,2),
    dimensions TEXT,
    image_url TEXT,
    gallery_urls TEXT[],
    thc_content VARCHAR(50),
    cbd_content VARCHAR(50),
    effects TEXT[],
    flavors TEXT[],
    lab_tested BOOLEAN DEFAULT false,
    lab_results JSONB,
    grown_by VARCHAR(255),
    harvest_date DATE,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    meta_title VARCHAR(255),
    meta_description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    payment_id TEXT,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    notes TEXT,
    -- Shipping information
    shipping_first_name VARCHAR(100),
    shipping_last_name VARCHAR(100),
    shipping_email VARCHAR(255),
    shipping_phone VARCHAR(20),
    shipping_address_line1 TEXT,
    shipping_address_line2 TEXT,
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_country VARCHAR(100),
    -- Tracking
    tracking_number VARCHAR(100),
    tracking_url TEXT,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    product_data JSONB, -- Store product snapshot at time of order
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product reviews table
CREATE TABLE product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallet transactions table
CREATE TABLE wallet_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    transaction_type VARCHAR(50) NOT NULL, -- 'credit', 'debit', 'refund', 'bonus'
    amount DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    description TEXT,
    reference_type VARCHAR(50), -- 'order', 'refund', 'admin_adjustment'
    reference_id INTEGER,
    processed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loyalty transactions table
CREATE TABLE loyalty_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    transaction_type VARCHAR(50) NOT NULL, -- 'earned', 'redeemed', 'expired', 'bonus'
    points INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    description TEXT,
    reference_type VARCHAR(50), -- 'order', 'review', 'signup', 'referral'
    reference_id INTEGER,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat sessions table
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'closed')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    assigned_admin_id INTEGER REFERENCES users(id),
    closed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES chat_sessions(session_id),
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('customer', 'admin', 'system')),
    sender_id INTEGER REFERENCES users(id),
    sender_name VARCHAR(255),
    message_text TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    metadata JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAQ categories table
CREATE TABLE faq_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAQ items table
CREATE TABLE faq_items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES faq_categories(id),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Promo codes table
CREATE TABLE promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255),
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed_amount', 'free_shipping')),
    value DECIMAL(10,2) NOT NULL,
    minimum_order_amount DECIMAL(10,2),
    maximum_discount_amount DECIMAL(10,2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    user_usage_limit INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    starts_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Promo code usage table
CREATE TABLE promo_code_usage (
    id SERIAL PRIMARY KEY,
    promo_code_id INTEGER REFERENCES promo_codes(id),
    user_id INTEGER REFERENCES users(id),
    order_id INTEGER REFERENCES orders(id),
    discount_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_loyalty_transactions_user_id ON loyalty_transactions(user_id);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faq_categories_updated_at BEFORE UPDATE ON faq_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faq_items_updated_at BEFORE UPDATE ON faq_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON promo_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert seed data

-- Categories
INSERT INTO categories (name, slug, description, is_active, sort_order) VALUES
('Flower', 'flower', 'Premium cannabis flower strains', true, 1),
('Edibles', 'edibles', 'Delicious cannabis-infused edibles', true, 2),
('Concentrates', 'concentrates', 'High-potency cannabis concentrates', true, 3),
('Pre-Rolls', 'pre-rolls', 'Ready-to-smoke pre-rolled joints', true, 4),
('Accessories', 'accessories', 'Cannabis accessories and tools', true, 5);

-- Admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified, loyalty_points, wallet_balance) VALUES
('admin@greenpanda.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtO5sIbKS.', 'Admin', 'User', 'admin', true, 0, 0);

-- Sample products
INSERT INTO products (name, slug, description, category_id, sku, price, original_price, stock_quantity, image_url, thc_content, cbd_content, effects, flavors, lab_tested, is_featured, is_new) VALUES
('Zen Master OG', 'zen-master-og', 'Premium indica strain perfect for meditation and relaxation. Grown with care using organic methods.', 1, 'ZEN-001', 45.99, 55.99, 25, '/placeholder-defpf.png', '24%', '2%', ARRAY['Relaxed', 'Happy', 'Sleepy'], ARRAY['Earthy', 'Pine', 'Sweet'], true, true, false),
('Panda Express', 'panda-express', 'Energizing sativa for creative bamboo sessions. Perfect for daytime use.', 1, 'PAN-001', 38.99, 42.99, 30, '/placeholder-ff1cq.png', '19%', '0.5%', ARRAY['Energetic', 'Creative', 'Uplifted'], ARRAY['Citrus', 'Tropical', 'Sweet'], true, true, true),
('Bamboo Bliss Gummies', 'bamboo-bliss-gummies', 'Delicious gummies infused with zen energy. 10mg THC per piece.', 2, 'BBG-001', 25.99, null, 50, '/placeholder-gummies.png', '10mg per piece', '5mg per piece', ARRAY['Relaxed', 'Happy', 'Euphoric'], ARRAY['Berry', 'Tropical'], true, true, false),
('Meditation Mints', 'meditation-mints', 'Refreshing mints for mindful moments. Perfect micro-dosing option.', 2, 'MED-001', 18.99, null, 75, '/placeholder-2p6ik.png', '5mg per mint', '5mg per mint', ARRAY['Focused', 'Relaxed'], ARRAY['Herbal', 'Sweet'], true, false, false),
('Zen Chocolate Bar', 'zen-chocolate-bar', 'Premium dark chocolate infused with tranquility. 100mg total THC.', 2, 'ZCB-001', 32.99, 40.99, 20, '/placeholder-chocolate.png', '100mg total', '50mg total', ARRAY['Relaxed', 'Happy', 'Euphoric'], ARRAY['Sweet', 'Vanilla'], true, true, false),
('Peaceful Panda Pre-Roll', 'peaceful-panda-preroll', 'Ready-to-enjoy pre-rolls for instant zen. Hand-rolled with premium flower.', 4, 'PPR-001', 15.99, 18.99, 100, '/placeholder-papers.png', '20%', '3%', ARRAY['Relaxed', 'Happy', 'Calm'], ARRAY['Floral', 'Sweet', 'Earthy'], true, true, false);

-- FAQ Categories
INSERT INTO faq_categories (name, slug, description, icon, is_active, sort_order) VALUES
('Orders & Shipping', 'orders-shipping', 'Questions about ordering and delivery', 'Package', true, 1),
('Products', 'products', 'Information about our cannabis products', 'Leaf', true, 2),
('Account', 'account', 'Account management and profile questions', 'User', true, 3),
('Legal', 'legal', 'Legal requirements and compliance', 'Shield', true, 4);

-- FAQ Items
INSERT INTO faq_items (category_id, question, answer, is_active, sort_order) VALUES
(1, 'How long does shipping take?', 'We offer same-day delivery in select areas and 1-3 day shipping for all other locations. Express shipping is available for orders placed before 2 PM.', true, 1),
(1, 'What is your return policy?', 'We accept returns within 30 days of delivery for unopened products. Opened products can only be returned if they are defective.', true, 2),
(1, 'Do you offer free shipping?', 'Yes! We offer free shipping on all orders over $75. For orders under $75, shipping is $9.99.', true, 3),
(2, 'Are your products lab tested?', 'Yes, all our cannabis products undergo rigorous third-party lab testing for potency, pesticides, heavy metals, and microbials.', true, 1),
(2, 'How should I store my cannabis products?', 'Store in a cool, dry place away from direct sunlight. Keep edibles refrigerated and flower in airtight containers.', true, 2),
(3, 'How do I create an account?', 'Click the "Sign Up" button in the top right corner and fill out the required information. You must be 21+ with valid ID.', true, 1),
(3, 'How do loyalty points work?', 'Earn 1 point for every dollar spent. 100 points = $10 off your next order. Points expire after 12 months of account inactivity.', true, 2),
(4, 'What are the age requirements?', 'You must be 21 years or older to purchase cannabis products. Valid government-issued ID is required for all purchases.', true, 1),
(4, 'Is cannabis legal in my area?', 'Cannabis laws vary by location. Please check your local and state laws before ordering. We only ship to areas where cannabis is legal.', true, 2);

-- Sample promo codes
INSERT INTO promo_codes (code, name, description, type, value, minimum_order_amount, usage_limit, user_usage_limit, is_active, expires_at) VALUES
('WELCOME10', 'Welcome Discount', '10% off your first order', 'percentage', 10.00, 25.00, 1000, 1, true, '2024-12-31 23:59:59'),
('FREESHIP', 'Free Shipping', 'Free shipping on any order', 'free_shipping', 0.00, 0.00, null, 5, true, '2024-12-31 23:59:59'),
('SAVE20', 'Big Savings', '$20 off orders over $100', 'fixed_amount', 20.00, 100.00, 500, 3, true, '2024-12-31 23:59:59');

-- Insert some sample reviews
INSERT INTO product_reviews (product_id, user_id, rating, title, comment, is_verified_purchase, is_approved) VALUES
(1, 1, 5, 'Amazing quality!', 'This strain really helps with my meditation practice. Great quality and fast shipping.', true, true),
(2, 1, 4, 'Perfect for creativity', 'Love this strain for creative projects. Very uplifting and energizing.', true, true),
(3, 1, 5, 'Delicious and effective', 'These gummies taste great and have the perfect dosage. Will definitely order again.', true, true);

COMMIT;