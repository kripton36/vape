import { Pool, type PoolClient } from "pg"

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Database connection wrapper
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("Executed query", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Transaction wrapper
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

// User management functions
export const userQueries = {
  async create(userData: {
    email: string
    password_hash: string
    first_name?: string
    last_name?: string
    phone?: string
    date_of_birth?: string
  }) {
    const { rows } = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, date_of_birth)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, created_at`,
      [
        userData.email,
        userData.password_hash,
        userData.first_name,
        userData.last_name,
        userData.phone,
        userData.date_of_birth,
      ],
    )
    return rows[0]
  },

  async findByEmail(email: string) {
    const { rows } = await query("SELECT * FROM users WHERE email = $1", [email])
    return rows[0]
  },

  async findById(id: number) {
    const { rows } = await query(
      "SELECT id, email, first_name, last_name, phone, is_verified, kyc_status, loyalty_points, wallet_balance, created_at FROM users WHERE id = $1",
      [id],
    )
    return rows[0]
  },

  async updateWalletBalance(userId: number, amount: number, transactionType: string, description?: string) {
    return await transaction(async (client) => {
      // Get current balance
      const { rows: userRows } = await client.query("SELECT wallet_balance FROM users WHERE id = $1", [userId])
      const currentBalance = Number.parseFloat(userRows[0].wallet_balance)
      const newBalance = currentBalance + amount

      // Update user balance
      await client.query("UPDATE users SET wallet_balance = $1 WHERE id = $2", [newBalance, userId])

      // Record transaction
      await client.query(
        `INSERT INTO wallet_transactions (user_id, transaction_type, amount, balance_after, description)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, transactionType, amount, newBalance, description],
      )

      return newBalance
    })
  },

  async updateLoyaltyPoints(
    userId: number,
    points: number,
    transactionType: string,
    referenceType?: string,
    referenceId?: number,
  ) {
    return await transaction(async (client) => {
      // Get current points
      const { rows: userRows } = await client.query("SELECT loyalty_points FROM users WHERE id = $1", [userId])
      const currentPoints = userRows[0].loyalty_points
      const newPoints = currentPoints + points

      // Update user points
      await client.query("UPDATE users SET loyalty_points = $1 WHERE id = $2", [newPoints, userId])

      // Record transaction
      await client.query(
        `INSERT INTO loyalty_transactions (user_id, transaction_type, points, balance_after, reference_type, reference_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, transactionType, points, newPoints, referenceType, referenceId],
      )

      return newPoints
    })
  },
}

// Product management functions
export const productQueries = {
  async getAll(filters?: { category?: string; featured?: boolean; limit?: number; offset?: number }) {
    let query_text = `
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             COALESCE(AVG(pr.rating), 0) as average_rating,
             COUNT(pr.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.is_approved = true
      WHERE p.is_active = true
    `
    const params: any[] = []
    let paramCount = 0

    if (filters?.category) {
      paramCount++
      query_text += ` AND c.slug = $${paramCount}`
      params.push(filters.category)
    }

    if (filters?.featured) {
      query_text += ` AND p.is_featured = true`
    }

    query_text += ` GROUP BY p.id, c.name, c.slug ORDER BY p.created_at DESC`

    if (filters?.limit) {
      paramCount++
      query_text += ` LIMIT $${paramCount}`
      params.push(filters.limit)
    }

    if (filters?.offset) {
      paramCount++
      query_text += ` OFFSET $${paramCount}`
      params.push(filters.offset)
    }

    const { rows } = await query(query_text, params)
    return rows
  },

  async getById(id: number) {
    const { rows } = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
              COALESCE(AVG(pr.rating), 0) as average_rating,
              COUNT(pr.id) as review_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.is_approved = true
       WHERE p.id = $1 AND p.is_active = true
       GROUP BY p.id, c.name, c.slug`,
      [id],
    )
    return rows[0]
  },

  async getBySlug(slug: string) {
    const { rows } = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
              COALESCE(AVG(pr.rating), 0) as average_rating,
              COUNT(pr.id) as review_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.is_approved = true
       WHERE p.slug = $1 AND p.is_active = true
       GROUP BY p.id, c.name, c.slug`,
      [slug],
    )
    return rows[0]
  },

  async updateStock(productId: number, quantity: number) {
    const { rows } = await query(
      "UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2 RETURNING stock_quantity",
      [quantity, productId],
    )
    return rows[0]
  },
}

// Order management functions
export const orderQueries = {
  async create(orderData: any) {
    return await transaction(async (client) => {
      // Create order
      const { rows: orderRows } = await client.query(
        `INSERT INTO orders (order_number, user_id, status, payment_status, payment_method, 
                           subtotal, tax_amount, shipping_amount, discount_amount, total_amount,
                           shipping_first_name, shipping_last_name, shipping_email, shipping_phone,
                           shipping_address_line1, shipping_address_line2, shipping_city, 
                           shipping_state, shipping_postal_code, shipping_country)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
         RETURNING *`,
        [
          orderData.order_number,
          orderData.user_id,
          orderData.status,
          orderData.payment_status,
          orderData.payment_method,
          orderData.subtotal,
          orderData.tax_amount,
          orderData.shipping_amount,
          orderData.discount_amount,
          orderData.total_amount,
          orderData.shipping_first_name,
          orderData.shipping_last_name,
          orderData.shipping_email,
          orderData.shipping_phone,
          orderData.shipping_address_line1,
          orderData.shipping_address_line2,
          orderData.shipping_city,
          orderData.shipping_state,
          orderData.shipping_postal_code,
          orderData.shipping_country,
        ],
      )

      const order = orderRows[0]

      // Create order items
      for (const item of orderData.items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price, product_data)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            order.id,
            item.product_id,
            item.product_name,
            item.product_sku,
            item.quantity,
            item.unit_price,
            item.total_price,
            JSON.stringify(item.product_data),
          ],
        )

        // Update product stock
        await client.query("UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2", [
          item.quantity,
          item.product_id,
        ])
      }

      return order
    })
  },

  async getByUserId(userId: number, limit = 10, offset = 0) {
    const { rows } = await query(
      `SELECT o.*, 
              json_agg(
                json_build_object(
                  'id', oi.id,
                  'product_name', oi.product_name,
                  'quantity', oi.quantity,
                  'unit_price', oi.unit_price,
                  'total_price', oi.total_price
                )
              ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    )
    return rows
  },

  async getById(id: number) {
    const { rows } = await query(
      `SELECT o.*, 
              json_agg(
                json_build_object(
                  'id', oi.id,
                  'product_id', oi.product_id,
                  'product_name', oi.product_name,
                  'product_sku', oi.product_sku,
                  'quantity', oi.quantity,
                  'unit_price', oi.unit_price,
                  'total_price', oi.total_price,
                  'product_data', oi.product_data
                )
              ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.id = $1
       GROUP BY o.id`,
      [id],
    )
    return rows[0]
  },

  async updateStatus(orderId: number, status: string) {
    const { rows } = await query(
      "UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [status, orderId],
    )
    return rows[0]
  },
}

// Chat management functions
export const chatQueries = {
  async createSession(sessionData: {
    session_id: string
    user_id?: number
    customer_name?: string
    customer_email?: string
    priority?: string
  }) {
    const { rows } = await query(
      `INSERT INTO chat_sessions (session_id, user_id, customer_name, customer_email, priority)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        sessionData.session_id,
        sessionData.user_id,
        sessionData.customer_name,
        sessionData.customer_email,
        sessionData.priority || "normal",
      ],
    )
    return rows[0]
  },

  async getSession(sessionId: string) {
    const { rows } = await query("SELECT * FROM chat_sessions WHERE session_id = $1", [sessionId])
    return rows[0]
  },

  async getActiveSessions() {
    const { rows } = await query(
      `SELECT cs.*, 
              COUNT(cm.id) as message_count,
              COUNT(CASE WHEN cm.is_read = false AND cm.sender_type = 'customer' THEN 1 END) as unread_count,
              MAX(cm.created_at) as last_message_at
       FROM chat_sessions cs
       LEFT JOIN chat_messages cm ON cs.session_id = cm.session_id
       WHERE cs.status IN ('active', 'waiting')
       GROUP BY cs.id
       ORDER BY last_message_at DESC NULLS LAST`,
    )
    return rows
  },

  async addMessage(messageData: {
    session_id: string
    sender_type: "customer" | "admin" | "system"
    sender_id?: number
    sender_name?: string
    message_text: string
    message_type?: string
    metadata?: any
  }) {
    const { rows } = await query(
      `INSERT INTO chat_messages (session_id, sender_type, sender_id, sender_name, message_text, message_type, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        messageData.session_id,
        messageData.sender_type,
        messageData.sender_id,
        messageData.sender_name,
        messageData.message_text,
        messageData.message_type || "text",
        messageData.metadata ? JSON.stringify(messageData.metadata) : null,
      ],
    )

    // Update session timestamp
    await query("UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE session_id = $1", [
      messageData.session_id,
    ])

    return rows[0]
  },

  async getMessages(sessionId: string, limit = 50, offset = 0) {
    const { rows } = await query(
      `SELECT * FROM chat_messages 
       WHERE session_id = $1 
       ORDER BY created_at ASC 
       LIMIT $2 OFFSET $3`,
      [sessionId, limit, offset],
    )
    return rows
  },

  async markMessagesAsRead(sessionId: string, senderType: "customer" | "admin") {
    await query("UPDATE chat_messages SET is_read = true WHERE session_id = $1 AND sender_type != $2", [
      sessionId,
      senderType,
    ])
  },

  async assignToAdmin(sessionId: string, adminId: number) {
    const { rows } = await query(
      "UPDATE chat_sessions SET assigned_admin_id = $1, status = $2 WHERE session_id = $3 RETURNING *",
      [adminId, "active", sessionId],
    )
    return rows[0]
  },

  async closeSession(sessionId: string) {
    const { rows } = await query(
      "UPDATE chat_sessions SET status = $1, closed_at = CURRENT_TIMESTAMP WHERE session_id = $2 RETURNING *",
      ["closed", sessionId],
    )
    return rows[0]
  },
}

// FAQ functions
export const faqQueries = {
  async getCategories() {
    const { rows } = await query("SELECT * FROM faq_categories WHERE is_active = true ORDER BY sort_order, name")
    return rows
  },

  async getItemsByCategory(categorySlug?: string) {
    let query_text = `
      SELECT fi.*, fc.name as category_name, fc.slug as category_slug
      FROM faq_items fi
      JOIN faq_categories fc ON fi.category_id = fc.id
      WHERE fi.is_active = true AND fc.is_active = true
    `
    const params: any[] = []

    if (categorySlug) {
      query_text += " AND fc.slug = $1"
      params.push(categorySlug)
    }

    query_text += " ORDER BY fc.sort_order, fi.sort_order, fi.question"

    const { rows } = await query(query_text, params)
    return rows
  },

  async incrementViewCount(itemId: number) {
    await query("UPDATE faq_items SET view_count = view_count + 1 WHERE id = $1", [itemId])
  },
}

// Promo code functions
export const promoQueries = {
  async getByCode(code: string) {
    const { rows } = await query(
      `SELECT * FROM promo_codes 
       WHERE code = $1 AND is_active = true 
       AND (starts_at IS NULL OR starts_at <= NOW())
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [code],
    )
    return rows[0]
  },

  async validateUsage(promoId: number, userId?: number) {
    const { rows } = await query(
      `SELECT 
         pc.usage_limit,
         pc.usage_count,
         pc.user_usage_limit,
         COALESCE(user_usage.usage_count, 0) as user_usage_count
       FROM promo_codes pc
       LEFT JOIN (
         SELECT promo_code_id, COUNT(*) as usage_count
         FROM promo_code_usage
         WHERE user_id = $2
         GROUP BY promo_code_id
       ) user_usage ON pc.id = user_usage.promo_code_id
       WHERE pc.id = $1`,
      [promoId, userId],
    )
    return rows[0]
  },

  async recordUsage(promoId: number, userId: number, orderId: number, discountAmount: number) {
    return await transaction(async (client) => {
      // Record usage
      await client.query(
        "INSERT INTO promo_code_usage (promo_code_id, user_id, order_id, discount_amount) VALUES ($1, $2, $3, $4)",
        [promoId, userId, orderId, discountAmount],
      )

      // Update usage count
      await client.query("UPDATE promo_codes SET usage_count = usage_count + 1 WHERE id = $1", [promoId])
    })
  },
}

export default pool
