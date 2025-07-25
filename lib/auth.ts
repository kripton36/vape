import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { userQueries } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key"
const JWT_EXPIRES_IN = "7d"

export interface User {
  id: number
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  is_verified: boolean
  kyc_status: string
  loyalty_points: number
  wallet_balance: number
  created_at: string
}

export interface JWTPayload {
  userId: number
  email: string
  type: "user" | "admin"
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

// Register new user
export async function registerUser(userData: {
  email: string
  password: string
  first_name?: string
  last_name?: string
  phone?: string
  date_of_birth?: string
}): Promise<{ user: User; token: string } | { error: string }> {
  try {
    // Check if user already exists
    const existingUser = await userQueries.findByEmail(userData.email)
    if (existingUser) {
      return { error: "User already exists with this email" }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      return { error: "Invalid email format" }
    }

    // Validate password strength
    if (userData.password.length < 8) {
      return { error: "Password must be at least 8 characters long" }
    }

    // Hash password
    const password_hash = await hashPassword(userData.password)

    // Create user
    const newUser = await userQueries.create({
      email: userData.email,
      password_hash,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: userData.phone,
      date_of_birth: userData.date_of_birth,
    })

    // Generate token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      type: "user",
    })

    // Get full user data
    const user = await userQueries.findById(newUser.id)

    return { user, token }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Registration failed. Please try again." }
  }
}

// Login user
export async function loginUser(
  email: string,
  password: string,
): Promise<{ user: User; token: string } | { error: string }> {
  try {
    // Find user by email
    const user = await userQueries.findByEmail(email)
    if (!user) {
      return { error: "Invalid email or password" }
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return { error: "Invalid email or password" }
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      type: "user",
    })

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user

    return { user: userWithoutPassword, token }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "Login failed. Please try again." }
  }
}

// Get user from token
export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    const payload = verifyToken(token)
    if (!payload || payload.type !== "user") {
      return null
    }

    const user = await userQueries.findById(payload.userId)
    return user || null
  } catch (error) {
    console.error("Get user from token error:", error)
    return null
  }
}

// Middleware to extract user from request headers
export async function authenticateUser(authHeader?: string): Promise<User | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7) // Remove 'Bearer ' prefix
  return await getUserFromToken(token)
}

// Generate order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `GP-${timestamp}-${random}`
}

// Validate age (must be 21+)
export function validateAge(dateOfBirth: string): boolean {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 21
  }

  return age >= 21
}

// Calculate loyalty points earned (1 point per dollar spent)
export function calculateLoyaltyPoints(orderTotal: number): number {
  return Math.floor(orderTotal)
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Validate phone number
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?1?[-.\s]?$$?([0-9]{3})$$?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/
  return phoneRegex.test(phone)
}

// Generate session ID for chat
export function generateSessionId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}
