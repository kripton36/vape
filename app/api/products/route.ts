import { NextRequest, NextResponse } from "next/server"
import { productQueries } from "@/lib/database"
import { withMiddleware } from "@/lib/middleware"

async function handler(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Parse query parameters
  const category = searchParams.get("category") || undefined
  const featured = searchParams.get("featured") === "true"
  const search = searchParams.get("search") || undefined
  const limit = parseInt(searchParams.get("limit") || "20")
  const offset = parseInt(searchParams.get("offset") || "0")

  try {
    const filters = {
      category,
      featured: featured || undefined,
      limit: Math.min(limit, 100), // Max 100 items per request
      offset: Math.max(offset, 0),
    }

    let products = await productQueries.getAll(filters)

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category_name?.toLowerCase().includes(searchLower) ||
        product.effects?.some((effect: string) => effect.toLowerCase().includes(searchLower)) ||
        product.flavors?.some((flavor: string) => flavor.toLowerCase().includes(searchLower))
      )
    }

    // Transform the data to match frontend expectations
    const transformedProducts = products.map(product => ({
      id: product.id.toString(),
      name: product.name,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : undefined,
      image: product.image_url || "/placeholder-product.png",
      category: product.category_slug || product.category_name,
      description: product.description,
      thc: product.thc_content,
      cbd: product.cbd_content,
      effects: product.effects || [],
      flavors: product.flavors || [],
      inStock: product.stock_quantity > 0,
      stockCount: product.stock_quantity,
      rating: parseFloat(product.average_rating) || 0,
      reviewCount: parseInt(product.review_count) || 0,
      isNew: product.is_new || false,
      isFeatured: product.is_featured || false,
      slug: product.slug,
    }))

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      pagination: {
        total: products.length,
        limit,
        offset,
        hasMore: products.length === limit,
      },
    })
  } catch (error) {
    console.error("Products fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export const GET = withMiddleware(handler, {
  rateLimit: { maxRequests: 100, windowMs: 15 * 60 * 1000 }
})