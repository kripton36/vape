import type { User } from "./store-context"

export type AuthUser = {
  id: number
  email: string
  firstName?: string
  lastName?: string
  loyaltyPoints: number
  walletBalance: number
}

export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterData = {
  email: string
  password: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
}

// Auth service
export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string } | { error: string }> {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      return await res.json()
    } catch (error) {
      console.error("Login error:", error)
      return { error: "Login failed. Please try again." }
    }
  },

  // Register user
  async register(data: RegisterData): Promise<{ user: User; token: string } | { error: string }> {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
        }),
      })

      return await res.json()
    } catch (error) {
      console.error("Registration error:", error)
      return { error: "Registration failed. Please try again." }
    }
  },

  // Get user profile
  async getProfile(userId: number): Promise<AuthUser | null> {
    try {
      // In a real app, this would fetch from the database
      if (userId === 1) {
        return {
          id: 1,
          email: "user@example.com",
          firstName: "Zen",
          lastName: "Panda",
          loyaltyPoints: 250,
          walletBalance: 50.0,
        }
      }
      return null
    } catch (error) {
      console.error("Get profile error:", error)
      return null
    }
  },

  // Update user profile
  async updateProfile(userId: number, data: Partial<AuthUser>): Promise<AuthUser | null> {
    try {
      // In a real app, this would update the database
      // For now, we'll just return the updated data
      const user = await this.getProfile(userId)
      if (!user) return null

      const updatedUser = { ...user, ...data }
      return updatedUser
    } catch (error) {
      console.error("Update profile error:", error)
      return null
    }
  },

  // Add loyalty points
  async addLoyaltyPoints(userId: number, points: number): Promise<number | null> {
    try {
      // In a real app, this would update the database
      const user = await this.getProfile(userId)
      if (!user) return null

      const newPoints = user.loyaltyPoints + points
      return newPoints
    } catch (error) {
      console.error("Add loyalty points error:", error)
      return null
    }
  },

  // Add to wallet balance
  async addToWallet(userId: number, amount: number): Promise<number | null> {
    try {
      // In a real app, this would update the database
      const user = await this.getProfile(userId)
      if (!user) return null

      const newBalance = user.walletBalance + amount
      return newBalance
    } catch (error) {
      console.error("Add to wallet error:", error)
      return null
    }
  },
}
