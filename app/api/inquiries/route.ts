import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createInquirySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  propertyId: z.string().min(1, 'Property ID is required'),
})

// GET /api/inquiries - Get inquiries (property owners and admins only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const propertyId = searchParams.get('propertyId')

    const currentUserId = (session.user as any).id
    const currentUserRole = (session.user as any).role

    const skip = (page - 1) * limit

    let where: any = {}

    if (currentUserRole === 'ADMIN') {
      // Admins can see all inquiries
      if (propertyId) {
        where.propertyId = propertyId
      }
    } else {
      // Regular users can only see inquiries for their properties
      where.property = {
        ownerId: currentUserId
      }
      if (propertyId) {
        where.propertyId = propertyId
      }
    }

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              address: true,
              city: true,
              price: true,
              type: true,
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          }
        }
      }),
      prisma.inquiry.count({ where })
    ])

    return NextResponse.json({
      inquiries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/inquiries - Create new inquiry
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    
    const body = await request.json()
    const validatedData = createInquirySchema.parse(body)

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: validatedData.propertyId }
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const inquiryData = {
      ...validatedData,
      userId: session?.user ? (session.user as any).id : null,
    }

    const inquiry = await prisma.inquiry.create({
      data: inquiryData,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            price: true,
            type: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        }
      }
    })

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error creating inquiry:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
