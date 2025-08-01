import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { userQueries } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key"

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: number
    email: string
    role: string
  }
}

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export async function verifyToken(request: NextRequest): Promise<any> {
  try {
    // Try to get token from Authorization header first
    const authHeader = request.headers.get("authorization")
    let token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null
    
    // If no Authorization header, try to get from cookie
    if (!token) {
      token = request.cookies.get("auth_token")?.value
    }

    if (!token) {
      return null
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number
      email: string
      role: string
    }

    // Verify user still exists
    const user = await userQueries.findById(decoded.userId)
    if (!user) {
      return null
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export function requireAuth(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: AuthenticatedRequest) => {
    const user = await verifyToken(request)
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    request.user = user
    return handler(request)
  }
}

export function requireAdmin(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: AuthenticatedRequest) => {
    const user = await verifyToken(request)
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    request.user = user
    return handler(request)
  }
}

export function rateLimit(maxRequests = 100, windowMs = 15 * 60 * 1000) {
  return (handler: (request: NextRequest) => Promise<NextResponse>) => {
    return async (request: NextRequest) => {
      const clientIp = request.headers.get("x-forwarded-for") || 
                      request.headers.get("x-real-ip") || 
                      "unknown"
      
      const now = Date.now()
      const key = `${clientIp}:${Math.floor(now / windowMs)}`
      
      const current = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs }
      
      if (current.count >= maxRequests) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        )
      }
      
      current.count += 1
      rateLimitStore.set(key, current)
      
      // Cleanup old entries
      if (Math.random() < 0.01) { // 1% chance to cleanup
        for (const [k, v] of rateLimitStore.entries()) {
          if (v.resetTime < now) {
            rateLimitStore.delete(k)
          }
        }
      }
      
      return handler(request)
    }
  }
}

export function corsHandler(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      })
    }

    const response = await handler(request)
    
    // Add CORS headers to all responses
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    
    return response
  }
}

export function errorHandler(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      return await handler(request)
    } catch (error) {
      console.error("API Error:", error)
      
      // Don't expose internal errors in production
      const message = process.env.NODE_ENV === "production" 
        ? "Internal server error" 
        : error instanceof Error ? error.message : "Unknown error"
      
      return NextResponse.json(
        { error: message },
        { status: 500 }
      )
    }
  }
}

// Composite middleware
export function withMiddleware(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean
    requireAdmin?: boolean
    rateLimit?: { maxRequests: number; windowMs: number }
  } = {}
) {
  let wrappedHandler = handler as any

  // Apply middleware in reverse order
  wrappedHandler = errorHandler(wrappedHandler)
  wrappedHandler = corsHandler(wrappedHandler)
  
  if (options.rateLimit) {
    wrappedHandler = rateLimit(options.rateLimit.maxRequests, options.rateLimit.windowMs)(wrappedHandler)
  }
  
  if (options.requireAdmin) {
    wrappedHandler = requireAdmin(wrappedHandler)
  } else if (options.requireAuth) {
    wrappedHandler = requireAuth(wrappedHandler)
  }

  return wrappedHandler
}