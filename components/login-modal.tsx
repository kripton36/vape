"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type LoginModalProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSuccess?: () => void
}

export function LoginModal({ isOpen, onOpenChange, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!email || !password) {
      setError("Please fill in all required fields")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (isRegisterMode && (!firstName || !lastName)) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login'
      const requestBody = isRegisterMode 
        ? { email, password, firstName, lastName }
        : { email, password }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed')
      }

      // Success - close modal and call success callback
      onOpenChange(false)
      onSuccess?.()
      
      // Reset form
      setEmail("")
      setPassword("")
      setFirstName("")
      setLastName("")
      setError("")
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode)
    setError("")
    setFirstName("")
    setLastName("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl" aria-describedby="login-description">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="text-3xl" role="img" aria-label="Panda emoji">🐼</div>
            {isRegisterMode ? "Join the Panda Family!" : "Welcome Back, Panda!"}
          </DialogTitle>
          <DialogDescription id="login-description">
            {isRegisterMode 
              ? "Create your account to start your zen journey." 
              : "Sign in to continue your zen journey."
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isRegisterMode && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                  id="firstName" 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John" 
                  className="rounded-full"
                  required
                  disabled={isLoading}
                  aria-describedby={error ? "error-message" : undefined}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                  id="lastName" 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe" 
                  className="rounded-full"
                  required
                  disabled={isLoading}
                  aria-describedby={error ? "error-message" : undefined}
                />
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="panda@bamboo.com" 
              className="rounded-full"
              required
              disabled={isLoading}
              aria-describedby={error ? "error-message" : undefined}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-full pr-10"
                required
                minLength={8}
                disabled={isLoading}
                aria-describedby={error ? "error-message" : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isRegisterMode ? "Creating Account..." : "Signing In..."}
              </>
            ) : (
              isRegisterMode ? "Create Account" : "Sign In"
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500">
          {isRegisterMode ? "Already part of the family? " : "Not part of the family? "}
          <button 
            type="button"
            onClick={toggleMode}
            className="font-medium text-green-600 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
            disabled={isLoading}
          >
            {isRegisterMode ? "Sign in" : "Sign up"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
