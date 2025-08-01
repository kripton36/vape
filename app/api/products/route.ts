import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { z } from "zod"

const productsQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["price_asc", "price_desc", "name_asc", "name_desc", "rating_desc", "newest"]).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  inStock: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = productsQuerySchema.parse(Object.fromEntries(searchParams))

    let whereConditions: string[] = []
    let queryParams: any[] = []
    let paramIndex = 1

    // Build WHERE clause
    if (params.category) {
      whereConditions.push(`category = $${paramIndex}`)
      queryParams.push(params.category)
      paramIndex++
    }

    if (params.search) {
      whereConditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`)
      queryParams.push(`%${params.search}%`)
      paramIndex++
    }

    if (params.minPrice !== undefined) {
      whereConditions.push(`price >= $${paramIndex}`)
      queryParams.push(params.minPrice)
      paramIndex++
    }

    if (params.maxPrice !== undefined) {
      whereConditions.push(`price <= $${paramIndex}`)
      queryParams.push(params.maxPrice)
      paramIndex++
    }

    if (params.inStock !== undefined) {
      whereConditions.push(`stock_count > 0`)
    }

    if (params.featured !== undefined) {
      whereConditions.push(`is_featured = $${paramIndex}`)
      queryParams.push(params.featured)
      paramIndex++
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    // Build ORDER BY clause
    let orderBy = "created_at DESC"
    if (params.sort) {
      switch (params.sort) {
        case "price_asc":
          orderBy = "price ASC"
          break
        case "price_desc":
          orderBy = "price DESC"
          break
        case "name_asc":
          orderBy = "name ASC"
          break
        case "name_desc":
          orderBy = "name DESC"
          break
        case "rating_desc":
          orderBy = "rating DESC"
          break
        case "newest":
          orderBy = "created_at DESC"
          break
      }
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products
      ${whereClause}
    `
    const { rows: countRows } = await query(countQuery, queryParams)
    const total = parseInt(countRows[0].total)

    // Get products with pagination
    const productsQuery = `
      SELECT 
        id,
        name,
        slug,
        description,
        price,
        original_price,
        image,
        category,
        thc_content,
        cbd_content,
        effects,
        flavors,
        stock_count,
        rating,
        review_count,
        is_featured,
        is_new,
        created_at
      FROM products
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    queryParams.push(params.limit, params.offset)

    const { rows: products } = await query(productsQuery, queryParams)

    // Transform products to match frontend interface
    const transformedProducts = products.map(product => ({
      id: product.id.toString(),
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : undefined,
      image: product.image,
      category: product.category,
      description: product.description,
      thc: product.thc_content,
      cbd: product.cbd_content,
      effects: product.effects ? JSON.parse(product.effects) : [],
      flavors: product.flavors ? JSON.parse(product.flavors) : [],
      inStock: product.stock_count > 0,
      stockCount: product.stock_count,
      rating: parseFloat(product.rating),
      reviewCount: product.review_count,
      isNew: product.is_new,
      isFeatured: product.is_featured,
    }))

    return NextResponse.json({
      products: transformedProducts,
      total,
      limit: params.limit,
      offset: params.offset,
      hasMore: params.offset + params.limit < total
    })

  } catch (error) {
    console.error("Products API error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}