import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { query } from '@/lib/database'
import { generateToken } from '@/lib/api/middleware/auth'
import { successResponse, errorResponse, validationError, serverError } from '@/lib/api/utils/response'
import { validateRequest, formatZodErrors, emailSchema } from '@/lib/api/utils/validation'

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export async function POST(req: NextRequest) {
  try {
    // Validate request body
    const { data, errors } = await validateRequest(req, loginSchema)
    
    if (errors) {
      return validationError(formatZodErrors(errors))
    }

    const { email, password } = data!

    // Find user by email
    const result = await query(
      `SELECT id, email, password_hash, first_name, last_name, 
              loyalty_points, wallet_balance, is_verified
       FROM users 
       WHERE email = $1`,
      [email]
    )

    if (result.rows.length === 0) {
      return errorResponse('Invalid email or password', 401)
    }

    const user = result.rows[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    
    if (!isValidPassword) {
      return errorResponse('Invalid email or password', 401)
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email)

    // Update last login
    await query(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    )

    return successResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          loyaltyPoints: user.loyalty_points,
          walletBalance: user.wallet_balance,
          isVerified: user.is_verified,
        },
        token
      },
      'Login successful'
    )
  } catch (error) {
    return serverError(error as Error)
  }
}