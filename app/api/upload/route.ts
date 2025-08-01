import { NextRequest } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { 
  withErrorHandling, 
  withRateLimit, 
  requireAuth, 
  createApiResponse, 
  createErrorResponse,
  ApiError 
} from '@/lib/api-utils'

// File upload configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_DOCUMENT_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

interface UploadResult {
  filename: string
  originalName: string
  size: number
  type: string
  url: string
}

export const POST = withRateLimit(60000, 20)(withErrorHandling(async (request: NextRequest) => {
  const user = requireAuth(request)
  
  const formData = await request.formData()
  const file = formData.get('file') as File
  const uploadType = formData.get('type') as string // 'product', 'kyc', 'profile'
  
  if (!file) {
    throw new ApiError('No file uploaded', 400)
  }

  if (!uploadType || !['product', 'kyc', 'profile'].includes(uploadType)) {
    throw new ApiError('Invalid upload type. Must be: product, kyc, or profile', 400)
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new ApiError(`File size too large. Maximum ${MAX_FILE_SIZE / 1024 / 1024}MB allowed`, 400)
  }

  // Validate file type based on upload type
  let allowedTypes = ALLOWED_IMAGE_TYPES
  if (uploadType === 'kyc') {
    allowedTypes = ALLOWED_DOCUMENT_TYPES
  }

  if (!allowedTypes.includes(file.type)) {
    throw new ApiError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`, 400)
  }

  // For product uploads, require admin role
  if (uploadType === 'product' && user.role !== 'admin') {
    throw new ApiError('Admin access required for product uploads', 403)
  }

  try {
    // Generate unique filename
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `${uploadType}_${timestamp}_${randomSuffix}.${extension}`
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', uploadType)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Save file
    const filePath = join(uploadDir, filename)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    await writeFile(filePath, buffer)

    const uploadResult: UploadResult = {
      filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      url: `/uploads/${uploadType}/${filename}`
    }

    // For KYC uploads, save to database
    if (uploadType === 'kyc') {
      // TODO: Add database record for KYC document
      // await kycQueries.saveDocument({
      //   userId: user.userId,
      //   documentType: formData.get('documentType') as string,
      //   fileUrl: uploadResult.url,
      //   fileName: uploadResult.originalName,
      //   fileSize: uploadResult.size
      // })
    }

    return createApiResponse(uploadResult, 201)
  } catch (error) {
    throw new ApiError('Failed to upload file', 500)
  }
}))

// Get uploaded files for a user
export const GET = withErrorHandling(async (request: NextRequest) => {
  const user = requireAuth(request)
  const { searchParams } = new URL(request.url)
  const uploadType = searchParams.get('type')

  if (!uploadType || !['product', 'kyc', 'profile'].includes(uploadType)) {
    throw new ApiError('Invalid upload type', 400)
  }

  // For product files, require admin role
  if (uploadType === 'product' && user.role !== 'admin') {
    throw new ApiError('Admin access required', 403)
  }

  // TODO: Implement database query to get user's uploaded files
  // const files = await uploadQueries.getUserFiles(user.userId, uploadType)
  
  const files: any[] = [] // Placeholder
  
  return createApiResponse(files)
})