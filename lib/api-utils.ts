import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Common response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string>
  pagination?: PaginationData
}

export interface PaginationData {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Authentication utilities
export function getAuthUser(request: NextRequest): { userId: string; role: string } | null {
  try {
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    return decoded
  } catch {
    return null
  }
}

export function requireAuth(request: NextRequest): { userId: string; role: string } {
  const user = getAuthUser(request)
  if (!user) {
    throw new ApiError('Authentication required', 401)
  }
  return user
}

export function requireAdmin(request: NextRequest): { userId: string; role: string } {
  const user = requireAuth(request)
  if (user.role !== 'admin') {
    throw new ApiError('Admin access required', 403)
  }
  return user
}

// Custom API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public errors?: Record<string, string>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Validation utilities
export function validateRequestData<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        const path = err.path.join('.')
        acc[path] = err.message
        return acc
      }, {} as Record<string, string>)
      
      throw new ApiError('Validation failed', 400, errors)
    }
    throw new ApiError('Invalid request data', 400)
  }
}

// Pagination utilities
export function getPaginationParams(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

export function createPaginationData(
  page: number,
  limit: number,
  totalCount: number
): PaginationData {
  const totalPages = Math.ceil(totalCount / limit)
  
  return {
    page,
    limit,
    totalCount,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  }
}

// Response utilities
export function createApiResponse<T>(
  data: T,
  statusCode: number = 200,
  pagination?: PaginationData
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(pagination && { pagination })
  }

  return NextResponse.json(response, { status: statusCode })
}

export function createErrorResponse(
  error: string | ApiError,
  statusCode?: number
): NextResponse<ApiResponse> {
  if (typeof error === 'string') {
    return NextResponse.json({
      success: false,
      error
    }, { status: statusCode || 500 })
  }

  return NextResponse.json({
    success: false,
    error: error.message,
    ...(error.errors && { errors: error.errors })
  }, { status: error.statusCode })
}

// Safe async handler wrapper
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      console.error('API Error:', error)
      
      if (error instanceof ApiError) {
        return createErrorResponse(error)
      }

      // Don't expose internal errors in production
      const message = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : (error as Error).message

      return createErrorResponse(message, 500)
    }
  }
}

// Input sanitization
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/[<>]/g, '') // Remove < and > characters
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeString(value) as T[keyof T]
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key as keyof T] = sanitizeObject(value) as T[keyof T]
    } else {
      sanitized[key as keyof T] = value
    }
  }
  
  return sanitized
}

// Rate limiting store (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  windowMs: number = 60000, // 1 minute
  maxRequests: number = 60
): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

export function withRateLimit(
  windowMs: number = 60000,
  maxRequests: number = 60
) {
  return function <T extends any[]>(
    handler: (...args: T) => Promise<NextResponse>
  ) {
    return async (request: NextRequest, ...args: T extends [NextRequest, ...infer R] ? R : never[]): Promise<NextResponse> => {
      const identifier = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
      
      if (!checkRateLimit(identifier, windowMs, maxRequests)) {
        return createErrorResponse('Too many requests. Please try again later.', 429)
      }

      return handler(request, ...args)
    }
  }
}

// Common validation schemas
export const userValidationSchemas = {
  register: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional()
  }),
  
  login: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  }),

  updateProfile: z.object({
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional()
  })
}

export const productValidationSchemas = {
  create: z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive('Price must be positive'),
    categoryId: z.number().positive('Category ID is required'),
    sku: z.string().optional(),
    stockQuantity: z.number().nonnegative('Stock quantity cannot be negative').optional(),
    images: z.array(z.string().url()).optional(),
    thcContent: z.string().optional(),
    cbdContent: z.string().optional(),
    strainType: z.enum(['sativa', 'indica', 'hybrid']).optional(),
    effects: z.array(z.string()).optional()
  }),

  update: z.object({
    name: z.string().min(1, 'Product name is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    price: z.number().positive('Price must be positive').optional(),
    categoryId: z.number().positive('Category ID is required').optional(),
    sku: z.string().optional(),
    stockQuantity: z.number().nonnegative('Stock quantity cannot be negative').optional(),
    images: z.array(z.string().url()).optional(),
    thcContent: z.string().optional(),
    cbdContent: z.string().optional(),
    strainType: z.enum(['sativa', 'indica', 'hybrid']).optional(),
    effects: z.array(z.string()).optional(),
    isActive: z.boolean().optional()
  })
}

export const orderValidationSchemas = {
  create: z.object({
    items: z.array(z.object({
      productId: z.number().positive(),
      quantity: z.number().positive()
    })).min(1, 'At least one item is required'),
    
    shippingAddress: z.object({
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().min(1, 'Last name is required'),
      email: z.string().email('Invalid email address'),
      phone: z.string().min(1, 'Phone is required'),
      addressLine1: z.string().min(1, 'Address is required'),
      addressLine2: z.string().optional(),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      postalCode: z.string().min(1, 'Postal code is required'),
      country: z.string().default('US')
    }),

    paymentMethod: z.enum(['wallet', 'card', 'crypto']),
    promoCode: z.string().optional()
  }),

  updateStatus: z.object({
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    trackingNumber: z.string().optional(),
    notes: z.string().optional()
  })
}