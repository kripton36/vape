import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { userQueries } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await userQueries.findByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password_hash)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role || "user"
      },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    )

    // Return user data without password
    const userData = {
      id: user.id.toString(),
      email: user.email,
      name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email,
      role: user.role || "user",
      points: user.loyalty_points || 0,
      walletBalance: parseFloat(user.wallet_balance) || 0,
      avatar: user.avatar || undefined,
    }

    const response = NextResponse.json({
      success: true,
      user: userData,
      token,
    })

    // Set HTTP-only cookie for additional security
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}