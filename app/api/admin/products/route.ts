import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { requireRole } from "@/lib/auth-middleware"
import { z } from "zod"

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Product slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  originalPrice: z.number().optional(),
  image: z.string().url("Valid image URL is required"),
  category: z.string().min(1, "Category is required"),
  thcContent: z.string().optional(),
  cbdContent: z.string().optional(),
  effects: z.array(z.string()).optional(),
  flavors: z.array(z.string()).optional(),
  stockCount: z.number().min(0, "Stock count must be non-negative"),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().min(0).default(0),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
})

export const GET = requireRole("admin", async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const search = searchParams.get("search") || ""

    let whereClause = ""
    let queryParams: any[] = []
    let paramIndex = 1

    if (search) {
      whereClause = "WHERE name ILIKE $1 OR description ILIKE $1"
      queryParams.push(`%${search}%`)
      paramIndex++
    }

    const { rows: products } = await query(
      `SELECT 
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
        view_count,
        created_at
      FROM products
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, limit, offset]
    )

    const transformedProducts = products.map(product => ({
      id: product.id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : undefined,
      image: product.image,
      category: product.category,
      thcContent: product.thc_content,
      cbdContent: product.cbd_content,
      effects: product.effects ? JSON.parse(product.effects) : [],
      flavors: product.flavors ? JSON.parse(product.flavors) : [],
      stockCount: product.stock_count,
      rating: parseFloat(product.rating),
      reviewCount: product.review_count,
      isFeatured: product.is_featured,
      isNew: product.is_new,
      viewCount: product.view_count || 0,
      createdAt: product.created_at,
    }))

    return NextResponse.json({
      products: transformedProducts,
      limit,
      offset,
    })

  } catch (error) {
    console.error("Admin products fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
})

export const POST = requireRole("admin", async (request: NextRequest) => {
  try {
    const body = await request.json()
    const productData = productSchema.parse(body)

    // Check if slug already exists
    const { rows: existingProducts } = await query(
      "SELECT id FROM products WHERE slug = $1",
      [productData.slug]
    )

    if (existingProducts.length > 0) {
      return NextResponse.json(
        { error: "Product with this slug already exists" },
        { status: 409 }
      )
    }

    const { rows } = await query(
      `INSERT INTO products (
        name, slug, description, price, original_price, image, category,
        thc_content, cbd_content, effects, flavors, stock_count,
        rating, review_count, is_featured, is_new
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id`,
      [
        productData.name,
        productData.slug,
        productData.description,
        productData.price,
        productData.originalPrice,
        productData.image,
        productData.category,
        productData.thcContent,
        productData.cbdContent,
        JSON.stringify(productData.effects || []),
        JSON.stringify(productData.flavors || []),
        productData.stockCount,
        productData.rating,
        productData.reviewCount,
        productData.isFeatured,
        productData.isNew,
      ]
    )

    return NextResponse.json({
      message: "Product created successfully",
      productId: rows[0].id,
    })

  } catch (error) {
    console.error("Product creation error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid product data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
})