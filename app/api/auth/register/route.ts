import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { userQueries } from '@/lib/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone, dateOfBirth } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await userQueries.findByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 })
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const userId = await userQueries.create({
      email,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      phone,
      date_of_birth: dateOfBirth,
      role: 'user',
      loyalty_points: 0,
      wallet_balance: 0,
      is_verified: false,
      created_at: new Date().toISOString()
    })

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId, 
        email,
        role: 'user'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Get the created user
    const newUser = await userQueries.findById(userId)
    
    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: `${newUser.first_name || ''} ${newUser.last_name || ''}`.trim(),
        role: newUser.role,
        points: newUser.loyalty_points,
        walletBalance: newUser.wallet_balance,
        avatar: newUser.profile_picture
      },
      token
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}