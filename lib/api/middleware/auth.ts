import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { query } from '@/lib/database'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: number
    email: string
    role?: string
  }
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return decoded
  } catch (error) {
    return null
  }
}

export async function authenticate(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = await verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Verify user still exists and is active
    const result = await query(
      'SELECT id, email FROM users WHERE id = $1',
      [decoded.userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // Attach user to request
    (req as any).user = {
      id: result.rows[0].id,
      email: result.rows[0].email,
      role: decoded.role || 'user'
    }

    return null // No error
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }
}

export async function authenticateAdmin(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = await verifyToken(token)

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Verify admin still exists and is active
    const result = await query(
      'SELECT id, email, role FROM admin_users WHERE id = $1 AND is_active = true',
      [decoded.userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Admin not found or inactive' },
        { status: 401 }
      )
    }

    // Attach admin to request
    (req as any).user = {
      id: result.rows[0].id,
      email: result.rows[0].email,
      role: result.rows[0].role
    }

    return null // No error
  } catch (error) {
    console.error('Admin authentication error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }
}

export function generateToken(userId: number, email: string, role: string = 'user') {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}