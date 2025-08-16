import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { emailService, generateOTP, getOTPExpiry } from "@/lib/email-service";

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Email non valida"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = forgotPasswordSchema.parse(body);
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    // Always return success message for security (don't reveal if email exists)
    const successMessage = "Se l'email esiste nel sistema, riceverai un codice OTP a breve.";

    if (!user) {
      // Don't reveal that user doesn't exist
      return NextResponse.json({
        success: true,
        message: successMessage,
      });
    }
    
    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiry(10); // 10 minutes
    
    try {
      // Delete any existing OTPs for this email and type
      await prisma.oTP.deleteMany({
        where: {
          email: validatedData.email,
          type: "PASSWORD_RESET",
        },
      });

      // Store new OTP in database
      await prisma.oTP.create({
        data: {
          email: validatedData.email,
          otp: otp,
          type: "PASSWORD_RESET",
          expires: expiresAt,
          used: false,
        },
      });

      // Send OTP via email
      const emailSent = await emailService.sendOTP(validatedData.email, otp, 'password_reset');
      
      if (emailSent) {
        console.log(`OTP sent successfully to ${validatedData.email}: ${otp}`);
      } else {
        console.error(`Failed to send OTP email to ${validatedData.email}`);
        return NextResponse.json(
          { error: "Errore nell'invio dell'email. Riprova più tardi." },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Error storing OTP or sending email:", error);
      return NextResponse.json(
        { error: "Errore del server. Riprova più tardi." },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: successMessage,
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Errore durante l'invio del codice OTP" },
      { status: 500 }
    );
  }
}
