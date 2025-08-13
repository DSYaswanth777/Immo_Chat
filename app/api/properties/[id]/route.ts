import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updatePropertySchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  type: z.enum(['APARTMENT', 'HOUSE', 'VILLA', 'COMMERCIAL', 'OFFICE', 'LAND', 'GARAGE']).optional(),
  status: z.enum(['FOR_SALE', 'FOR_RENT', 'SOLD', 'RENTED', 'DRAFT']).optional(),
  listingStatus: z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'EXPIRED']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  price: z.number().positive('Price must be positive').optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  area: z.number().positive().optional(),
  lotSize: z.number().positive().optional(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  floors: z.number().int().min(1).optional(),
  parking: z.number().int().min(0).optional(),
  features: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(), // Removed URL validation to be more flexible
  virtualTour: z.string().optional(), // Removed URL validation
  videoUrl: z.string().optional(), // Removed URL validation
})

// GET /api/properties/[id] - Get property by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true,
            image: true,
          }
        },
        _count: {
          select: {
            favorites: true,
            inquiries: true,
          }
        }
      }
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Parse JSON fields
    const formattedProperty = {
      ...property,
      features: property.features ? JSON.parse(property.features) : [],
      amenities: property.amenities ? JSON.parse(property.amenities) : [],
      images: property.images ? JSON.parse(property.images) : [],
    }

    return NextResponse.json(formattedProperty)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/properties/[id] - Update property
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const propertyId = params.id
    const currentUserId = (session.user as any).id
    const currentUserRole = (session.user as any).role

    // Check if property exists and user has permission
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { ownerId: true }
    })

    if (!existingProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Only property owner or admin can update
    if (existingProperty.ownerId !== currentUserId && currentUserRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updatePropertySchema.parse(body)

    // Convert arrays to JSON strings for storage
    const updateData: any = { ...validatedData }
    if (validatedData.features) {
      updateData.features = JSON.stringify(validatedData.features)
    }
    if (validatedData.amenities) {
      updateData.amenities = JSON.stringify(validatedData.amenities)
    }
    if (validatedData.images) {
      updateData.images = JSON.stringify(validatedData.images)
    }

    const property = await prisma.property.update({
      where: { id: propertyId },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true,
            image: true,
          }
        }
      }
    })

    // Parse JSON fields for response
    const formattedProperty = {
      ...property,
      features: property.features ? JSON.parse(property.features) : [],
      amenities: property.amenities ? JSON.parse(property.amenities) : [],
      images: property.images ? JSON.parse(property.images) : [],
    }

    return NextResponse.json(formattedProperty)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error updating property:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/properties/[id] - Delete property
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const propertyId = params.id
    const currentUserId = (session.user as any).id
    const currentUserRole = (session.user as any).role

    // Check if property exists and user has permission
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { ownerId: true }
    })

    if (!existingProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Only property owner or admin can delete
    if (existingProperty.ownerId !== currentUserId && currentUserRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.property.delete({
      where: { id: propertyId }
    })

    return NextResponse.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
