import { NextResponse } from "next/server"
import { productQueries } from "@/lib/database"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const product = await productQueries.getBySlug(params.slug)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    console.error("[PRODUCT_BY_SLUG]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}