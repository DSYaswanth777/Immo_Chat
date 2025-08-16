import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Validation schema
const verifyOTPSchema = z.object({
  email: z.string().email("Email non valida"),
  otp: z.string().min(6, "OTP deve essere di 6 cifre").max(6, "OTP deve essere di 6 cifre"),
  type: z.enum(["PASSWORD_CHANGE", "PASSWORD_RESET", "EMAIL_VERIFICATION"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = verifyOTPSchema.parse(body);
    
    // Find the OTP in database
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        email: validatedData.email,
        otp: validatedData.otp,
        type: validatedData.type,
        used: false,
        expires: {
          gt: new Date(), // Not expired
        },
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Codice OTP non valido o scaduto" },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    console.log(`OTP verification successful for ${validatedData.email}: ${validatedData.otp}`);
    
    return NextResponse.json({
      success: true,
      message: "OTP verificato con successo",
      otpId: otpRecord.id, // Return OTP ID for password reset
    });
  } catch (error: any) {
    console.error("Verify OTP error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Errore durante la verifica OTP" },
      { status: 500 }
    );
  }
}
