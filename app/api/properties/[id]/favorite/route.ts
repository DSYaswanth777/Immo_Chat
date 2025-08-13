import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

// POST /api/properties/[id]/favorite - Add property to favorites
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const propertyId = params.id
    const userId = (session.user as any).id

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId
        }
      }
    })

    if (existingFavorite) {
      return NextResponse.json({ error: 'Property already in favorites' }, { status: 400 })
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        propertyId
      }
    })

    return NextResponse.json({ message: 'Property added to favorites', favorite }, { status: 201 })
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/properties/[id]/favorite - Remove property from favorites
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
    const userId = (session.user as any).id

    // Check if favorite exists
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId
        }
      }
    })

    if (!existingFavorite) {
      return NextResponse.json({ error: 'Property not in favorites' }, { status: 404 })
    }

    await prisma.favorite.delete({
      where: {
        userId_propertyId: {
          userId,
          propertyId
        }
      }
    })

    return NextResponse.json({ message: 'Property removed from favorites' })
  } catch (error) {
    console.error('Error removing from favorites:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
