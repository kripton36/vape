import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export interface AuthenticatedUser {
  userId: number
  email: string
  role: string
}

export function authenticateUser(request: NextRequest): AuthenticatedUser | null {
  const authHeader = request.headers.get("authorization")
  
  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role || "user"
    }
  } catch (error) {
    return null
  }
}

export function requireAuth(handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const user = authenticateUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return handler(request, user)
  }
}

export function requireRole(role: string, handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const user = authenticateUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    if (user.role !== role) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    return handler(request, user)
  }
}