"use client"

import type React from "react"

import { NavigationBar } from "@/components/navigation-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store-context"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { setUser } = useStore()
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock user login
    setUser({
      id: "1",
      name: "Panda User",
      email: "user@zenpanda.com",
      role: "user",
      points: 420,
    })
    router.push("/dashboard")
  }

  return (
    <div className="relative min-h-screen bg-gray-100">
      <NavigationBar />
      <main className="flex items-center justify-center min-h-screen pt-16">
        <div className="absolute inset-0">
          <Image src="/placeholder-login-hero.png" alt="Zen background" fill className="object-cover opacity-20" />
        </div>
        <Card className="w-full max-w-md mx-4 relative bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="text-5xl mb-2">🐼</div>
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to continue your zen journey.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="panda@example.com" required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                Sign In
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <p>
                Don't have an account?{" "}
                <a href="#" className="font-medium text-green-600 hover:underline">
                  Sign up
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
