import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { orderQueries, productQueries, userQueries, transaction } from '@/lib/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function GET(request: NextRequest) {
  try {
    // Get user from token
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    let orders
    let totalCount

    if (decoded.role === 'admin') {
      // Admin can see all orders
      orders = await orderQueries.findAll({ page, limit, status })
      totalCount = await orderQueries.count({ status })
    } else {
      // Regular users see only their orders
      orders = await orderQueries.findByUserId(decoded.userId, { page, limit, status })
      totalCount = await orderQueries.countByUserId(decoded.userId, { status })
    }

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Get orders error:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user from token
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const { items, shippingAddress, paymentMethod, useWalletBalance = false } = await request.json()

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Order items are required' }, { status: 400 })
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 })
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method is required' }, { status: 400 })
    }

    // Create order in transaction
    const result = await transaction(async (client) => {
      let total = 0
      const orderItems = []

      // Validate products and calculate total
      for (const item of items) {
        const product = await productQueries.findById(item.productId)
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`)
        }

        if (!product.in_stock || product.stock_count < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`)
        }

        const itemTotal = product.price * item.quantity
        total += itemTotal

        orderItems.push({
          product_id: item.productId,
          quantity: item.quantity,
          price: product.price,
          total: itemTotal
        })

        // Update product stock
        await productQueries.updateStock(item.productId, product.stock_count - item.quantity)
      }

      // Get user for wallet balance
      const user = await userQueries.findById(decoded.userId)
      let walletAmountUsed = 0

      if (useWalletBalance && user.wallet_balance > 0) {
        walletAmountUsed = Math.min(user.wallet_balance, total)
        total -= walletAmountUsed

        // Update user wallet balance
        await userQueries.updateWalletBalance(decoded.userId, user.wallet_balance - walletAmountUsed)
      }

      // Create order
      const orderId = await orderQueries.create({
        user_id: decoded.userId,
        total,
        subtotal: total + walletAmountUsed,
        wallet_amount_used: walletAmountUsed,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        status: 'pending',
        created_at: new Date().toISOString()
      })

      // Create order items
      for (const item of orderItems) {
        await orderQueries.createOrderItem({
          order_id: orderId,
          ...item
        })
      }

      // Award loyalty points (1 point per dollar spent)
      const pointsEarned = Math.floor(total + walletAmountUsed)
      if (pointsEarned > 0) {
        await userQueries.updateLoyaltyPoints(decoded.userId, user.loyalty_points + pointsEarned)
      }

      return { orderId, pointsEarned }
    })

    const newOrder = await orderQueries.findById(result.orderId)

    return NextResponse.json({
      success: true,
      data: newOrder,
      pointsEarned: result.pointsEarned
    }, { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}