import { NextRequest } from 'next/server'
import { query } from '@/lib/database'
import { successResponse, notFoundError, serverError } from '@/lib/api/utils/response'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const productId = parseInt(params.id)
    
    if (isNaN(productId)) {
      return notFoundError('Product')
    }

    const productQuery = `
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
        p.low_stock_threshold,
        p.weight,
        p.dimensions,
        p.images,
        p.is_active,
        p.is_featured,
        p.thc_content,
        p.cbd_content,
        p.strain_type,
        p.effects,
        p.created_at,
        p.updated_at,
        c.id as category_id,
        c.name as category_name,
        c.slug as category_slug,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(DISTINCT r.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.id = $1 AND p.is_active = true
      GROUP BY p.id, c.id
    `

    const result = await query(productQuery, [productId])

    if (result.rows.length === 0) {
      return notFoundError('Product')
    }

    const row = result.rows[0]

    // Get product variants if any
    const variantsQuery = `
      SELECT id, name, price, stock_quantity, attributes
      FROM product_variants
      WHERE product_id = $1 AND is_active = true
      ORDER BY sort_order, name
    `
    const variantsResult = await query(variantsQuery, [productId])

    // Get related products
    const relatedQuery = `
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.price,
        p.original_price,
        p.images,
        p.thc_content,
        p.cbd_content,
        COALESCE(AVG(r.rating), 0) as average_rating
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.category_id = $1 
        AND p.id != $2 
        AND p.is_active = true
        AND p.stock_quantity > 0
      GROUP BY p.id
      ORDER BY RANDOM()
      LIMIT 4
    `
    const relatedResult = await query(relatedQuery, [row.category_id, productId])

    const product = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      shortDescription: row.short_description,
      price: parseFloat(row.price),
      originalPrice: row.original_price ? parseFloat(row.original_price) : null,
      sku: row.sku,
      stockQuantity: row.stock_quantity,
      lowStockThreshold: row.low_stock_threshold,
      weight: row.weight ? parseFloat(row.weight) : null,
      dimensions: row.dimensions,
      images: row.images || [],
      isActive: row.is_active,
      isFeatured: row.is_featured,
      thcContent: row.thc_content,
      cbdContent: row.cbd_content,
      strainType: row.strain_type,
      effects: row.effects || [],
      category: {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
      },
      rating: parseFloat(row.average_rating),
      reviewCount: parseInt(row.review_count),
      inStock: row.stock_quantity > 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      variants: variantsResult.rows.map(v => ({
        id: v.id,
        name: v.name,
        price: parseFloat(v.price),
        stockQuantity: v.stock_quantity,
        attributes: v.attributes,
        inStock: v.stock_quantity > 0,
      })),
      relatedProducts: relatedResult.rows.map(r => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        price: parseFloat(r.price),
        originalPrice: r.original_price ? parseFloat(r.original_price) : null,
        images: r.images || [],
        thcContent: r.thc_content,
        cbdContent: r.cbd_content,
        rating: parseFloat(r.average_rating),
      })),
    }

    return successResponse(product)
  } catch (error) {
    return serverError(error as Error)
  }
}