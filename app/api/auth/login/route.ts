import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Inserisci un indirizzo email valido"),
  password: z.string().min(1, "La password è obbligatoria"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = loginSchema.parse(body)
    
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Credenziali non valide" },
        { status: 401 }
      )
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Credenziali non valide" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Accesso effettuato con successo!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })
  } catch (error: any) {
    console.error("Login error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || "Errore durante l'accesso" },
      { status: 500 }
    )
  }
}
