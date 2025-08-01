import { NextRequest, NextResponse } from "next/server"
import { productQueries } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") ?? undefined
    const featured = searchParams.get("featured") === "true" ? true : undefined
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined
    const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : undefined

    const products = await productQueries.getAll({ category, featured, limit, offset })

    return NextResponse.json({ products }, { status: 200 })
  } catch (error) {
    console.error("[PRODUCTS]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}