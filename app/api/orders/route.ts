import { NextRequest, NextResponse } from "next/server"
import { query, transaction } from "@/lib/database"
import { z } from "zod"
import jwt from "jsonwebtoken"

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be positive"),
})

const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
  shippingAddress: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "ZIP code is required"),
    phone: z.string().optional(),
  }),
  paymentMethod: z.enum(["wallet", "credit_card", "crypto"]),
  promoCode: z.string().optional(),
})

// Helper function to extract user from JWT token
function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    return decoded
  } catch (error) {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const orderData = orderSchema.parse(body)

    // Validate order in transaction
    const result = await transaction(async (client) => {
      let totalAmount = 0
      const orderItems = []

      // Validate each item and calculate total
      for (const item of orderData.items) {
        const { rows: products } = await client.query(
          "SELECT id, name, price, stock_count FROM products WHERE id = $1",
          [item.productId]
        )

        if (products.length === 0) {
          throw new Error(`Product with ID ${item.productId} not found`)
        }

        const product = products[0]
        if (product.stock_count < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`)
        }

        if (product.price !== item.price) {
          throw new Error(`Price mismatch for product ${product.name}`)
        }

        totalAmount += item.price * item.quantity
        orderItems.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        })
      }

      // Apply promo code if provided
      let discountAmount = 0
      if (orderData.promoCode) {
        const { rows: promos } = await client.query(
          "SELECT * FROM promo_codes WHERE code = $1 AND is_active = true AND (expiry_date IS NULL OR expiry_date > NOW())",
          [orderData.promoCode]
        )

        if (promos.length > 0) {
          const promo = promos[0]
          // Check if user has already used this promo code
          const { rows: usage } = await client.query(
            "SELECT COUNT(*) as usage_count FROM promo_usage WHERE promo_id = $1 AND user_id = $2",
            [promo.id, user.userId]
          )

          if (parseInt(usage[0].usage_count) < promo.max_uses_per_user) {
            discountAmount = promo.discount_type === "percentage" 
              ? (totalAmount * promo.discount_value / 100)
              : promo.discount_value
          }
        }
      }

      const finalAmount = totalAmount - discountAmount

      // Handle payment method
      if (orderData.paymentMethod === "wallet") {
        const { rows: userData } = await client.query(
          "SELECT wallet_balance FROM users WHERE id = $1",
          [user.userId]
        )

        if (userData[0].wallet_balance < finalAmount) {
          throw new Error("Insufficient wallet balance")
        }

        // Deduct from wallet
        await client.query(
          "UPDATE users SET wallet_balance = wallet_balance - $1 WHERE id = $2",
          [finalAmount, user.userId]
        )
      }

      // Create order
      const { rows: orders } = await client.query(
        `INSERT INTO orders (
          user_id, 
          total_amount, 
          discount_amount, 
          final_amount,
          status,
          shipping_address,
          payment_method,
          promo_code_used
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id`,
        [
          user.userId,
          totalAmount,
          discountAmount,
          finalAmount,
          "pending",
          JSON.stringify(orderData.shippingAddress),
          orderData.paymentMethod,
          orderData.promoCode || null,
        ]
      )

      const orderId = orders[0].id

      // Create order items and update inventory
      for (const item of orderItems) {
        await client.query(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
          [orderId, item.productId, item.quantity, item.price]
        )

        await client.query(
          "UPDATE products SET stock_count = stock_count - $1 WHERE id = $2",
          [item.quantity, item.productId]
        )
      }

      // Record promo code usage if used
      if (orderData.promoCode) {
        const { rows: promos } = await client.query(
          "SELECT id FROM promo_codes WHERE code = $1",
          [orderData.promoCode]
        )
        if (promos.length > 0) {
          await client.query(
            "INSERT INTO promo_usage (promo_id, user_id, order_id, discount_amount) VALUES ($1, $2, $3, $4)",
            [promos[0].id, user.userId, orderId, discountAmount]
          )
        }
      }

      // Add loyalty points for the order
      const pointsEarned = Math.floor(finalAmount * 10) // 10 points per dollar
      await client.query(
        "UPDATE users SET loyalty_points = loyalty_points + $1 WHERE id = $2",
        [pointsEarned, user.userId]
      )

      return {
        orderId,
        totalAmount,
        discountAmount,
        finalAmount,
        pointsEarned,
      }
    })

    return NextResponse.json({
      message: "Order created successfully",
      order: {
        id: result.orderId,
        totalAmount: result.totalAmount,
        discountAmount: result.discountAmount,
        finalAmount: result.finalAmount,
        pointsEarned: result.pointsEarned,
        status: "pending",
      }
    })

  } catch (error) {
    console.error("Order creation error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid order data", details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromToken(request)
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")

    const { rows: orders } = await query(
      `SELECT 
        o.id,
        o.total_amount,
        o.discount_amount,
        o.final_amount,
        o.status,
        o.shipping_address,
        o.payment_method,
        o.created_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $2 OFFSET $3`,
      [user.userId, limit, offset]
    )

    const transformedOrders = orders.map(order => ({
      id: order.id.toString(),
      totalAmount: parseFloat(order.total_amount),
      discountAmount: parseFloat(order.discount_amount),
      finalAmount: parseFloat(order.final_amount),
      status: order.status,
      shippingAddress: JSON.parse(order.shipping_address),
      paymentMethod: order.payment_method,
      itemCount: parseInt(order.item_count),
      createdAt: order.created_at,
    }))

    return NextResponse.json({
      orders: transformedOrders,
      limit,
      offset,
    })

  } catch (error) {
    console.error("Orders fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}