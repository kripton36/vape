import { NextRequest, NextResponse } from "next/server"
import { orderQueries, productQueries, userQueries } from "@/lib/database"
import { withMiddleware, type AuthenticatedRequest } from "@/lib/middleware"

// GET - Fetch user orders
async function getHandler(request: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")

    const orders = await orderQueries.getByUserId(
      request.user!.userId,
      Math.min(limit, 50),
      Math.max(offset, 0)
    )

    return NextResponse.json({
      success: true,
      orders,
    })
  } catch (error) {
    console.error("Orders fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

// POST - Create new order
async function postHandler(request: AuthenticatedRequest) {
  try {
    const body = await request.json()
    const {
      items,
      shippingAddress,
      paymentMethod,
      promoCode,
    } = body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Order items are required" },
        { status: 400 }
      )
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      )
    }

    // Validate and process order items
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await productQueries.getById(parseInt(item.productId))
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        )
      }

      if (product.stock_quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        )
      }

      const itemTotal = parseFloat(product.price) * item.quantity
      subtotal += itemTotal

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        quantity: item.quantity,
        unit_price: parseFloat(product.price),
        total_price: itemTotal,
        product_data: {
          image: product.image_url,
          category: product.category_name,
          thc: product.thc_content,
          cbd: product.cbd_content,
        },
      })
    }

    // Calculate totals
    const taxRate = 0.1 // 10% tax rate (adjust as needed)
    const taxAmount = subtotal * taxRate
    const shippingAmount = subtotal > 75 ? 0 : 9.99 // Free shipping over $75
    let discountAmount = 0

    // Apply promo code if provided
    if (promoCode) {
      // TODO: Implement promo code validation
      // For now, we'll skip this
    }

    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount

    // Generate order number
    const orderNumber = `GP${Date.now()}${Math.floor(Math.random() * 1000)}`

    // Create order data
    const orderData = {
      order_number: orderNumber,
      user_id: request.user!.userId,
      status: "pending",
      payment_status: "pending",
      payment_method: paymentMethod || "card",
      subtotal,
      tax_amount: taxAmount,
      shipping_amount: shippingAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      shipping_first_name: shippingAddress.firstName,
      shipping_last_name: shippingAddress.lastName,
      shipping_email: shippingAddress.email,
      shipping_phone: shippingAddress.phone,
      shipping_address_line1: shippingAddress.addressLine1,
      shipping_address_line2: shippingAddress.addressLine2,
      shipping_city: shippingAddress.city,
      shipping_state: shippingAddress.state,
      shipping_postal_code: shippingAddress.postalCode,
      shipping_country: shippingAddress.country || "US",
      items: orderItems,
    }

    // Create order
    const order = await orderQueries.create(orderData)

    // Award loyalty points (1 point per dollar spent)
    const pointsEarned = Math.floor(totalAmount)
    await userQueries.updateLoyaltyPoints(
      request.user!.userId,
      pointsEarned,
      "order",
      "order",
      order.id
    )

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        paymentStatus: order.payment_status,
        total: order.total_amount,
        createdAt: order.created_at,
      },
      pointsEarned,
      message: "Order created successfully!",
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}

export const GET = withMiddleware(getHandler, {
  requireAuth: true,
  rateLimit: { maxRequests: 50, windowMs: 15 * 60 * 1000 }
})

export const POST = withMiddleware(postHandler, {
  requireAuth: true,
  rateLimit: { maxRequests: 10, windowMs: 15 * 60 * 1000 }
})