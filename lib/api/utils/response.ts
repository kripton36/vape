import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export function successResponse<T>(
  data: T,
  message?: string,
  meta?: ApiResponse['meta']
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    meta
  }
  return NextResponse.json(response)
}

export function errorResponse(
  error: string,
  status: number = 400
): NextResponse {
  const response: ApiResponse = {
    success: false,
    error
  }
  return NextResponse.json(response, { status })
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): NextResponse {
  const totalPages = Math.ceil(total / limit)
  
  return successResponse(data, message, {
    page,
    limit,
    total,
    totalPages
  })
}

export function validationError(errors: Record<string, string[]>): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      errors
    },
    { status: 422 }
  )
}

export function notFoundError(resource: string = 'Resource'): NextResponse {
  return errorResponse(`${resource} not found`, 404)
}

export function unauthorizedError(message: string = 'Unauthorized'): NextResponse {
  return errorResponse(message, 401)
}

export function forbiddenError(message: string = 'Forbidden'): NextResponse {
  return errorResponse(message, 403)
}

export function serverError(error: Error): NextResponse {
  console.error('Server error:', error)
  return errorResponse(
    process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    500
  )
}