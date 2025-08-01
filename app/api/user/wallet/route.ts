import { NextRequest, NextResponse } from "next/server"
import { query, transaction } from "@/lib/database"
import { requireAuth } from "@/lib/auth-middleware"
import { z } from "zod"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils"

const depositSchema = z.object({
  amount: z.number().min(1, "Amount must be at least $1"),
  paymentMethod: z.enum(["credit_card", "bank_transfer", "crypto"]),
})

const withdrawSchema = z.object({
  amount: z.number().min(1, "Amount must be at least $1"),
  bankAccount: z.string().min(1, "Bank account is required"),
})

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    // Get wallet balance and recent transactions
    const { rows: userData } = await query(
      "SELECT wallet_balance FROM users WHERE id = $1",
      [user.userId]
    )

    if (userData.length === 0) {
      return errorResponse("User not found", 404)
    }

    // Get recent transactions
    const { rows: transactions } = await query(
      `SELECT 
        id, transaction_type, amount, balance_after, description, created_at
      FROM wallet_transactions 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 10`,
      [user.userId]
    )

    return successResponse({
      balance: parseFloat(userData[0].wallet_balance),
      transactions: transactions.map(tx => ({
        id: tx.id,
        type: tx.transaction_type,
        amount: parseFloat(tx.amount),
        balanceAfter: parseFloat(tx.balance_after),
        description: tx.description,
        createdAt: tx.created_at,
      })),
    })

  } catch (error) {
    return handleApiError(error)
  }
})

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json()
    const { amount, paymentMethod } = depositSchema.parse(body)

    if (amount > 1000) {
      return errorResponse("Maximum deposit amount is $1000")
    }

    const result = await transaction(async (client) => {
      // Get current balance
      const { rows: userData } = await client.query(
        "SELECT wallet_balance FROM users WHERE id = $1",
        [user.userId]
      )

      if (userData.length === 0) {
        throw new Error("User not found")
      }

      const currentBalance = parseFloat(userData[0].wallet_balance)
      const newBalance = currentBalance + amount

      // Update wallet balance
      await client.query(
        "UPDATE users SET wallet_balance = $1 WHERE id = $2",
        [newBalance, user.userId]
      )

      // Record transaction
      const { rows: transactionData } = await client.query(
        `INSERT INTO wallet_transactions (
          user_id, transaction_type, amount, balance_after, description
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id`,
        [user.userId, "deposit", amount, newBalance, `Deposit via ${paymentMethod}`]
      )

      return {
        transactionId: transactionData[0].id,
        newBalance,
        amount,
      }
    })

    return successResponse({
      transactionId: result.transactionId,
      newBalance: result.newBalance,
      amount: result.amount,
    }, "Deposit successful")

  } catch (error) {
    return handleApiError(error)
  }
})

export const PUT = requireAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json()
    const { amount, bankAccount } = withdrawSchema.parse(body)

    if (amount > 500) {
      return errorResponse("Maximum withdrawal amount is $500")
    }

    const result = await transaction(async (client) => {
      // Get current balance
      const { rows: userData } = await client.query(
        "SELECT wallet_balance FROM users WHERE id = $1",
        [user.userId]
      )

      if (userData.length === 0) {
        throw new Error("User not found")
      }

      const currentBalance = parseFloat(userData[0].wallet_balance)

      if (currentBalance < amount) {
        throw new Error("Insufficient balance")
      }

      const newBalance = currentBalance - amount

      // Update wallet balance
      await client.query(
        "UPDATE users SET wallet_balance = $1 WHERE id = $2",
        [newBalance, user.userId]
      )

      // Record transaction
      const { rows: transactionData } = await client.query(
        `INSERT INTO wallet_transactions (
          user_id, transaction_type, amount, balance_after, description
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id`,
        [user.userId, "withdrawal", -amount, newBalance, `Withdrawal to ${bankAccount}`]
      )

      return {
        transactionId: transactionData[0].id,
        newBalance,
        amount,
      }
    })

    return successResponse({
      transactionId: result.transactionId,
      newBalance: result.newBalance,
      amount: result.amount,
    }, "Withdrawal request submitted")

  } catch (error) {
    return handleApiError(error)
  }
})