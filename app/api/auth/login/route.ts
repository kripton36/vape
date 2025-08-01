import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "@/lib/database"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user by email
    const { rows } = await query("SELECT * FROM users WHERE email = $1", [email])
    const user = rows[0]

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
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
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    )

    // Return user data (without password)
    const { password_hash, ...userData } = user

    return NextResponse.json({
      user: userData,
      token,
      message: "Login successful"
    })

  } catch (error) {
    console.error("Login error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}