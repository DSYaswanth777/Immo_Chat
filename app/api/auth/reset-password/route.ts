import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Validation schema
const resetPasswordSchema = z.object({
  email: z.string().email("Email non valida"),
  newPassword: z.string().min(8, "La password deve essere di almeno 8 caratteri"),
  otpId: z.string().min(1, "ID OTP richiesto"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = resetPasswordSchema.parse(body);

    // Verify that the OTP was used and is valid
    const otp = await prisma.oTP.findUnique({
      where: { id: validatedData.otpId },
    });

    if (!otp || !otp.used || otp.email !== validatedData.email) {
      return NextResponse.json(
        { error: "OTP non valido o non utilizzato" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utente non trovato" },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 12);

    // Update the user's password in the database
    await prisma.user.update({
      where: { email: validatedData.email },
      data: { password: hashedPassword },
    });

    console.log(`Password reset successful for: ${validatedData.email}`);
    console.log(`New password length: ${validatedData.newPassword.length} characters`);
    console.log(`OTP ID used: ${validatedData.otpId}`);

    return NextResponse.json({
      success: true,
      message: "Password reimpostata con successo!",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: error.message || "Errore durante il reset della password",
      },
      { status: 500 }
    );
  }
}
