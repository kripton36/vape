import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { query } from '@/lib/database'
import { generateToken } from '@/lib/api/middleware/auth'
import { successResponse, errorResponse, validationError, serverError } from '@/lib/api/utils/response'
import { validateRequest, formatZodErrors, emailSchema, passwordSchema } from '@/lib/api/utils/validation'

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    // Validate request body
    const { data, errors } = await validateRequest(req, registerSchema)
    
    if (errors) {
      return validationError(formatZodErrors(errors))
    }

    const { email, password, firstName, lastName, phone, dateOfBirth } = data!

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return errorResponse('Email already registered', 409)
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const result = await query(
      `INSERT INTO users (
        email, password_hash, first_name, last_name, phone, date_of_birth
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, first_name, last_name, loyalty_points, wallet_balance`,
      [email, passwordHash, firstName, lastName, phone, dateOfBirth]
    )

    const user = result.rows[0]

    // Generate JWT token
    const token = generateToken(user.id, user.email)

    return successResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          loyaltyPoints: user.loyalty_points,
          walletBalance: user.wallet_balance,
        },
        token
      },
      'Registration successful'
    )
  } catch (error) {
    return serverError(error as Error)
  }
}