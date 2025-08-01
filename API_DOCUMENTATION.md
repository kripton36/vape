# Green Panda Cannabis API Documentation

## Overview

This document describes the complete backend API for the Green Panda Cannabis e-commerce platform. The API is built with Next.js 14, TypeScript, and PostgreSQL, featuring comprehensive authentication, product management, order processing, and user wallet functionality.

## Base URL

```
https://your-domain.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication

#### POST /api/auth/login
Authenticate a user and receive a JWT token.

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
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "loyaltyPoints": 250,
    "walletBalance": 50.0,
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "firstName": "Jane",
  "lastName": "Smith",
  "dateOfBirth": "1990-01-01",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "user": {
    "id": 2,
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "loyaltyPoints": 100,
    "walletBalance": 0,
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Registration successful"
}
```

### Products

#### GET /api/products
Get a paginated list of products with filtering and search.

**Query Parameters:**
- `category` (optional): Filter by product category
- `search` (optional): Search in product name and description
- `sort` (optional): Sort order (`price_asc`, `price_desc`, `name_asc`, `name_desc`, `rating_desc`, `newest`)
- `limit` (optional): Number of products per page (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `inStock` (optional): Filter for in-stock products only
- `featured` (optional): Filter for featured products only

**Example Request:**
```
GET /api/products?category=flower&sort=price_asc&limit=10&minPrice=20&maxPrice=100
```

**Response:**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Zen Master OG",
      "slug": "zen-master-og",
      "price": 45.99,
      "originalPrice": 55.99,
      "image": "/placeholder-defpf.png",
      "category": "flower",
      "description": "Premium indica strain for deep relaxation",
      "thc": "24%",
      "cbd": "2%",
      "effects": ["Relaxed", "Happy", "Sleepy"],
      "flavors": ["Earthy", "Pine", "Sweet"],
      "inStock": true,
      "stockCount": 15,
      "rating": 4.8,
      "reviewCount": 124,
      "isNew": false,
      "isFeatured": true
    }
  ],
  "total": 50,
  "limit": 10,
  "offset": 0,
  "hasMore": true
}
```

#### GET /api/products/[slug]
Get detailed information about a specific product.

**Example Request:**
```
GET /api/products/zen-master-og
```

**Response:**
```json
{
  "product": {
    "id": "1",
    "name": "Zen Master OG",
    "slug": "zen-master-og",
    "price": 45.99,
    "originalPrice": 55.99,
    "image": "/placeholder-defpf.png",
    "category": "flower",
    "description": "Premium indica strain for deep relaxation",
    "thc": "24%",
    "cbd": "2%",
    "effects": ["Relaxed", "Happy", "Sleepy"],
    "flavors": ["Earthy", "Pine", "Sweet"],
    "inStock": true,
    "stockCount": 15,
    "rating": 4.8,
    "reviewCount": 124,
    "isNew": false,
    "isFeatured": true
  },
  "relatedProducts": [
    {
      "id": "2",
      "name": "Bamboo Bliss",
      "slug": "bamboo-bliss",
      "price": 52.99,
      "image": "/placeholder-flower1.png",
      "category": "flower",
      "rating": 4.7,
      "reviewCount": 67,
      "isNew": false
    }
  ]
}
```

### Orders

#### POST /api/orders
Create a new order (requires authentication).

**Request Body:**
```json
{
  "items": [
    {
      "productId": "1",
      "quantity": 2,
      "price": 45.99
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "phone": "+1234567890"
  },
  "paymentMethod": "wallet",
  "promoCode": "WELCOME10"
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "123",
    "totalAmount": 91.98,
    "discountAmount": 9.20,
    "finalAmount": 82.78,
    "pointsEarned": 828,
    "status": "pending"
  }
}
```

#### GET /api/orders
Get user's order history (requires authentication).

**Query Parameters:**
- `limit` (optional): Number of orders per page (default: 10)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "orders": [
    {
      "id": "123",
      "totalAmount": 91.98,
      "discountAmount": 9.20,
      "finalAmount": 82.78,
      "status": "pending",
      "shippingAddress": {
        "firstName": "John",
        "lastName": "Doe",
        "address": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345"
      },
      "paymentMethod": "wallet",
      "itemCount": 2,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "limit": 10,
  "offset": 0
}
```

### User Profile

