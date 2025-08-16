import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createPropertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['APARTMENT', 'HOUSE', 'VILLA', 'COMMERCIAL', 'OFFICE', 'LAND', 'GARAGE']),
  status: z.enum(['FOR_SALE', 'FOR_RENT', 'SOLD', 'RENTED', 'DRAFT']).optional(),
  listingStatus: z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'EXPIRED']).optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  price: z.number().positive('Price must be positive'),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  area: z.number().positive().optional(),
  lotSize: z.number().positive().optional(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  floors: z.number().int().min(1).optional(),
  parking: z.number().int().min(0).optional(),
  features: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  virtualTour: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
})

// GET /api/properties - Get all properties
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') as any
    const status = searchParams.get('status') as any
    const city = searchParams.get('city') || ''
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
    const bedrooms = searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined
    const bathrooms = searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!) : undefined

    const skip = (page - 1) * limit

    const where = {
      listingStatus: 'ACTIVE',
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { address: { contains: search, mode: 'insensitive' as const } },
          { city: { contains: search, mode: 'insensitive' as const } },
        ]
      }),
      ...(type && { type }),
      ...(status && { status }),
      ...(city && { city: { contains: city, mode: 'insensitive' as const } }),
      ...(minPrice && { price: { gte: minPrice } }),
      ...(maxPrice && { price: { lte: maxPrice } }),
      ...(bedrooms && { bedrooms: { gte: bedrooms } }),
      ...(bathrooms && { bathrooms: { gte: bathrooms } }),
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      }),
      prisma.property.count({ where })
    ])
    

    // Parse JSON fields
    const formattedProperties = properties.map((property: any) => ({
      ...property,
      features: property.features ? JSON.parse(property.features) : [],
      amenities: property.amenities ? JSON.parse(property.amenities) : [],
      images: property.images ? JSON.parse(property.images) : [],
    }))

    return NextResponse.json({
      properties: formattedProperties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/properties - Create new property
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createPropertySchema.parse(body)

    // Convert arrays to JSON strings for storage
    const propertyData = {
      ...validatedData,
      features: validatedData.features ? JSON.stringify(validatedData.features) : null,
      amenities: validatedData.amenities ? JSON.stringify(validatedData.amenities) : null,
      images: validatedData.images ? JSON.stringify(validatedData.images) : null,
      ownerId: (session.user as any).id,
      country: validatedData.country || 'Italy',
      status: validatedData.status || 'DRAFT',
      listingStatus: validatedData.listingStatus || 'ACTIVE',
    }

    const property = await prisma.property.create({
      data: propertyData,
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

    return NextResponse.json(formattedProperty, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error creating property:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
