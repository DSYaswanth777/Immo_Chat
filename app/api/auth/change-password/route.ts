import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = changePasswordSchema.parse(body)

    const userEmail = (session.user as any).email
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, email: true, password: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.password) {
      return NextResponse.json({ error: 'User has no password set' }, { status: 400 })
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 12)

    // Update password in database
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    })

    console.log(`Password changed successfully for: ${user.email}`)

    return NextResponse.json({ 
      message: 'Password changed successfully' 
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 })
    }
    
    console.error('Change password error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
