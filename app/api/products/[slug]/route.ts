import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { z } from "zod"

const slugSchema = z.object({
  slug: z.string().min(1, "Product slug is required"),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = slugSchema.parse(await params)

    // Get product by slug
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
        created_at
      FROM products 
      WHERE slug = $1`,
      [slug]
    )

    if (products.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    const product = products[0]

    // Increment view count
    await query(
      "UPDATE products SET view_count = COALESCE(view_count, 0) + 1 WHERE id = $1",
      [product.id]
    )

    // Get related products (same category, excluding current product)
    const { rows: relatedProducts } = await query(
      `SELECT 
        id,
        name,
        slug,
        price,
        original_price,
        image,
        category,
        rating,
        review_count,
        is_new
      FROM products 
      WHERE category = $1 AND id != $2 AND stock_count > 0
      ORDER BY rating DESC, review_count DESC
      LIMIT 4`,
      [product.category, product.id]
    )

    // Transform product to match frontend interface
    const transformedProduct = {
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
    }

    // Transform related products
    const transformedRelatedProducts = relatedProducts.map(related => ({
      id: related.id.toString(),
      name: related.name,
      slug: related.slug,
      price: parseFloat(related.price),
      originalPrice: related.original_price ? parseFloat(related.original_price) : undefined,
      image: related.image,
      category: related.category,
      rating: parseFloat(related.rating),
      reviewCount: related.review_count,
      isNew: related.is_new,
    }))

    return NextResponse.json({
      product: transformedProduct,
      relatedProducts: transformedRelatedProducts
    })

  } catch (error) {
    console.error("Product API error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid product slug", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}