import { NextRequest } from 'next/server'
import { query } from '@/lib/database'
import { authenticate } from '@/lib/api/middleware/auth'
import { successResponse, notFoundError, forbiddenError, serverError } from '@/lib/api/utils/response'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    // Authenticate user
    const authError = await authenticate(req)
    if (authError) return authError

    const user = (req as any).user
    const orderId = parseInt(params.id)
    
    if (isNaN(orderId)) {
      return notFoundError('Order')
    }

    // Get order details
    const orderQuery = `
      SELECT o.*
      FROM orders o
      WHERE o.id = $1
    `

    const orderResult = await query(orderQuery, [orderId])

    if (orderResult.rows.length === 0) {
      return notFoundError('Order')
    }

    const order = orderResult.rows[0]

    // Verify order belongs to user
    if (order.user_id !== user.id) {
      return forbiddenError('You do not have access to this order')
    }

    // Get order items
    const itemsQuery = `
      SELECT 
        oi.*,
        p.images,
        p.slug as product_slug
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.id
    `

    const itemsResult = await query(itemsQuery, [orderId])

    // Get payment history
    const paymentsQuery = `
      SELECT *
      FROM payments
      WHERE order_id = $1
      ORDER BY created_at DESC
    `

    const paymentsResult = await query(paymentsQuery, [orderId])

    // Get order status history
    const statusQuery = `
      SELECT *
      FROM order_status_history
      WHERE order_id = $1
      ORDER BY created_at DESC
    `

    const statusResult = await query(statusQuery, [orderId])

    const orderData = {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      subtotal: parseFloat(order.subtotal),
      taxAmount: parseFloat(order.tax_amount),
      shippingAmount: parseFloat(order.shipping_amount),
      discountAmount: parseFloat(order.discount_amount),
      totalAmount: parseFloat(order.total_amount),
      currency: order.currency,
      shipping: {
        firstName: order.shipping_first_name,
        lastName: order.shipping_last_name,
        email: order.shipping_email,
        phone: order.shipping_phone,
        addressLine1: order.shipping_address_line1,
        addressLine2: order.shipping_address_line2,
        city: order.shipping_city,
        state: order.shipping_state,
        postalCode: order.shipping_postal_code,
        country: order.shipping_country,
      },
      trackingNumber: order.tracking_number,
      notes: order.notes,
      promoCodeUsed: order.promo_code_used,
      shippedAt: order.shipped_at,
      deliveredAt: order.delivered_at,
      cancelledAt: order.cancelled_at,
      cancellationReason: order.cancellation_reason,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items: itemsResult.rows.map(item => ({
        id: item.id,
        productId: item.product_id,
        variantId: item.variant_id,
        productName: item.product_name,
        variantName: item.variant_name,
        productSlug: item.product_slug,
        quantity: item.quantity,
        price: parseFloat(item.price),
        total: parseFloat(item.total),
        images: item.images || [],
      })),
      payments: paymentsResult.rows.map(payment => ({
        id: payment.id,
        amount: parseFloat(payment.amount),
        method: payment.payment_method,
        status: payment.status,
        transactionId: payment.transaction_id,
        createdAt: payment.created_at,
      })),
      statusHistory: statusResult.rows.map(status => ({
        id: status.id,
        status: status.status,
        notes: status.notes,
        createdBy: status.created_by,
        createdAt: status.created_at,
      })),
    }

    return successResponse(orderData)
  } catch (error) {
    return serverError(error as Error)
  }
}