# Green Panda Store API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "errors": {
    "field": ["validation error"]
  }
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "loyaltyPoints": 0,
      "walletBalance": 0
    },
    "token": "jwt-token"
  }
}
```

#### POST /auth/login
Login to an existing account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "loyaltyPoints": 250,
      "walletBalance": 50.00,
      "isVerified": true
    },
    "token": "jwt-token"
  }
}
```

#### GET /auth/me
Get current user profile. **Requires authentication.**

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
    "walletBalance": 50.00,
    "isVerified": true,
    "kycStatus": "approved",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Products

#### GET /products
Get paginated list of products with filtering options.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `sort` (string): Sort field (default: created_at)
- `order` (string): Sort order - asc/desc (default: desc)
- `category` (string): Filter by category slug
- `search` (string): Search in name and description
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `inStock` (boolean): Filter by stock availability
- `featured` (boolean): Filter featured products

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Zen Master OG",
      "slug": "zen-master-og",
      "description": "Premium indica strain",
      "price": 45.99,
      "originalPrice": 55.99,
      "sku": "ZM-001",
      "stockQuantity": 15,
      "images": ["url1", "url2"],
      "isFeatured": true,
      "thcContent": "24%",
      "cbdContent": "2%",
      "strainType": "indica",
      "effects": ["Relaxed", "Happy", "Sleepy"],
      "category": {
        "name": "Flower",
        "slug": "flower"
      },
      "rating": 4.8,
      "reviewCount": 124,
      "inStock": true
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### GET /products/{id}
Get single product details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Zen Master OG",
    "slug": "zen-master-og",
    "description": "Full description...",
    "shortDescription": "Premium indica strain",
    "price": 45.99,
    "originalPrice": 55.99,
    "sku": "ZM-001",
    "stockQuantity": 15,
    "lowStockThreshold": 5,
    "weight": 3.5,
    "dimensions": {
      "length": 10,
      "width": 5,
      "height": 2
    },
    "images": ["url1", "url2"],
    "isActive": true,
    "isFeatured": true,
    "thcContent": "24%",
    "cbdContent": "2%",
    "strainType": "indica",
    "effects": ["Relaxed", "Happy", "Sleepy"],
    "category": {
      "id": 1,
      "name": "Flower",
      "slug": "flower"
    },
    "rating": 4.8,
    "reviewCount": 124,
    "inStock": true,
    "variants": [
      {
        "id": 1,
        "name": "1g",
        "price": 15.99,
        "stockQuantity": 20,
        "attributes": {"weight": "1g"},
        "inStock": true
      }
    ],
    "relatedProducts": [
      {
        "id": 2,
        "name": "Panda's Dream",
        "slug": "pandas-dream",
        "price": 38.99,
        "images": ["url"],
        "thcContent": "20%",
        "rating": 4.5
      }
    ]
  }
}
```

### Orders

#### GET /orders
Get user's orders. **Requires authentication.**

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `sort` (string): Sort field
- `order` (string): Sort order

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "orderNumber": "ORD-1234567890-123",
      "status": "delivered",
      "paymentStatus": "paid",
      "paymentMethod": "credit_card",
      "subtotal": 89.98,
      "taxAmount": 9.00,
      "shippingAmount": 0,
      "discountAmount": 10.00,
      "totalAmount": 88.98,
      "currency": "USD",
      "itemCount": 2,
      "totalItems": 3,
      "trackingNumber": "1Z999AA1234567890",
      "shippedAt": "2024-01-02T00:00:00Z",
      "deliveredAt": "2024-01-05T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

#### POST /orders
Create a new order. **Requires authentication.**

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "variantId": null,
      "quantity": 2,
      "price": 45.99
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "Los Angeles",
    "state": "CA",
    "postalCode": "90001",
    "country": "US"
  },
  "paymentMethod": "credit_card",
  "notes": "Please leave at door",
  "promoCode": "SAVE10"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "ORD-1234567890-123",
    "status": "pending",
    "paymentStatus": "pending",
    "totalAmount": 88.98,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": "Order created successfully"
}
```

#### GET /orders/{id}
Get single order details. **Requires authentication.**

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "ORD-1234567890-123",
    "status": "delivered",
    "paymentStatus": "paid",
    "paymentMethod": "credit_card",
    "subtotal": 89.98,
    "taxAmount": 9.00,
    "shippingAmount": 0,
    "discountAmount": 10.00,
    "totalAmount": 88.98,
    "currency": "USD",
    "shipping": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "addressLine1": "123 Main St",
      "addressLine2": "Apt 4B",
      "city": "Los Angeles",
      "state": "CA",
      "postalCode": "90001",
      "country": "US"
    },
    "trackingNumber": "1Z999AA1234567890",
    "notes": "Please leave at door",
    "promoCodeUsed": "SAVE10",
    "items": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Zen Master OG",
        "productSlug": "zen-master-og",
        "quantity": 2,
        "price": 45.99,
        "total": 91.98,
        "images": ["url"]
      }
    ],
    "payments": [
      {
        "id": 1,
        "amount": 88.98,
        "method": "credit_card",
        "status": "completed",
        "transactionId": "ch_1234567890",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "statusHistory": [
      {
        "id": 1,
        "status": "pending",
        "notes": "Order placed",
        "createdBy": "system",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

## Error Codes

- `400` - Bad Request: Invalid request data
- `401` - Unauthorized: Missing or invalid authentication
- `403` - Forbidden: Access denied
- `404` - Not Found: Resource not found
- `422` - Unprocessable Entity: Validation errors
- `500` - Internal Server Error: Server error

## Rate Limiting

API requests are limited to 100 requests per 15-minute window per IP address.

Rate limit headers:
- `X-RateLimit-Limit`: Total requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

## Webhooks

Webhooks can be configured for the following events:
- Order created
- Order status updated
- Payment completed
- User registered

Webhook payload includes event type and relevant data, with HMAC-SHA256 signature for verification.