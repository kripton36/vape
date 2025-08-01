"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"
import { useStore } from "@/lib/store-context"

type LoginModalProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSwitchToRegister?: () => void
}

export function LoginModal({ isOpen, onOpenChange, onSwitchToRegister }: LoginModalProps) {
  const { setUser } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields")
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error("Please enter a valid email address")
      }

      // Call login API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Store user data and token
      setUser(data.user)
      localStorage.setItem("auth_token", data.token)
      
      // Close modal and reset form
      onOpenChange(false)
      setFormData({ email: "", password: "" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl" aria-describedby="login-description">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="text-3xl" role="img" aria-label="Panda emoji">🐼</div>
            Welcome Back, Panda!
          </DialogTitle>
          <DialogDescription id="login-description">
            Sign in to continue your zen journey and access your account.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email"
              name="email"
              type="email" 
              placeholder="Enter your email"
              className="rounded-full"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="rounded-full pr-10"
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Not part of the family?{" "}
          <button 
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium text-green-600 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Sign up
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
