import { NextRequest } from 'next/server'
import { z } from 'zod'
import { query, transaction } from '@/lib/database'
import { authenticate } from '@/lib/api/middleware/auth'
import { successResponse, errorResponse, validationError, serverError, paginatedResponse } from '@/lib/api/utils/response'
import { validateRequest, validateQuery, formatZodErrors, paginationSchema } from '@/lib/api/utils/validation'

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.number(),
    variantId: z.number().optional(),
    quantity: z.number().positive(),
    price: z.number().positive(),
  })).min(1, 'Order must contain at least one item'),
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string(),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().default('US'),
  }),
  paymentMethod: z.enum(['credit_card', 'cashapp', 'crypto', 'wallet_balance']),
  notes: z.string().optional(),
  promoCode: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const authError = await authenticate(req)
    if (authError) return authError

    const user = (req as any).user
    const searchParams = new URL(req.url).searchParams
    const { data, errors } = validateQuery(searchParams, paginationSchema)
    
    if (errors) {
      return validationError(formatZodErrors(errors))
    }

    const { page = 1, limit = 20, sort = 'created_at', order = 'desc' } = data!

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) FROM orders WHERE user_id = $1',
      [user.id]
    )
    const total = parseInt(countResult.rows[0].count)

    // Get orders with pagination
    const offset = (page - 1) * limit
    const ordersQuery = `
      SELECT 
        o.*,
        COUNT(oi.id) as item_count,
        SUM(oi.quantity) as total_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.${sort} ${order.toUpperCase()}
      LIMIT $2 OFFSET $3
    `

    const result = await query(ordersQuery, [user.id, limit, offset])

    const orders = result.rows.map(row => ({
      id: row.id,
      orderNumber: row.order_number,
      status: row.status,
      paymentStatus: row.payment_status,
      paymentMethod: row.payment_method,
      subtotal: parseFloat(row.subtotal),
      taxAmount: parseFloat(row.tax_amount),
      shippingAmount: parseFloat(row.shipping_amount),
      discountAmount: parseFloat(row.discount_amount),
      totalAmount: parseFloat(row.total_amount),
      currency: row.currency,
      itemCount: parseInt(row.item_count),
      totalItems: parseInt(row.total_items),
      trackingNumber: row.tracking_number,
      shippedAt: row.shipped_at,
      deliveredAt: row.delivered_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))

    return paginatedResponse(orders, page, limit, total)
  } catch (error) {
    return serverError(error as Error)
  }
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const authError = await authenticate(req)
    if (authError) return authError

    const user = (req as any).user

    // Validate request body
    const { data, errors } = await validateRequest(req, createOrderSchema)
    
    if (errors) {
      return validationError(formatZodErrors(errors))
    }

    const { items, shippingAddress, paymentMethod, notes, promoCode } = data!

    // Create order in transaction
    const order = await transaction(async (client) => {
      // Calculate order totals
      let subtotal = 0
      const orderItems = []

      // Verify product availability and calculate totals
      for (const item of items) {
        const productQuery = item.variantId
          ? `SELECT p.name, pv.name as variant_name, pv.price, pv.stock_quantity
             FROM products p
             JOIN product_variants pv ON p.id = pv.product_id
             WHERE p.id = $1 AND pv.id = $2 AND p.is_active = true AND pv.is_active = true`
          : `SELECT name, price, stock_quantity
             FROM products
             WHERE id = $1 AND is_active = true`

        const params = item.variantId ? [item.productId, item.variantId] : [item.productId]
        const productResult = await client.query(productQuery, params)

        if (productResult.rows.length === 0) {
          throw new Error(`Product not found: ${item.productId}`)
        }

        const product = productResult.rows[0]

        if (product.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`)
        }

        const itemTotal = item.price * item.quantity
        subtotal += itemTotal

        orderItems.push({
          productId: item.productId,
          variantId: item.variantId,
          productName: product.name,
          variantName: product.variant_name,
          quantity: item.quantity,
          price: item.price,
          total: itemTotal,
        })
      }

      // Calculate tax (example: 10%)
      const taxAmount = subtotal * 0.1
      const shippingAmount = subtotal > 50 ? 0 : 10 // Free shipping over $50
      let discountAmount = 0

      // Apply promo code if provided
      if (promoCode) {
        const promoResult = await client.query(
          `SELECT discount_type, discount_value, min_order_amount
           FROM promo_codes
           WHERE code = $1 AND is_active = true
           AND (valid_from IS NULL OR valid_from <= CURRENT_TIMESTAMP)
           AND (valid_until IS NULL OR valid_until >= CURRENT_TIMESTAMP)`,
          [promoCode]
        )

        if (promoResult.rows.length > 0) {
          const promo = promoResult.rows[0]
          if (subtotal >= promo.min_order_amount) {
            discountAmount = promo.discount_type === 'percentage'
              ? subtotal * (promo.discount_value / 100)
              : promo.discount_value
          }
        }
      }

      const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders (
          order_number, user_id, status, payment_status, payment_method,
          subtotal, tax_amount, shipping_amount, discount_amount, total_amount,
          shipping_first_name, shipping_last_name, shipping_email, shipping_phone,
          shipping_address_line1, shipping_address_line2, shipping_city,
          shipping_state, shipping_postal_code, shipping_country,
          notes, promo_code_used
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        RETURNING *`,
        [
          orderNumber, user.id, 'pending', 'pending', paymentMethod,
          subtotal, taxAmount, shippingAmount, discountAmount, totalAmount,
          shippingAddress.firstName, shippingAddress.lastName, shippingAddress.email,
          shippingAddress.phone, shippingAddress.addressLine1, shippingAddress.addressLine2,
          shippingAddress.city, shippingAddress.state, shippingAddress.postalCode,
          shippingAddress.country, notes, promoCode
        ]
      )

      const order = orderResult.rows[0]

      // Create order items
      for (const item of orderItems) {
        await client.query(
          `INSERT INTO order_items (
            order_id, product_id, variant_id, product_name, variant_name,
            quantity, price, total
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            order.id, item.productId, item.variantId, item.productName,
            item.variantName, item.quantity, item.price, item.total
          ]
        )

        // Update stock
        if (item.variantId) {
          await client.query(
            'UPDATE product_variants SET stock_quantity = stock_quantity - $1 WHERE id = $2',
            [item.quantity, item.variantId]
          )
        } else {
          await client.query(
            'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
            [item.quantity, item.productId]
          )
        }
      }

      return order
    })

    return successResponse(
      {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        paymentStatus: order.payment_status,
        totalAmount: parseFloat(order.total_amount),
        createdAt: order.created_at,
      },
      'Order created successfully'
    )
  } catch (error) {
    return serverError(error as Error)
  }
}