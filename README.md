# Panda Cannabis Store - Full Stack E-Commerce Platform

*A modern, full-featured cannabis e-commerce platform built with Next.js, TypeScript, and PostgreSQL*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/labelvaults2025-gmailcoms-projects/v0-modern-vape-store)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/zjWZrQSkDiz)

## 🌟 Features

### 🛍️ E-Commerce Core
- **Complete Product Catalog** - Cannabis flowers, edibles, concentrates, vapes, topicals, and accessories
- **Advanced Search & Filtering** - Category, price, effects, flavors, THC/CBD content
- **Shopping Cart & Wishlist** - Persistent cart with local storage, wishlist management
- **User Authentication** - JWT-based auth with secure password hashing
- **Order Management** - Complete order lifecycle from cart to delivery
- **Payment Processing** - Wallet system with top-up and withdrawal functionality
- **Loyalty Program** - Points earned on purchases, redeemable for discounts

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Accessibility** - WCAG 2.1 compliant with proper ARIA labels and keyboard navigation
- **Dark/Light Theme** - Theme switching with next-themes
- **Loading States** - Skeleton loaders and animated feedback
- **Error Handling** - User-friendly error messages and validation
- **Performance Optimized** - Image optimization, lazy loading, and code splitting

### 🔐 Security & Authentication
- **JWT Authentication** - Secure token-based authentication
- **Password Security** - Bcrypt hashing with salt rounds
- **Role-Based Access** - Admin and user roles with protected routes
- **Middleware Protection** - Route protection and authentication middleware
- **CORS Handling** - Proper cross-origin request handling

### 📊 Admin Dashboard
- **Analytics Dashboard** - Revenue, orders, users, and growth metrics
- **Product Management** - CRUD operations for products and categories
- **Order Management** - Update order status, tracking, and fulfillment
- **User Management** - View and manage user accounts
- **Review Moderation** - Approve and manage product reviews

### 💳 Payment & Wallet System
- **Digital Wallet** - Users can add funds and pay with wallet balance
- **Transaction History** - Complete wallet transaction records
- **Multiple Payment Methods** - Ready for Stripe, PayPal integration
- **Withdrawal System** - Users can withdraw funds (pending approval)

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Beautiful icon library
- **Zustand** - State management
- **React Hook Form** - Form handling and validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Robust relational database
- **JSON Web Tokens** - Authentication and authorization
- **Bcrypt** - Password hashing
- **Node.js** - JavaScript runtime

### Infrastructure
- **Vercel** - Deployment and hosting
- **Database Migrations** - Version-controlled schema changes
- **Environment Configuration** - Secure environment variable management

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or pnpm

### 1. Clone the Repository
```bash
git clone <repository-url>
cd panda-cannabis-store
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/cannabis_store
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
FRONTEND_URL=http://localhost:3000
```

### 4. Database Setup
```bash
# Run migrations and seed data
npm run db:setup
```

### 5. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts, authentication, wallet balance, loyalty points
- **categories** - Product categories (flower, edibles, etc.)
- **products** - Product catalog with pricing, inventory, effects
- **product_variants** - Different sizes/types for products
- **orders** - Order management and tracking
- **order_items** - Individual items within orders
- **reviews** - Product reviews and ratings
- **wallet_transactions** - Wallet top-ups, withdrawals, payments
- **loyalty_transactions** - Points earning and redemption
- **cart_items** - Persistent shopping cart
- **wishlist_items** - User wishlists

### Migration System
```bash
# Run migrations
npm run migrate

# Reset database (careful!)
npm run migrate:reset
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with filtering)
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]` - Update order status (admin)

### Reviews
- `GET /api/products/[id]/reviews` - Get product reviews
- `POST /api/products/[id]/reviews` - Create review

### Wallet
- `GET /api/users/wallet` - Get wallet transactions
- `POST /api/users/wallet` - Top-up or withdraw

### Admin
- `GET /api/admin/analytics` - Dashboard analytics

## 🧪 Testing Accounts

### Admin Account
- **Email**: admin@pandacannabis.com
- **Password**: admin123!
- **Access**: Full admin dashboard and management

### Test User Account  
- **Email**: user@example.com
- **Password**: password123!
- **Features**: $50 wallet balance, 250 loyalty points

## 🎯 Key Features Implemented

### ✅ UI/UX Improvements
- **Accessibility** - ARIA labels, keyboard navigation, screen reader support
- **Loading States** - Spinners, skeleton loaders, disabled states
- **Error Handling** - Comprehensive validation and user feedback
- **Form Improvements** - Real-time validation, password visibility toggle
- **Image Optimization** - Lazy loading, responsive images, proper alt text

### ✅ Backend Infrastructure
- **Complete API** - RESTful endpoints for all features
- **Authentication** - JWT-based secure authentication
- **Database Design** - Normalized schema with proper relationships
- **Middleware** - Request protection and CORS handling
- **Transaction Support** - Database transactions for data consistency

### ✅ E-Commerce Features
- **Product Management** - Complete CRUD with variants and categories
- **Order Processing** - Full order lifecycle with status tracking
- **Payment System** - Wallet-based payments with transaction history
- **Inventory Management** - Stock tracking and availability
- **Review System** - Product reviews with rating aggregation

## 🚢 Deployment

### Environment Variables
Set the following in your production environment:
```env
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
```

### Vercel Deployment
1. Connect repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Database Migration
```bash
npm run migrate
```

## 🔒 Security Considerations

- **Password Security** - Bcrypt with 12 salt rounds
- **JWT Security** - Signed tokens with expiration
- **SQL Injection** - Parameterized queries
- **XSS Protection** - Input sanitization
- **CORS** - Proper cross-origin handling
- **Rate Limiting** - API endpoint protection (ready for implementation)

## 📈 Performance Optimizations

- **Image Optimization** - Next.js Image component with lazy loading
- **Code Splitting** - Automatic route-based splitting
- **Static Generation** - Pre-rendered pages where possible
- **Database Indexing** - Optimized queries with proper indexes
- **Caching** - Ready for Redis implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please create an issue in the repository or contact the development team.

---

Built with ❤️ by the Panda Cannabis team 🐼
