import { NextResponse } from "next/server"
import { z } from "zod"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export function successResponse<T>(data: T, message?: string): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message,
  })
}

export function errorResponse(error: string, status: number = 400): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  )
}

export function validationErrorResponse(zodError: z.ZodError): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: "Validation failed",
      details: zodError.errors,
    },
    { status: 400 }
  )
}

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error)

  if (error instanceof z.ZodError) {
    return validationErrorResponse(error)
  }

  if (error instanceof Error) {
    return errorResponse(error.message, 400)
  }

  return errorResponse("Internal server error", 500)
}

export function paginateResults<T>(
  items: T[],
  page: number = 1,
  limit: number = 20
): {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
} {
  const total = items.length
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const paginatedItems = items.slice(offset, offset + limit)

  return {
    items: paginatedItems,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}