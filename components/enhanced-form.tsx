"use client"

import React, { useState, useEffect } from 'react'
import { useForm, FieldErrors, Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LoadingSpinner } from '@/components/loading-states'

// Enhanced Input with validation feedback
interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helpText?: string
  showValidation?: boolean
  isValid?: boolean
  validationIcon?: boolean
}

export function EnhancedInput({
  label,
  error,
  helpText,
  showValidation = false,
  isValid,
  validationIcon = true,
  className,
  type = 'text',
  id,
  ...props
}: EnhancedInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`
  const errorId = error ? `${inputId}-error` : undefined
  const helpId = helpText ? `${inputId}-help` : undefined
  
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
        {props.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          {...props}
          id={inputId}
          type={inputType}
          className={cn(
            'pr-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            showValidation && isValid && 'border-green-500 focus:border-green-500 focus:ring-green-500',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={cn(
            errorId && errorId,
            helpId && helpId
          ).trim() || undefined}
        />
        
        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
        
        {/* Validation icon */}
        {validationIcon && showValidation && !isPassword && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {error ? (
              <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
            ) : isValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
            ) : null}
          </div>
        )}
      </div>
      
      {/* Help text */}
      {helpText && (
        <p id={helpId} className="text-sm text-gray-600 flex items-start gap-1">
          <Info className="h-3 w-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
          {helpText}
        </p>
      )}
      
      {/* Error message */}
      {error && (
        <p id={errorId} className="text-sm text-red-600 flex items-start gap-1" role="alert">
          <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

// Enhanced Textarea with validation
interface EnhancedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  helpText?: string
  showCharCount?: boolean
  maxLength?: number
}

export function EnhancedTextarea({
  label,
  error,
  helpText,
  showCharCount = false,
  maxLength,
  className,
  id,
  value,
  ...props
}: EnhancedTextareaProps) {
  const inputId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`
  const errorId = error ? `${inputId}-error` : undefined
  const helpId = helpText ? `${inputId}-help` : undefined
  const charCount = typeof value === 'string' ? value.length : 0

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </Label>
        {showCharCount && maxLength && (
          <span className={cn(
            'text-xs',
            charCount > maxLength * 0.9 ? 'text-orange-600' : 'text-gray-500',
            charCount > maxLength ? 'text-red-600' : ''
          )}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      
      <Textarea
        {...props}
        id={inputId}
        value={value}
        maxLength={maxLength}
        className={cn(
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={cn(
          errorId && errorId,
          helpId && helpId
        ).trim() || undefined}
      />
      
      {/* Help text */}
      {helpText && (
        <p id={helpId} className="text-sm text-gray-600 flex items-start gap-1">
          <Info className="h-3 w-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
          {helpText}
        </p>
      )}
      
      {/* Error message */}
      {error && (
        <p id={errorId} className="text-sm text-red-600 flex items-start gap-1" role="alert">
          <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

// Password strength indicator
interface PasswordStrengthProps {
  password: string
  requirements?: Array<{
    regex: RegExp
    text: string
  }>
}

export function PasswordStrength({ password, requirements }: PasswordStrengthProps) {
  const defaultRequirements = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /[A-Z]/, text: 'One uppercase letter' },
    { regex: /[a-z]/, text: 'One lowercase letter' },
    { regex: /\d/, text: 'One number' },
    { regex: /[^A-Za-z0-9]/, text: 'One special character' }
  ]
  
  const checks = requirements || defaultRequirements
  const passedChecks = checks.filter(check => check.regex.test(password))
  const strength = password.length === 0 ? 0 : (passedChecks.length / checks.length) * 100

  const getStrengthColor = () => {
    if (strength < 25) return 'bg-red-500'
    if (strength < 50) return 'bg-orange-500'
    if (strength < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (strength < 25) return 'Weak'
    if (strength < 50) return 'Fair'
    if (strength < 75) return 'Good'
    return 'Strong'
  }

  if (password.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Password strength</span>
          <span className={cn(
            'font-medium',
            strength < 25 && 'text-red-600',
            strength >= 25 && strength < 50 && 'text-orange-600',
            strength >= 50 && strength < 75 && 'text-yellow-600',
            strength >= 75 && 'text-green-600'
          )}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={cn('h-2 rounded-full transition-all duration-300', getStrengthColor())}
            style={{ width: `${strength}%` }}
            role="progressbar"
            aria-valuenow={strength}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Password strength: ${getStrengthText()}`}
          />
        </div>
      </div>
      
      <ul className="space-y-1" role="list" aria-label="Password requirements">
        {checks.map((check, index) => {
          const isPassed = check.regex.test(password)
          return (
            <li key={index} className="flex items-center gap-2 text-sm">
              {isPassed ? (
                <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" aria-hidden="true" />
              ) : (
                <XCircle className="h-3 w-3 text-gray-400 flex-shrink-0" aria-hidden="true" />
              )}
              <span className={cn(
                isPassed ? 'text-green-700' : 'text-gray-600'
              )}>
                {check.text}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// Enhanced submit button with loading state
interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean
  loadingText?: string
  children: React.ReactNode
}

export function SubmitButton({ 
  loading, 
  loadingText = 'Submitting...', 
  children, 
  className,
  ...props 
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className={cn(
        'w-full flex items-center justify-center gap-2',
        className
      )}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {loading ? loadingText : children}
    </Button>
  )
}

// Form validation messages component
interface ValidationSummaryProps {
  errors: FieldErrors
  title?: string
}

export function ValidationSummary({ errors, title = 'Please correct the following errors:' }: ValidationSummaryProps) {
  const errorEntries = Object.entries(errors)
  
  if (errorEntries.length === 0) return null

  return (
    <div 
      className="bg-red-50 border border-red-200 rounded-lg p-4"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-2">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <ul className="text-sm text-red-700 space-y-1 ml-2">
            {errorEntries.map(([field, error]) => (
              <li key={field}>
                • {error?.message || `${field} is invalid`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// Success message component
interface SuccessMessageProps {
  message: string
  show: boolean
}

export function SuccessMessage({ message, show }: SuccessMessageProps) {
  if (!show) return null

  return (
    <div 
      className="bg-green-50 border border-green-200 rounded-lg p-4"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" aria-hidden="true" />
        <p className="text-sm font-medium text-green-800">{message}</p>
      </div>
    </div>
  )
}

// Real-time validation hook
export function useRealTimeValidation<T extends z.ZodTypeAny>(schema: T) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const validateField = (name: string, value: any) => {
    try {
      // Create a partial schema for single field validation
      const fieldSchema = z.object({ [name]: schema.shape[name] })
      fieldSchema.parse({ [name]: value })
      
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
      
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors[0]?.message
        setErrors(prev => ({
          ...prev,
          [name]: fieldError || 'Invalid value'
        }))
      }
      return false
    }
  }
  
  const clearErrors = () => setErrors({})
  
  return { errors, validateField, clearErrors }
}