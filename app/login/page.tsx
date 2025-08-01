"use client"

import type React from "react"
import { useState } from "react" // Import useState

import { NavigationBar } from "@/components/navigation-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store-context"
import { authService } from "@/lib/auth-service" // Import authService
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { setUser } = useStore()
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true) // State to toggle between login and signup
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Clear previous errors

    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value

    const result = await authService.login({ email, password })

    if ("user" in result) {
      setUser({
        id: String(result.user.id),
        name: `${result.user.firstName || ""} ${result.user.lastName || ""}`.trim(),
        email: result.user.email,
        role: "user", // Assuming default role
        points: result.user.loyaltyPoints,
      })
      router.push("/dashboard")
    } else {
      setError(result.error)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Clear previous errors

    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value
    const firstName = (form.elements.namedItem("firstName") as HTMLInputElement)?.value || ""
    const lastName = (form.elements.namedItem("lastName") as HTMLInputElement)?.value || ""
    const dateOfBirth = (form.elements.namedItem("dateOfBirth") as HTMLInputElement)?.value || ""

    const result = await authService.register({ email, password, firstName, lastName, dateOfBirth })

    if ("user" in result) {
      setUser({
        id: String(result.user.id),
        name: `${result.user.firstName || ""} ${result.user.lastName || ""}`.trim(),
        email: result.user.email,
        role: "user", // Assuming default role
        points: result.user.loyaltyPoints,
      })
      router.push("/dashboard")
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-100">
      <NavigationBar />
      <main className="flex items-center justify-center min-h-screen pt-20">
        <div className="absolute inset-0">
          <Image src="/placeholder-login-hero.png" alt="Zen background" fill className="object-cover opacity-20" />
        </div>
        <Card className="w-full max-w-md mx-4 relative bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="text-5xl mb-2">🐼</div>
            <CardTitle className="text-3xl font-bold">{isLogin ? "Welcome Back" : "Join the Zen Journey"}</CardTitle>
            <CardDescription>
              {isLogin ? "Sign in to continue your zen journey." : "Create an account to get started."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" name="email" type="email" placeholder="panda@example.com" required />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Sign In
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" type="text" placeholder="Zen" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" type="text" placeholder="Panda" />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" name="email" type="email" placeholder="panda@example.com" required />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" name="password" type="password" required />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Sign Up
                </Button>
              </form>
            )}
            <div className="mt-4 text-center text-sm">
              <p>
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <a href="#" onClick={() => setIsLogin(!isLogin)} className="font-medium text-green-600 hover:underline">
                  {isLogin ? "Sign up" : "Sign in"}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
