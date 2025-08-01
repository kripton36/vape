import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { userQueries, transaction } from '@/lib/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    // Get user from token
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const { action, amount, paymentMethod } = await request.json()

    // Validation
    if (!action || !['topup', 'withdraw'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be topup or withdraw' }, { status: 400 })
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 })
    }

    if (action === 'topup' && !paymentMethod) {
      return NextResponse.json({ error: 'Payment method is required for top-up' }, { status: 400 })
    }

    const result = await transaction(async (client) => {
      const user = await userQueries.findById(decoded.userId)
      if (!user) {
        throw new Error('User not found')
      }

      let newBalance

      if (action === 'topup') {
        // Add money to wallet
        newBalance = user.wallet_balance + amount
        
        // Here you would integrate with payment processor
        // For now, we'll simulate successful payment
        
        await userQueries.updateWalletBalance(decoded.userId, newBalance)
        
        // Create wallet transaction record
        await userQueries.createWalletTransaction({
          user_id: decoded.userId,
          type: 'credit',
          amount,
          payment_method: paymentMethod,
          description: `Wallet top-up via ${paymentMethod}`,
          created_at: new Date().toISOString()
        })

        return { newBalance, message: 'Wallet topped up successfully' }
      } else {
        // Withdraw money from wallet
        if (user.wallet_balance < amount) {
          throw new Error('Insufficient wallet balance')
        }

        if (amount < 10) {
          throw new Error('Minimum withdrawal amount is $10')
        }

        newBalance = user.wallet_balance - amount
        
        await userQueries.updateWalletBalance(decoded.userId, newBalance)
        
        // Create wallet transaction record
        await userQueries.createWalletTransaction({
          user_id: decoded.userId,
          type: 'debit',
          amount,
          description: 'Wallet withdrawal',
          status: 'pending',
          created_at: new Date().toISOString()
        })

        return { newBalance, message: 'Withdrawal request submitted successfully' }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        newBalance: result.newBalance,
        message: result.message
      }
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Wallet operation error:', error)
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user from token
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const transactions = await userQueries.getWalletTransactions(decoded.userId, { page, limit })
    const totalCount = await userQueries.countWalletTransactions(decoded.userId)

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Get wallet transactions error:', error)
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}