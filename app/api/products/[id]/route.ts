import { NextRequest, NextResponse } from 'next/server'
import { productQueries, reviewQueries } from '@/lib/database'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const product = await productQueries.findById(params.id)
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Get product reviews
    const reviews = await reviewQueries.findByProductId(params.id)
    
    return NextResponse.json({
      success: true,
      data: {
        ...product,
        reviews
      }
    })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // This would typically require admin authentication
    const updateData = await request.json()
    
    const product = await productQueries.findById(params.id)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await productQueries.update(params.id, {
      ...updateData,
      updated_at: new Date().toISOString()
    })

    const updatedProduct = await productQueries.findById(params.id)

    return NextResponse.json({
      success: true,
      data: updatedProduct
    })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // This would typically require admin authentication
    const product = await productQueries.findById(params.id)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await productQueries.delete(params.id)

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}