#### GET /api/user/profile
Get user profile information (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "loyaltyPoints": 250,
    "walletBalance": 50.0,
    "isVerified": true,
    "kycStatus": "approved",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /api/user/profile
Update user profile information (requires authentication).

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "loyaltyPoints": 250,
    "walletBalance": 50.0
  },
  "message": "Profile updated successfully"
}
```

### Wallet Management

#### GET /api/user/wallet
Get wallet balance and transaction history (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 50.0,
    "transactions": [
      {
        "id": 1,
        "type": "deposit",
        "amount": 100.0,
        "balanceAfter": 150.0,
        "description": "Deposit via credit_card",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### POST /api/user/wallet
Deposit funds to wallet (requires authentication).

**Request Body:**
```json
{
  "amount": 100.0,
  "paymentMethod": "credit_card"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": 1,
    "newBalance": 150.0,
    "amount": 100.0
  },
  "message": "Deposit successful"
}
```

#### PUT /api/user/wallet
Withdraw funds from wallet (requires authentication).

**Request Body:**
```json
{
  "amount": 50.0,
  "bankAccount": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": 2,
    "newBalance": 100.0,
    "amount": 50.0
  },
  "message": "Withdrawal request submitted"
}
```

### Admin Endpoints

#### GET /api/admin/products
Get all products for admin management (requires admin role).

**Query Parameters:**
- `limit` (optional): Number of products per page (default: 20)
- `offset` (optional): Pagination offset (default: 0)
- `search` (optional): Search in product name and description

**Response:**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Zen Master OG",
      "slug": "zen-master-og",
      "description": "Premium indica strain",
      "price": 45.99,
      "originalPrice": 55.99,
      "image": "/placeholder-defpf.png",
      "category": "flower",
      "thcContent": "24%",
      "cbdContent": "2%",
      "effects": ["Relaxed", "Happy", "Sleepy"],
      "flavors": ["Earthy", "Pine", "Sweet"],
      "stockCount": 15,
      "rating": 4.8,
      "reviewCount": 124,
      "isFeatured": true,
      "isNew": false,
      "viewCount": 150,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "limit": 20,
  "offset": 0
}
```

#### POST /api/admin/products
Create a new product (requires admin role).

**Request Body:**
```json
{
  "name": "New Product",
  "slug": "new-product",
  "description": "Product description",
  "price": 29.99,
  "originalPrice": 39.99,
  "image": "/product-image.jpg",
  "category": "flower",
  "thcContent": "20%",
  "cbdContent": "1%",
  "effects": ["Relaxed", "Happy"],
  "flavors": ["Earthy", "Sweet"],
  "stockCount": 50,
  "rating": 0,
  "reviewCount": 0,
  "isFeatured": false,
  "isNew": true
}
```

**Response:**
```json
{
  "message": "Product created successfully",
  "productId": 1
}
```

## Error Handling

All API endpoints return consistent error responses:

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_string",
      "minimum": 8,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "String must contain at least 8 character(s)",
      "path": ["password"]
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "error": "Authentication required"
}
```

### Authorization Error (403)
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "error": "Product not found"
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Database Schema

The API uses the following main database tables:

- `users` - User accounts and profiles
- `products` - Product catalog
- `orders` - Order information
- `order_items` - Individual items in orders
- `wallet_transactions` - Wallet transaction history
- `promo_codes` - Promotional codes
- `promo_usage` - Promo code usage tracking

## Security Features

1. **JWT Authentication** - Secure token-based authentication
2. **Password Hashing** - bcrypt with salt rounds
3. **Input Validation** - Zod schema validation
4. **SQL Injection Protection** - Parameterized queries
5. **Role-Based Access Control** - Admin and user roles
6. **Transaction Safety** - Database transactions for critical operations
7. **Rate Limiting** - Built-in Next.js rate limiting
8. **CORS Protection** - Cross-origin request protection

## Environment Variables

Required environment variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/greenpanda
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- Authentication endpoints: 5 requests per minute
- Product endpoints: 100 requests per minute
- Order endpoints: 10 requests per minute
- Admin endpoints: 50 requests per minute

## Testing

The API includes comprehensive error handling and validation. Test all endpoints with various scenarios:

1. Valid requests
2. Invalid authentication
3. Missing required fields
4. Invalid data types
5. Database constraint violations
6. Network errors

## Deployment

The API is designed to be deployed on Vercel, Netlify, or any Node.js hosting platform. Ensure your database is properly configured and environment variables are set.