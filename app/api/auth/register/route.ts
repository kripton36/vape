import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { userQueries } from "@/lib/database"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, phone, dateOfBirth } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await userQueries.findByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcryptjs.hash(password, saltRounds)

    // Create user
    const newUser = await userQueries.create({
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone,
      date_of_birth: dateOfBirth,
    })

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email,
        role: "user"
      },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    )

    // Return user data without password
    const userData = {
      id: newUser.id.toString(),
      email: newUser.email,
      name: `${newUser.first_name || ""} ${newUser.last_name || ""}`.trim() || newUser.email,
      role: "user",
      points: 100, // Welcome bonus
      walletBalance: 0,
    }

    const response = NextResponse.json({
      success: true,
      user: userData,
      token,
      message: "Account created successfully! Welcome to Green Panda!"
    })

    // Set HTTP-only cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}