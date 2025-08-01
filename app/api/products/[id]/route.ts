import { NextRequest, NextResponse } from "next/server"
import { productQueries } from "@/lib/database"
import { withMiddleware } from "@/lib/middleware"

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    let product;
    
    // Try to get by ID first (if it's a number), otherwise by slug
    if (/^\d+$/.test(id)) {
      product = await productQueries.getById(parseInt(id))
    } else {
      product = await productQueries.getBySlug(id)
    }

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Transform the data to match frontend expectations
    const transformedProduct = {
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
      // Additional details for single product view
      sku: product.sku,
      weight: product.weight,
      dimensions: product.dimensions,
      labTested: product.lab_tested || false,
      labResults: product.lab_results,
      grownBy: product.grown_by,
      harvestDate: product.harvest_date,
      created_at: product.created_at,
      updated_at: product.updated_at,
    }

    return NextResponse.json({
      success: true,
      product: transformedProduct,
    })
  } catch (error) {
    console.error("Product fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

export const GET = withMiddleware(handler, {
  rateLimit: { maxRequests: 100, windowMs: 15 * 60 * 1000 }
})