import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { requireAuth } from "@/lib/auth-middleware"
import { z } from "zod"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils"

const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
})

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { rows } = await query(
      `SELECT 
        id, email, first_name, last_name, phone, date_of_birth,
        loyalty_points, wallet_balance, is_verified, kyc_status, created_at
      FROM users 
      WHERE id = $1`,
      [user.userId]
    )

    if (rows.length === 0) {
      return errorResponse("User not found", 404)
    }

    const userData = rows[0]
    
    return successResponse({
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      phone: userData.phone,
      dateOfBirth: userData.date_of_birth,
      loyaltyPoints: userData.loyalty_points,
      walletBalance: parseFloat(userData.wallet_balance),
      isVerified: userData.is_verified,
      kycStatus: userData.kyc_status,
      createdAt: userData.created_at,
    })

  } catch (error) {
    return handleApiError(error)
  }
})

export const PUT = requireAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json()
    const updateData = updateProfileSchema.parse(body)

    const updateFields: string[] = []
    const updateValues: any[] = []
    let paramIndex = 1

    if (updateData.firstName !== undefined) {
      updateFields.push(`first_name = $${paramIndex}`)
      updateValues.push(updateData.firstName)
      paramIndex++
    }

    if (updateData.lastName !== undefined) {
      updateFields.push(`last_name = $${paramIndex}`)
      updateValues.push(updateData.lastName)
      paramIndex++
    }

    if (updateData.phone !== undefined) {
      updateFields.push(`phone = $${paramIndex}`)
      updateValues.push(updateData.phone)
      paramIndex++
    }

    if (updateData.dateOfBirth !== undefined) {
      updateFields.push(`date_of_birth = $${paramIndex}`)
      updateValues.push(updateData.dateOfBirth)
      paramIndex++
    }

    if (updateFields.length === 0) {
      return errorResponse("No fields to update")
    }

    updateValues.push(user.userId)

    const { rows } = await query(
      `UPDATE users 
       SET ${updateFields.join(", ")}, updated_at = NOW()
       WHERE id = $${paramIndex}
       RETURNING id, email, first_name, last_name, phone, date_of_birth, loyalty_points, wallet_balance`,
      updateValues
    )

    if (rows.length === 0) {
      return errorResponse("User not found", 404)
    }

    const updatedUser = rows[0]

    return successResponse({
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      phone: updatedUser.phone,
      dateOfBirth: updatedUser.date_of_birth,
      loyaltyPoints: updatedUser.loyalty_points,
      walletBalance: parseFloat(updatedUser.wallet_balance),
    }, "Profile updated successfully")

  } catch (error) {
    return handleApiError(error)
  }
})