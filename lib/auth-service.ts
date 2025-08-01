import type { User } from "./store-context"

export type AuthUser = {
  id: number
  email: string
  firstName?: string
  lastName?: string
  loyaltyPoints: number
  walletBalance: number
  role?: string
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
  phone?: string
  dateOfBirth?: string
}

// Auth service with real API integration
export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string } | { error: string }> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || "Login failed" }
      }

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem("auth_token", data.token)
      }

      return { user: data.user, token: data.token }
    } catch (error) {
      console.error("Login error:", error)
      return { error: "Network error. Please check your connection and try again." }
    }
  },

  // Register user
  async register(data: RegisterData): Promise<{ user: User; token: string } | { error: string }> {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        return { error: result.error || "Registration failed" }
      }

      // Store token in localStorage
      if (result.token) {
        localStorage.setItem("auth_token", result.token)
      }

      return { user: result.user, token: result.token }
    } catch (error) {
      console.error("Registration error:", error)
      return { error: "Network error. Please check your connection and try again." }
    }
  },

  // Logout user
  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const token = localStorage.getItem("auth_token")
      
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      }

      // Clear local storage
      localStorage.removeItem("auth_token")
      
      return { success: true }
    } catch (error) {
      console.error("Logout error:", error)
      // Even if API call fails, clear local storage
      localStorage.removeItem("auth_token")
      return { success: true, error: "Logout completed locally" }
    }
  },

  // Get user profile
  async getProfile(): Promise<User | null> {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return null

      const response = await fetch("/api/auth/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, remove it
          localStorage.removeItem("auth_token")
        }
        return null
      }

      const data = await response.json()
      return data.user
    } catch (error) {
      console.error("Get profile error:", error)
      return null
    }
  },

  // Update user profile
  async updateProfile(userData: Partial<AuthUser>): Promise<User | null> {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return null

      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.user
    } catch (error) {
      console.error("Update profile error:", error)
      return null
    }
  },

  // Verify token
  async verifyToken(): Promise<User | null> {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return null

      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, remove it
          localStorage.removeItem("auth_token")
        }
        return null
      }

      const data = await response.json()
      return data.user
    } catch (error) {
      console.error("Token verification error:", error)
      return null
    }
  },

  // Add loyalty points
  async addLoyaltyPoints(points: number): Promise<number | null> {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return null

      const response = await fetch("/api/auth/loyalty-points", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ points }),
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.newPoints
    } catch (error) {
      console.error("Add loyalty points error:", error)
      return null
    }
  },

  // Add to wallet balance
  async addToWallet(amount: number): Promise<number | null> {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return null

      const response = await fetch("/api/auth/wallet", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.newBalance
    } catch (error) {
      console.error("Add to wallet error:", error)
      return null
    }
  },

  // Get authentication token
  getToken(): string | null {
    return localStorage.getItem("auth_token")
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token")
  },
}
