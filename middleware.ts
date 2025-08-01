import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Routes that require authentication
const protectedRoutes = [
  '/api/auth/me',
  '/api/orders',
  '/api/users/wallet',
  '/api/products/[id]/reviews'
]

// Routes that require admin access
const adminRoutes = [
  '/api/admin',
  '/admin'
]

export function middleware(request: NextRequest) {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next()
    
    // Set CORS headers
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS')
    response.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    )

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers })
    }

    // Check if route requires authentication
    const isProtectedRoute = protectedRoutes.some(route => {
      if (route.includes('[id]')) {
        const pattern = route.replace('[id]', '[^/]+')
        return new RegExp(`^${pattern}$`).test(request.nextUrl.pathname)
      }
      return request.nextUrl.pathname.startsWith(route)
    })

    const isAdminRoute = adminRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    )

    if (isProtectedRoute || isAdminRoute) {
      // Get token from cookie or Authorization header
      const token = request.cookies.get('auth-token')?.value || 
                    request.headers.get('authorization')?.replace('Bearer ', '')

      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
        
        // Check admin access for admin routes
        if (isAdminRoute && decoded.role !== 'admin') {
          return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
        }

        // Add user info to request headers for use in API routes
        response.headers.set('x-user-id', decoded.userId)
        response.headers.set('x-user-role', decoded.role || 'user')
        
      } catch (error) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }
    }

    return response
  }

  // Handle admin page access
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login?redirect=/admin', request.url))
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
      
      if (decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/?error=access-denied', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login?error=invalid-token', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*'
  ]
}