import { NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, dateOfBirth } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const result = await registerUser({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
    })

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("[AUTH_REGISTER]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}