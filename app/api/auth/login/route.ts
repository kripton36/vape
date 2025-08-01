import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { userQueries } from '@/lib/database'
import { 
  withErrorHandling, 
  withRateLimit, 
  validateRequestData, 
  createApiResponse, 
  createErrorResponse,
  userValidationSchemas,
  sanitizeObject 
} from '@/lib/api-utils'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export const POST = withRateLimit(60000, 10)(withErrorHandling(async (request: NextRequest) => {
  const requestData = await request.json()
  const { email, password } = validateRequestData(sanitizeObject(requestData), userValidationSchemas.login)

  // Find user by email
  const user = await userQueries.findByEmail(email)
  
  if (!user) {
    return createErrorResponse('Invalid credentials', 401)
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash)
  
  if (!isValidPassword) {
    return createErrorResponse('Invalid credentials', 401)
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email,
      role: user.role || 'user'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  // Remove password from response
  const { password_hash, ...userWithoutPassword } = user

  const userData = {
    id: userWithoutPassword.id,
    email: userWithoutPassword.email,
    name: `${userWithoutPassword.first_name || ''} ${userWithoutPassword.last_name || ''}`.trim(),
    role: userWithoutPassword.role || 'user',
    points: userWithoutPassword.loyalty_points || 0,
    walletBalance: userWithoutPassword.wallet_balance || 0,
    avatar: userWithoutPassword.profile_picture,
    token
  }

  // Set HTTP-only cookie for token
  const response = createApiResponse(userData)

  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  return response
}))