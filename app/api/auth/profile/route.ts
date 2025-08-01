import { NextRequest, NextResponse } from "next/server"
import { userQueries } from "@/lib/database"
import { withMiddleware, type AuthenticatedRequest } from "@/lib/middleware"

// GET - Get user profile
async function getHandler(request: AuthenticatedRequest) {
  try {
    const user = await userQueries.findById(request.user!.userId)
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Return user data without password
    const userData = {
      id: user.id.toString(),
      email: user.email,
      name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email,
      role: user.role || "user",
      points: user.loyalty_points || 0,
      walletBalance: parseFloat(user.wallet_balance) || 0,
      avatar: user.avatar || undefined,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      isVerified: user.is_verified,
      kycStatus: user.kyc_status,
      createdAt: user.created_at,
    }

    return NextResponse.json({
      success: true,
      user: userData,
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

// PUT - Update user profile
async function putHandler(request: AuthenticatedRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, phone, avatar } = body

    const user = await userQueries.findById(request.user!.userId)
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Update user in database (you'll need to add this method to userQueries)
    // For now, let's create a simple update
    const updatedUser = await userQueries.updateProfile(request.user!.userId, {
      first_name: firstName,
      last_name: lastName,
      phone,
      avatar,
    })

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      )
    }

    // Return updated user data
    const userData = {
      id: updatedUser.id.toString(),
      email: updatedUser.email,
      name: `${updatedUser.first_name || ""} ${updatedUser.last_name || ""}`.trim() || updatedUser.email,
      role: updatedUser.role || "user",
      points: updatedUser.loyalty_points || 0,
      walletBalance: parseFloat(updatedUser.wallet_balance) || 0,
      avatar: updatedUser.avatar || undefined,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      phone: updatedUser.phone,
      isVerified: updatedUser.is_verified,
      kycStatus: updatedUser.kyc_status,
    }

    return NextResponse.json({
      success: true,
      user: userData,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}

export const GET = withMiddleware(getHandler, {
  requireAuth: true,
  rateLimit: { maxRequests: 50, windowMs: 15 * 60 * 1000 }
})

export const PUT = withMiddleware(putHandler, {
  requireAuth: true,
  rateLimit: { maxRequests: 10, windowMs: 15 * 60 * 1000 }
})