import { NextRequest } from 'next/server'
import { z } from 'zod'
import { query } from '@/lib/database'
import { paginatedResponse, serverError } from '@/lib/api/utils/response'
import { validateQuery, formatZodErrors, paginationSchema, validationError } from '@/lib/api/utils/validation'

const productQuerySchema = paginationSchema.extend({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  maxPrice: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  inStock: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  featured: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
})

export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams
    const { data, errors } = validateQuery(searchParams, productQuerySchema)
    
    if (errors) {
      return validationError(formatZodErrors(errors))
    }

    const { 
      page = 1, 
      limit = 20, 
      sort = 'created_at', 
      order = 'desc',
      category,
      search,
      minPrice,
      maxPrice,
      inStock,
      featured
    } = data!

    // Build query conditions
    const conditions: string[] = ['p.is_active = true']
    const params: any[] = []
    let paramIndex = 1

    if (category) {
      conditions.push(`c.slug = $${paramIndex}`)
      params.push(category)
      paramIndex++
    }

    if (search) {
      conditions.push(`(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`)
      params.push(`%${search}%`)
      paramIndex++
    }

    if (minPrice !== undefined) {
      conditions.push(`p.price >= $${paramIndex}`)
      params.push(minPrice)
      paramIndex++
    }

    if (maxPrice !== undefined) {
      conditions.push(`p.price <= $${paramIndex}`)
      params.push(maxPrice)
      paramIndex++
    }

    if (inStock !== undefined) {
      conditions.push(inStock ? `p.stock_quantity > 0` : `p.stock_quantity = 0`)
    }

    if (featured !== undefined) {
      conditions.push(`p.is_featured = $${paramIndex}`)
      params.push(featured)
      paramIndex++
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Get total count
    const countQuery = `
      SELECT COUNT(*)
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `
    const countResult = await query(countQuery, params)
    const total = parseInt(countResult.rows[0].count)

    // Get products with pagination
    const offset = (page - 1) * limit
    params.push(limit, offset)

    const productsQuery = `
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.description,
        p.short_description,
        p.price,
        p.original_price,
        p.sku,
        p.stock_quantity,
        p.images,
        p.is_featured,
        p.thc_content,
        p.cbd_content,
        p.strain_type,
        p.effects,
        c.name as category_name,
        c.slug as category_slug,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(DISTINCT r.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id
      ${whereClause}
      GROUP BY p.id, c.id
      ORDER BY p.${sort} ${order.toUpperCase()}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    const result = await query(productsQuery, params)

    const products = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      shortDescription: row.short_description,
      price: parseFloat(row.price),
      originalPrice: row.original_price ? parseFloat(row.original_price) : null,
      sku: row.sku,
      stockQuantity: row.stock_quantity,
      images: row.images || [],
      isFeatured: row.is_featured,
      thcContent: row.thc_content,
      cbdContent: row.cbd_content,
      strainType: row.strain_type,
      effects: row.effects || [],
      category: {
        name: row.category_name,
        slug: row.category_slug,
      },
      rating: parseFloat(row.average_rating),
      reviewCount: parseInt(row.review_count),
      inStock: row.stock_quantity > 0,
    }))

    return paginatedResponse(products, page, limit, total)
  } catch (error) {
    return serverError(error as Error)
  }
}