import type { CartItem } from "./store-context"

export type Order = {
  id: number
  orderNumber: string
  userId?: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  items: CartItem[]
  subtotal: number
  taxAmount: number
  shippingAmount: number
  discountAmount: number
  totalAmount: number
  shippingInfo: ShippingInfo
  createdAt: Date
  updatedAt: Date
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"
export type PaymentMethod = "cashapp" | "crypto" | "credit_card" | "wallet"

export type ShippingInfo = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export type OrderSummary = {
  id: number
  orderNumber: string
  status: OrderStatus
  totalAmount: number
  createdAt: Date
  itemCount: number
}

// Order service
export const orderService = {
  // Create a new order
  async createOrder(data: {
    orderNumber: string
    userId?: number
    items: CartItem[]
    subtotal: number
    taxAmount: number
    shippingAmount: number
    discountAmount: number
    totalAmount: number
    shippingInfo: ShippingInfo
    paymentMethod: PaymentMethod
  }): Promise<Order | null> {
    try {
      // In a real app, this would create an order in the database
      // For now, we'll just return a mock order
      const order: Order = {
        id: Math.floor(Math.random() * 10000) + 1,
        orderNumber: data.orderNumber,
        userId: data.userId,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: data.paymentMethod,
        items: data.items,
        subtotal: data.subtotal,
        taxAmount: data.taxAmount,
        shippingAmount: data.shippingAmount,
        discountAmount: data.discountAmount,
        totalAmount: data.totalAmount,
        shippingInfo: data.shippingInfo,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      return order
    } catch (error) {
      console.error("Create order error:", error)
      return null
    }
  },

  // Get order by ID
  async getOrderById(orderId: number): Promise<Order | null> {
    try {
      // In a real app, this would fetch from the database
      // For now, we'll return null (no mock orders)
      return null
    } catch (error) {
      console.error(`Get order ${orderId} error:`, error)
      return null
    }
  },

  // Get order by order number
  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    try {
      // In a real app, this would fetch from the database
      // For now, we'll return null (no mock orders)
      return null
    } catch (error) {
      console.error(`Get order ${orderNumber} error:`, error)
      return null
    }
  },

  // Get orders for a user
  async getUserOrders(userId: number): Promise<OrderSummary[]> {
    try {
      // In a real app, this would fetch from the database
      // For now, we'll return an empty array
      return []
    } catch (error) {
      console.error(`Get orders for user ${userId} error:`, error)
      return []
    }
  },

  // Update order status
  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<boolean> {
    try {
      // In a real app, this would update the database
      return true
    } catch (error) {
      console.error(`Update order ${orderId} status error:`, error)
      return false
    }
  },

  // Update payment status
  async updatePaymentStatus(orderId: number, status: PaymentStatus): Promise<boolean> {
    try {
      // In a real app, this would update the database
      return true
    } catch (error) {
      console.error(`Update order ${orderId} payment status error:`, error)
      return false
    }
  },

  // Process payment
  async processPayment(orderId: number, paymentMethod: PaymentMethod, amount: number): Promise<boolean> {
    try {
      // In a real app, this would process the payment
      // For now, we'll just return success
      return true
    } catch (error) {
      console.error(`Process payment for order ${orderId} error:`, error)
      return false
    }
  },

  // Generate order number
  generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `GP-${timestamp}-${random}`
  },

  // Calculate order totals
  calculateOrderTotals(
    items: CartItem[],
    shippingCost = 8.99,
    taxRate = 0.08,
    discountAmount = 0,
  ): {
    subtotal: number
    shipping: number
    tax: number
    discount: number
    total: number
  } {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 75 ? 0 : shippingCost
    const tax = subtotal * taxRate
    const total = subtotal + shipping + tax - discountAmount

    return {
      subtotal,
      shipping,
      tax,
      discount: discountAmount,
      total,
    }
  },
}
