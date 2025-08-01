import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "@/lib/database"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().optional(),
  phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, dateOfBirth, phone } = registerSchema.parse(body)

    // Check if user already exists
    const { rows: existingUsers } = await query("SELECT id FROM users WHERE email = $1", [email])
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create user
    const { rows } = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, date_of_birth, loyalty_points, wallet_balance)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, first_name, last_name, loyalty_points, wallet_balance, created_at`,
      [email, passwordHash, firstName, lastName, phone, dateOfBirth, 100, 0] // Welcome bonus of 100 points
    )

    const user = rows[0]

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: "user"
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    )

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        loyaltyPoints: user.loyalty_points,
        walletBalance: user.wallet_balance,
        role: "user"
      },
      token,
      message: "Registration successful"
    })

  } catch (error) {
    console.error("Registration error:", error)
    
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