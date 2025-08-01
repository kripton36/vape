# Green Panda Cannabis Store Backend API

A comprehensive RESTful API for the Green Panda Cannabis eCommerce platform built with Node.js, Express, and Prisma.

## Features

- **Authentication & Authorization**: JWT-based auth with user and admin roles
- **User Management**: Registration, profiles, addresses, wishlists
- **Product Catalog**: Products, categories, reviews, search functionality
- **Shopping Cart**: Add, update, remove items with real-time validation
- **Order Management**: Complete checkout process with order tracking
- **Admin Dashboard**: Comprehensive analytics and management tools
- **File Uploads**: Cloudinary integration for image management
- **Database**: PostgreSQL with Prisma ORM
- **Security**: Rate limiting, CORS, helmet protection

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **File Upload**: Multer + Cloudinary
- **Security**: Helmet, CORS, Rate Limiting
- **Environment**: dotenv

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/addresses` - Get user addresses
- `POST /api/users/addresses` - Create new address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address
- `GET /api/users/wishlist` - Get user wishlist
- `POST /api/users/wishlist` - Add to wishlist
- `DELETE /api/users/wishlist/:productId` - Remove from wishlist

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get all categories
- `GET /api/products/search` - Search products
- `GET /api/products/category/:categoryId` - Get products by category
- `GET /api/products/:identifier` - Get single product
- `POST /api/products/:id/review` - Add/update product review

### Cart
- `GET /api/cart` - Get user cart
- `GET /api/cart/count` - Get cart item count
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `POST /api/cart/validate` - Validate cart before checkout
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/:id/reorder` - Reorder items

### Admin
- `GET /api/admin/stats/overview` - Dashboard overview stats
- `GET /api/admin/stats/sales` - Sales analytics
- `GET /api/admin/stats/users` - User analytics
- `GET /api/admin/stats/inventory` - Inventory stats
- `GET /api/admin/stats/orders` - Order analytics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/products` - Get all products (admin view)
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### Uploads
- `POST /api/upload/single` - Upload single image
- `POST /api/upload/multiple` - Upload multiple images
- `POST /api/upload/product` - Upload product images
- `DELETE /api/upload/:publicId` - Delete image
- `DELETE /api/upload/batch` - Delete multiple images

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/green_panda_db"

# JWT
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Database Schema

The API uses PostgreSQL with the following main entities:
- Users (customers)
- AdminUsers (admin accounts)
- Products (cannabis products)
- Categories (product categories)
- Orders (customer orders)
- OrderItems (order line items)
- CartItems (shopping cart items)
- Addresses (shipping/billing addresses)
- Reviews (product reviews)
- Wishlist (user wishlists)
- LoyaltyTransactions (loyalty program)

## Security Features

- JWT authentication with refresh tokens
- Role-based access control (user/admin)
- Rate limiting to prevent abuse
- CORS protection
- Helmet for security headers
- Input validation and sanitization
- SQL injection protection via Prisma
- File upload restrictions

## Error Handling

The API uses consistent error responses:
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Success Responses

Successful responses follow this format:
```json
{
  "status": "success",
  "message": "Optional success message",
  "data": {
    // Response data
  }
}
```

## Pagination

List endpoints support pagination:
```json
{
  "status": "success",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.