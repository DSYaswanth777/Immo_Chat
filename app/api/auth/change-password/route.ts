import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

// Validation schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "La password attuale è obbligatoria"),
  newPassword: z
    .string()
    .min(8, "La nuova password deve contenere almeno 8 caratteri")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "La password deve contenere almeno una lettera minuscola, una maiuscola e un numero"),
  confirmNewPassword: z.string(),
  userEmail: z.string().email("Email non valida"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Le password non corrispondono",
  path: ["confirmNewPassword"],
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = changePasswordSchema.parse(body)
    
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: validatedData.userEmail }
    })
    
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Utente non trovato" },
        { status: 404 }
      )
    }

    // Check current password
    const isCurrentPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Password attuale non corretta" },
        { status: 401 }
      )
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 12)
    
    // Update password in database
    await prisma.user.update({
      where: { email: validatedData.userEmail },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json({
      success: true,
      message: "Password cambiata con successo!",
    })
  } catch (error: any) {
    console.error("Change password error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || "Errore durante il cambio password" },
      { status: 500 }
    )
  }
}
