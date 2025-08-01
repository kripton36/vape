import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { reviewQueries, productQueries } from '@/lib/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const reviews = await reviewQueries.findByProductId(params.id, { page, limit })
    const totalCount = await reviewQueries.countByProductId(params.id)

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Get user from token
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const { rating, comment, title } = await request.json()

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Check if product exists
    const product = await productQueries.findById(params.id)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if user already reviewed this product
    const existingReview = await reviewQueries.findByUserAndProduct(decoded.userId, params.id)
    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 409 })
    }

    const reviewId = await reviewQueries.create({
      user_id: decoded.userId,
      product_id: params.id,
      rating,
      comment,
      title,
      created_at: new Date().toISOString()
    })

    const newReview = await reviewQueries.findById(reviewId)

    return NextResponse.json({
      success: true,
      data: newReview
    }, { status: 201 })
  } catch (error) {
    console.error('Create review error:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}