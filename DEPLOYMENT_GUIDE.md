# Green Panda Cannabis - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Green Panda Cannabis e-commerce application to production. The application is built with Next.js 14, TypeScript, PostgreSQL, and includes comprehensive backend API functionality.

## Prerequisites

### Required Software
- Node.js 18+ 
- PostgreSQL 14+
- Git
- PM2 (for production process management)

### Required Accounts
- Vercel account (for frontend deployment)
- PostgreSQL hosting (Supabase, Railway, or AWS RDS)
- Domain name (optional but recommended)

## Environment Setup

### 1. Database Setup

#### Option A: Supabase (Recommended)
1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Go to Settings > Database to get your connection string
4. Note your database URL for environment variables

#### Option B: Railway
1. Create a Railway account at https://railway.app
2. Create a new PostgreSQL database
3. Copy the connection string from the database settings

#### Option C: Local PostgreSQL
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb greenpanda

# Create user
sudo -u postgres createuser greenpanda_user

# Grant privileges
sudo -u postgres psql
GRANT ALL PRIVILEGES ON DATABASE greenpanda TO greenpanda_user;
```

### 2. Database Schema

Run the following SQL to create the required tables:

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    loyalty_points INTEGER DEFAULT 0,
    wallet_balance DECIMAL(10,2) DEFAULT 0.00,
    is_verified BOOLEAN DEFAULT false,
    kyc_status VARCHAR(50) DEFAULT 'pending',
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    image VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    thc_content VARCHAR(50),
    cbd_content VARCHAR(50),
    effects JSONB,
    flavors JSONB,
    stock_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    final_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address JSONB,
    payment_method VARCHAR(50),
    promo_code_used VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallet transactions table
CREATE TABLE wallet_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Promo codes table
CREATE TABLE promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL, -- 'percentage' or 'fixed'
    discount_value DECIMAL(10,2) NOT NULL,
    max_uses INTEGER,
    max_uses_per_user INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    expiry_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Promo usage table
CREATE TABLE promo_usage (
    id SERIAL PRIMARY KEY,
    promo_id INTEGER REFERENCES promo_codes(id),
    user_id INTEGER REFERENCES users(id),
    order_id INTEGER REFERENCES orders(id),
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat sessions table
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'open',
    assigned_admin_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES chat_sessions(session_id),
    sender_type VARCHAR(20) NOT NULL, -- 'customer', 'admin', 'system'
    sender_id INTEGER REFERENCES users(id),
    sender_name VARCHAR(255),
    message_text TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',
    metadata JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
```

### 3. Environment Variables

Create a `.env.local` file in your project root:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here

# Environment
NODE_ENV=production

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Optional: Payment processing
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)

#### 1. Prepare for Deployment
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Test the build
npm start
```

#### 2. Deploy to Vercel
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add all environment variables from `.env.local`

#### 3. Configure Custom Domain (Optional)
1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

### Option 2: Self-Hosted Deployment

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx

# Install PostgreSQL (if self-hosting database)
sudo apt install postgresql postgresql-contrib
```

#### 2. Application Deployment
```bash
# Clone repository
git clone https://github.com/your-username/green-panda-cannabis.git
cd green-panda-cannabis

# Install dependencies
npm install

# Set environment variables
cp .env.local .env.production
# Edit .env.production with production values

# Build application
npm run build

# Start with PM2
pm2 start npm --name "green-panda" -- start
pm2 save
pm2 startup
```

#### 3. Nginx Configuration
Create `/etc/nginx/sites-available/green-panda`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/green-panda /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Post-Deployment Setup

### 1. Database Seeding
Create initial data for your application:

```sql
-- Insert sample products
INSERT INTO products (name, slug, description, price, category, thc_content, cbd_content, effects, flavors, stock_count, rating, review_count, is_featured) VALUES
('Zen Master OG', 'zen-master-og', 'Premium indica strain for deep relaxation and zen meditation', 45.99, 'flower', '24%', '2%', '["Relaxed", "Happy", "Sleepy"]', '["Earthy", "Pine", "Sweet"]', 15, 4.8, 124, true),
('Panda''s Dream', 'pandas-dream', 'Delicious gummies infused with peaceful vibes', 38.99, 'edibles', '10mg', '5mg', '["Euphoric", "Creative", "Focused"]', '["Berry", "Tropical", "Citrus"]', 28, 4.9, 89, true),
('Bamboo Bliss', 'bamboo-bliss', 'Pure concentrate for the ultimate zen experience', 52.99, 'concentrates', '85%', '1%', '["Uplifted", "Energetic", "Creative"]', '["Citrus", "Diesel", "Herbal"]', 8, 4.7, 67, true);

-- Insert promo codes
INSERT INTO promo_codes (code, discount_type, discount_value, max_uses, expiry_date) VALUES
('WELCOME10', 'percentage', 10.00, 100, '2024-12-31 23:59:59'),
('FIRSTORDER', 'fixed', 5.00, 50, '2024-12-31 23:59:59');
```

### 2. Admin User Creation
Create an admin user through the API:

```bash
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@greenpanda.com",
    "password": "secure-admin-password",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

Then update the user role in the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@greenpanda.com';
```

### 3. Monitoring Setup

#### PM2 Monitoring
```bash
# Monitor application
pm2 monit

# View logs
pm2 logs green-panda

# Restart application
pm2 restart green-panda
```

#### Application Monitoring
Consider setting up:
- Sentry for error tracking
- Google Analytics for user behavior
- Uptime monitoring (UptimeRobot, Pingdom)

## Security Checklist

### ✅ Implemented Security Features
- [x] JWT authentication with secure tokens
- [x] Password hashing with bcrypt
- [x] Input validation with Zod
- [x] SQL injection protection
- [x] Role-based access control
- [x] Rate limiting
- [x] HTTPS enforcement
- [x] Secure headers

### 🔒 Additional Security Recommendations
- [ ] Set up firewall rules
- [ ] Configure database backups
- [ ] Implement API rate limiting
- [ ] Set up monitoring and alerting
- [ ] Regular security audits
- [ ] SSL certificate auto-renewal

## Performance Optimization

### 1. Database Optimization
```sql
-- Analyze table statistics
ANALYZE;

-- Create additional indexes if needed
CREATE INDEX CONCURRENTLY idx_products_price ON products(price);
CREATE INDEX CONCURRENTLY idx_orders_status ON orders(status);
```

### 2. Application Optimization
- Enable Next.js image optimization
- Implement proper caching headers
- Use CDN for static assets
- Optimize bundle size

### 3. Monitoring Performance
```bash
# Check application performance
npm run build
npm run start

# Monitor with PM2
pm2 monit
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check environment variables
echo $DATABASE_URL
```

#### 2. Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### 3. Runtime Errors
```bash
# Check application logs
pm2 logs green-panda

# Restart application
pm2 restart green-panda
```

#### 4. Nginx Issues
```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## Maintenance

### Regular Tasks
1. **Weekly:**
   - Check application logs
   - Monitor database performance
   - Review error reports

2. **Monthly:**
   - Update dependencies
   - Review security patches
   - Backup database

3. **Quarterly:**
   - Performance audit
   - Security assessment
   - User feedback review

### Backup Strategy
```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
gzip backup_$DATE.sql
```

## Support

For deployment issues:
1. Check the application logs
2. Verify environment variables
3. Test database connectivity
4. Review the troubleshooting section above

The application is now ready for production use with comprehensive backend functionality and optimized UI/UX design.