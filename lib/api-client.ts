import { toast } from '@/hooks/use-toast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

class ApiClient {
  private token: string | null = null

  constructor() {
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data: ApiResponse<T> = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'An error occurred')
      }

      return data.data as T
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error'
      
      // Show error toast
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
      
      throw error
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{ user: any; token: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    )
    
    this.setToken(response.token)
    return response
  }

  async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    dateOfBirth?: string
  }) {
    const response = await this.request<{ user: any; token: string }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
    
    this.setToken(response.token)
    return response
  }

  async logout() {
    this.setToken(null)
  }

  async getProfile() {
    return this.request<any>('/api/auth/me')
  }

  // Product endpoints
  async getProducts(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
    featured?: boolean
  }) {
    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
    }
    
    return this.request<any[]>(`/api/products?${searchParams}`)
  }

  async getProduct(id: string) {
    return this.request<any>(`/api/products/${id}`)
  }

  // Order endpoints
  async createOrder(orderData: {
    items: Array<{
      productId: number
      variantId?: number
      quantity: number
      price: number
    }>
    shippingAddress: {
      firstName: string
      lastName: string
      email: string
      phone: string
      addressLine1: string
      addressLine2?: string
      city: string
      state: string
      postalCode: string
      country?: string
    }
    paymentMethod: string
    notes?: string
    promoCode?: string
  }) {
    return this.request<any>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async getOrders(params?: {
    page?: number
    limit?: number
  }) {
    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
    }
    
    return this.request<any[]>(`/api/orders?${searchParams}`)
  }

  async getOrder(id: string) {
    return this.request<any>(`/api/orders/${id}`)
  }

  // Cart endpoints (when implemented)
  async getCart() {
    return this.request<any>('/api/cart')
  }

  async updateCart(items: any[]) {
    return this.request<any>('/api/cart', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    })
  }

  // User endpoints
  async updateProfile(data: any) {
    return this.request<any>('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async updatePassword(currentPassword: string, newPassword: string) {
    return this.request<any>('/api/users/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  }
}

export const apiClient = new ApiClient()
export default apiClient