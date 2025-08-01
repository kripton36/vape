# Green Panda Cannabis Store - Complete Backend & Frontend

A modern, full-stack e-commerce platform for cannabis products built with Next.js 14, TypeScript, PostgreSQL, and Tailwind CSS.

## 🌿 Features

### Frontend Features
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **Product Catalog**: Browse cannabis products with filtering and search
- **Shopping Cart**: Add/remove products with real-time updates
- **Wishlist**: Save favorite products
- **User Authentication**: Secure login/register with JWT
- **User Dashboard**: Profile management, order history, loyalty points
- **Live Chat**: Real-time customer support
- **Mobile Responsive**: Optimized for all device sizes
- **Accessibility**: WCAG compliant with proper ARIA labels

### Backend Features
- **REST API**: Complete RESTful API with Next.js App Router
- **JWT Authentication**: Secure token-based authentication
- **Database Integration**: PostgreSQL with optimized queries
- **User Management**: Registration, login, profile management
- **Product Management**: CRUD operations for products and categories
- **Order Processing**: Complete order lifecycle management
- **Loyalty Program**: Points system for customer retention
- **Wallet System**: Digital wallet for store credit
- **Chat System**: Real-time customer support
- **Admin Panel**: Complete administrative interface
- **Rate Limiting**: API protection against abuse
- **Error Handling**: Comprehensive error management
- **Data Validation**: Input validation and sanitization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd green-panda-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/greenpanda"

   # JWT Authentication
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"

   # Google APIs (optional)
   NEXT_PUBLIC_GOOGLE_PLACES_API_KEY="your-google-places-api-key"

   # Environment
   NODE_ENV="development"
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb greenpanda

   # Initialize database schema and seed data
   psql -d greenpanda -f scripts/init-database.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Visit the application**
   Open [http://localhost:3000](http://localhost:3000)

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
Login user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "points": 250,
    "walletBalance": 50.00
  },
  "token": "jwt-token"
}
```

#### POST `/api/auth/register`
Register new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01"
}
```

#### POST `/api/auth/logout`
Logout user and invalidate token.

#### GET `/api/auth/profile` 🔐
Get current user profile (requires authentication).

#### PUT `/api/auth/profile` 🔐
Update user profile (requires authentication).

### Product Endpoints

#### GET `/api/products`
Get all products with optional filtering.

**Query Parameters:**
- `category` - Filter by category slug
- `featured` - Filter featured products (true/false)
- `search` - Search products by name/description
- `limit` - Number of results (max 100)
- `offset` - Pagination offset

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": "1",
      "name": "Zen Master OG",
      "price": 45.99,
      "originalPrice": 55.99,
      "image": "/placeholder-defpf.png",
      "category": "flower",
      "description": "Premium indica strain...",
      "thc": "24%",
      "cbd": "2%",
      "effects": ["Relaxed", "Happy", "Sleepy"],
      "flavors": ["Earthy", "Pine", "Sweet"],
      "inStock": true,
      "stockCount": 15,
      "rating": 4.8,
      "reviewCount": 124,
      "isNew": false,
      "isFeatured": true,
      "slug": "zen-master-og"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

#### GET `/api/products/[id]`
Get single product by ID or slug.

### Order Endpoints

#### GET `/api/orders` 🔐
Get user's orders (requires authentication).

#### POST `/api/orders` 🔐
Create new order (requires authentication).

**Request Body:**
```json
{
  "items": [
    {
      "productId": "1",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "addressLine1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94102",
    "country": "US"
  },
  "paymentMethod": "card",
  "promoCode": "WELCOME10"
}
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: User accounts and profiles
- **categories**: Product categories
- **products**: Cannabis products
- **orders**: Customer orders
- **order_items**: Individual order line items
- **product_reviews**: Product reviews and ratings
- **wallet_transactions**: Wallet credit transactions
- **loyalty_transactions**: Loyalty points transactions
- **chat_sessions**: Customer support chat sessions
- **chat_messages**: Chat messages
- **faq_categories**: FAQ category organization
- **faq_items**: Frequently asked questions
- **promo_codes**: Promotional discount codes
- **promo_code_usage**: Promo code usage tracking

## 🔐 Authentication & Security

- **JWT Tokens**: Secure authentication with JSON Web Tokens
- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **Rate Limiting**: API endpoint protection against abuse
- **Input Validation**: Comprehensive input sanitization and validation
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Environment Variables**: Secure configuration management

## 🎨 UI/UX Features

### Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Focus indicators

### Performance
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Efficient state management
- Optimized database queries
- CDN-ready static assets

### Mobile Experience
- Responsive design for all screen sizes
- Touch-friendly interface
- Mobile-optimized navigation
- Progressive Web App ready

## 🛠️ Development

### Project Structure
```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── products/      # Product endpoints
│   │   └── orders/        # Order endpoints
│   ├── (pages)/           # Application pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── *.tsx             # Feature components
├── lib/                  # Utilities and services
│   ├── database.ts       # Database queries
│   ├── auth-service.ts   # Authentication service
│   ├── middleware.ts     # API middleware
│   └── store-context.tsx # State management
├── scripts/              # Database scripts
│   └── init-database.sql # Schema and seed data
└── public/               # Static assets
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:init      # Initialize database
npm run db:seed      # Seed sample data
npm run db:reset     # Reset database
```

### Environment Variables

See `.env.example` for all available configuration options.

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens

**Optional:**
- `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` - Google Places API for address autocomplete
- `STRIPE_PUBLIC_KEY` / `STRIPE_SECRET_KEY` - Stripe payment processing
- `SMTP_*` - Email configuration for notifications

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set environment variables in Vercel dashboard**
   - Add all required environment variables
   - Set up PostgreSQL database (Vercel Postgres or external)

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Docker

```dockerfile
# Dockerfile included for containerized deployment
docker build -t green-panda .
docker run -p 3000:3000 green-panda
```

### Traditional Hosting

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set up PostgreSQL database**
   - Create database and run `scripts/init-database.sql`

3. **Set environment variables**

4. **Start the application**
   ```bash
   npm start
   ```

## 📊 Admin Features

### Admin Dashboard
- User management and analytics
- Product management (CRUD operations)
- Order processing and fulfillment
- Inventory tracking
- Chat support management
- Sales analytics and reporting
- Promo code management

### Default Admin Account
- **Email**: `admin@greenpanda.com`
- **Password**: `admin123`

*⚠️ Change the default admin password in production!*

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- 📧 Email: support@greenpanda.com
- 💬 Live Chat: Available on the website
- 📖 Documentation: This README and inline code comments
- 🐛 Issues: GitHub Issues tab

## 🔮 Roadmap

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Inventory management system
- [ ] Email notification system
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-vendor marketplace features
- [ ] Subscription box service
- [ ] AI-powered product recommendations

---

Built with ❤️ and 🌿 by the Green Panda team
