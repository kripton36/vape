"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    
    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo)
    }

    // In production, you would send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="flex justify-center">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600">
                We're sorry, but an unexpected error occurred. Our team has been notified.
              </p>
            </div>

            <Alert className="text-left border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Error Details</AlertTitle>
              <AlertDescription className="text-red-700">
                {this.state.error?.message || 'An unknown error occurred'}
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={this.handleRetry}
                variant="default"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              
              <Button 
                onClick={this.handleGoHome}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
                <summary className="cursor-pointer font-medium text-gray-800 mb-2">
                  Stack Trace (Development Only)
                </summary>
                <pre className="text-xs text-gray-600 overflow-auto max-h-48">
                  {this.state.error?.stack}
                  {'\n\nComponent Stack:'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for easy wrapping
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  const WrappedComponent = (props: T) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Hook for functional components to trigger error boundary
export function useErrorHandler() {
  return (error: Error) => {
    throw error
  }
}

// Async error boundary for handling promise rejections
export class AsyncErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  componentDidMount() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection)
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection)
  }

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    this.setState({
      hasError: true,
      error: new Error(event.reason || 'Unhandled promise rejection')
    })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium">An error occurred</h3>
          <p className="text-red-600 text-sm mt-1">
            {this.state.error?.message || 'Something went wrong'}
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary