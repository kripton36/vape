"use client"

import React from 'react'
import { Loader2, Package, ShoppingCart, User, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

// Basic loading spinner
export function LoadingSpinner({ 
  size = 'default', 
  className 
}: { 
  size?: 'sm' | 'default' | 'lg'
  className?: string 
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <Loader2 
      className={cn(
        'animate-spin text-emerald-600',
        sizeClasses[size],
        className
      )} 
      aria-label="Loading"
      role="status"
    />
  )
}

// Full page loading
export function PageLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50"
      role="status"
      aria-label={message}
    >
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-full shadow-lg">
            <LoadingSpinner size="lg" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">{message}</h2>
          <p className="text-gray-600">Please wait while we load your content</p>
        </div>
      </div>
    </div>
  )
}

// Skeleton components
export function Skeleton({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200',
        className
      )}
      {...props}
    />
  )
}

// Product card skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  )
}

// Product grid skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Chat message skeleton
export function ChatMessageSkeleton({ isOwn = false }: { isOwn?: boolean }) {
  return (
    <div className={cn(
      'flex gap-3 p-4',
      isOwn ? 'justify-end' : 'justify-start'
    )}>
      {!isOwn && <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />}
      <div className={cn(
        'space-y-2 max-w-xs',
        isOwn ? 'items-end' : 'items-start'
      )}>
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
      {isOwn && <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />}
    </div>
  )
}

// Order item skeleton
export function OrderItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
      <Skeleton className="h-16 w-16 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-6 w-20" />
    </div>
  )
}

// Table skeleton
export function TableSkeleton({ 
  rows = 5, 
  columns = 4 
}: { 
  rows?: number
  columns?: number 
}) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Dashboard stats skeleton
export function StatsCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </div>
  )
}

// Inline loading with text
export function InlineLoading({ 
  text = 'Loading...', 
  size = 'sm' 
}: { 
  text?: string
  size?: 'sm' | 'default' 
}) {
  return (
    <div className="inline-flex items-center gap-2 text-gray-600">
      <LoadingSpinner size={size} />
      <span className="text-sm">{text}</span>
    </div>
  )
}

// Button loading state
export function LoadingButton({ 
  loading, 
  children, 
  disabled,
  loadingText = 'Loading...',
  className,
  ...props 
}: {
  loading: boolean
  children: React.ReactNode
  disabled?: boolean
  loadingText?: string
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md',
        'bg-emerald-600 text-white font-medium',
        'hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {loading ? loadingText : children}
    </button>
  )
}

// Empty state component
export function EmptyState({ 
  icon: Icon = Package,
  title = 'No items found',
  description = 'There are no items to display at the moment.',
  action
}: {
  icon?: React.ComponentType<any>
  title?: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gray-100 rounded-full">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  )
}

// Search loading
export function SearchLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-gray-600">
        <LoadingSpinner size="sm" />
        <span>Searching products...</span>
      </div>
      <ProductGridSkeleton count={6} />
    </div>
  )
}

// Loading overlay
export function LoadingOverlay({ 
  isVisible, 
  message = 'Loading...' 
}: { 
  isVisible: boolean
  message?: string 
}) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-700 font-medium">{message}</p>
        </div>
      </div>
    </div>
  )
}

// Progressive loading list
export function ProgressiveListSkeleton({ 
  items = 3,
  variant = 'default' 
}: { 
  items?: number
  variant?: 'default' | 'compact' 
}) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            'flex items-center gap-4 p-4 border border-gray-200 rounded-lg',
            variant === 'compact' && 'p-3'
          )}
        >
          <Skeleton className={cn(
            'rounded-full flex-shrink-0',
            variant === 'compact' ? 'h-8 w-8' : 'h-12 w-12'
          )} />
          <div className="flex-1 space-y-2">
            <Skeleton className={cn(
              'w-3/4',
              variant === 'compact' ? 'h-3' : 'h-4'
            )} />
            <Skeleton className={cn(
              'w-1/2',
              variant === 'compact' ? 'h-2' : 'h-3'
            )} />
          </div>
          <Skeleton className={cn(
            variant === 'compact' ? 'h-6 w-16' : 'h-8 w-20'
          )} />
        </div>
      ))}
    </div>
  )
}