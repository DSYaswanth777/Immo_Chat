import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth-config";

// Validation schema
const setPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "La password deve contenere almeno 8 caratteri")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "La password deve contenere almeno una lettera minuscola, una maiuscola e un numero"),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Le password non corrispondono",
  path: ["confirmNewPassword"],
});

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authConfig);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = setPasswordSchema.parse(body);
    
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utente non trovato" },
        { status: 404 }
      );
    }

    // Check if user already has a password
    if (user.password) {
      return NextResponse.json(
        { error: "L'utente ha già una password impostata. Usa la funzione di cambio password." },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 12);
    
    // Update user with new password
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword }
    });

    return NextResponse.json({
      success: true,
      message: "Password impostata con successo! Ora puoi accedere con email e password.",
    });
  } catch (error: any) {
    console.error("Set password error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Errore durante l'impostazione della password" },
      { status: 500 }
    );
  }
}

// GET endpoint to check if user has password
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authConfig);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      );
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utente non trovato" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      hasPassword: !!user.password,
      isGoogleUser: !user.password, // If no password, likely a Google user
    });
  } catch (error: any) {
    console.error("Check password status error:", error);
    
    return NextResponse.json(
      { error: error.message || "Errore durante il controllo dello stato password" },
      { status: 500 }
    );
  }
}
