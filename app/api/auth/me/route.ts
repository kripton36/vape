import { NextRequest } from 'next/server'
import { query } from '@/lib/database'
import { authenticate } from '@/lib/api/middleware/auth'
import { successResponse, serverError } from '@/lib/api/utils/response'

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const authError = await authenticate(req)
    if (authError) return authError

    const user = (req as any).user

    // Get full user profile
    const result = await query(
      `SELECT id, email, first_name, last_name, phone, date_of_birth,
              loyalty_points, wallet_balance, is_verified, kyc_status,
              created_at, updated_at
       FROM users 
       WHERE id = $1`,
      [user.id]
    )

    if (result.rows.length === 0) {
      return serverError(new Error('User not found'))
    }

    const userData = result.rows[0]

    return successResponse({
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      phone: userData.phone,
      dateOfBirth: userData.date_of_birth,
      loyaltyPoints: userData.loyalty_points,
      walletBalance: userData.wallet_balance,
      isVerified: userData.is_verified,
      kycStatus: userData.kyc_status,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
    })
  } catch (error) {
    return serverError(error as Error)
  }
}