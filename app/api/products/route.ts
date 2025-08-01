import { NextRequest, NextResponse } from 'next/server'
import { productQueries } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const featured = searchParams.get('featured') === 'true'
    const inStock = searchParams.get('inStock') === 'true'
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')

    const filters = {
      category,
      search,
      featured,
      inStock,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined
    }

    const products = await productQueries.findAll({
      page,
      limit,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
      filters
    })

    const totalCount = await productQueries.count(filters)
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // This would typically require admin authentication
    const productData = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'price', 'category', 'description']
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const productId = await productQueries.create({
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    const newProduct = await productQueries.findById(productId)

    return NextResponse.json({
      success: true,
      data: newProduct
    }, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}