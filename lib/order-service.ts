import type { Order } from "./store-context"

// Mock database for orders
const orders: Order[] = []

// Mock function to simulate API call for creating an order
export async function createOrder(orderData: Omit<Order, "id" | "createdAt" | "status">): Promise<Order> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newOrder: Order = {
        ...orderData,
        id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
        status: "processing", // Initial status
      }
      orders.push(newOrder)
      console.log("Mock Order Created:", newOrder)
      resolve(newOrder)
    }, 1000) // Simulate network delay
  })
}

// Mock function to simulate fetching orders for a user
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userOrders = orders.filter((order) => order.userId === userId)
      console.log(`Mock Orders for user ${userId}:`, userOrders)
      resolve(userOrders)
    }, 500) // Simulate network delay
  })
}

// Mock function to simulate updating order status
export async function updateOrderStatus(orderId: string, newStatus: Order["status"]): Promise<Order | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orderIndex = orders.findIndex((order) => order.id === orderId)
      if (orderIndex > -1) {
        orders[orderIndex] = { ...orders[orderIndex], status: newStatus }
        console.log(`Mock Order ${orderId} status updated to ${newStatus}:`, orders[orderIndex])
        resolve(orders[orderIndex])
      } else {
        console.log(`Mock Order ${orderId} not found.`)
        resolve(null)
      }
    }, 500) // Simulate network delay
  })
}

// Mock function to simulate payment processing
export type PaymentMethod = "credit_card" | "cashapp" | "crypto" | "wallet_balance"

export async function processPayment(
  orderId: string,
  amount: number,
  method: PaymentMethod,
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = orders.find((o) => o.id === orderId)
      if (!order) {
        resolve({ success: false, message: "Order not found." })
        return
      }

      if (amount < order.total) {
        resolve({ success: false, message: "Payment amount is less than order total." })
        return
      }

      // Simulate payment success
      console.log(`Processing payment for order ${orderId} via ${method} for $${amount}`)
      // In a real app, this would interact with a payment gateway
      resolve({ success: true, message: "Payment successful." })
    }, 1500) // Simulate payment gateway delay
  })
}
