'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart,
  Eye,
  Phone,
  Mail,
  Euro,
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface Property {
  id: string
  title: string
  description?: string
  type: string
  status: string
  listingStatus: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  price: number
  bedrooms?: number
  bathrooms?: number
  area?: number
  lotSize?: number
  yearBuilt?: number
  floors?: number
  parking?: number
  latitude?: number
  longitude?: number
  features: string[]
  amenities: string[]
  images: string[]
  virtualTour?: string
  videoUrl?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  owner: {
    id: string
    name: string
    email: string
    phone?: string
    company?: string
    image?: string
  }
  _count: {
    favorites: number
    inquiries: number
  }
}

interface PropertyCardProps {
  property: Property
  isSelected?: boolean
  onClick?: () => void
}

export function PropertyCard({ property, isSelected, onClick }: PropertyCardProps) {
  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      APARTMENT: 'Appartamento',
      HOUSE: 'Casa',
      VILLA: 'Villa',
      COMMERCIAL: 'Commerciale',
      OFFICE: 'Ufficio',
      LAND: 'Terreno',
      GARAGE: 'Garage',
    }
    return types[type] || type
  }

  const getStatusLabel = (status: string) => {
    const statuses: { [key: string]: string } = {
      FOR_SALE: 'In Vendita',
      FOR_RENT: 'In Affitto',
      SOLD: 'Venduto',
      RENTED: 'Affittato',
      DRAFT: 'Bozza',
    }
    return statuses[status] || status
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FOR_SALE':
        return 'bg-green-100 text-green-800'
      case 'FOR_RENT':
        return 'bg-blue-100 text-blue-800'
      case 'SOLD':
        return 'bg-gray-100 text-gray-800'
      case 'RENTED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card 
      className={cn(
        "mx-2 mb-3 cursor-pointer transition-all duration-200 hover:shadow-md border-l-4",
        isSelected ? "border-l-[#10c03e] bg-green-50 shadow-md" : "border-l-gray-200 hover:border-l-[#10c03e]"
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex space-x-3">


          {/* Property Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 pr-2">
                {property.title}
              </h3>
              <Badge className={cn("text-xs px-2 py-0.5", getStatusColor(property.status))}>
                {getStatusLabel(property.status)}
              </Badge>
            </div>

            <div className="flex items-center text-gray-600 text-xs mb-2">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{property.city}</span>
            </div>

            <div className="text-[#10c03e] font-bold text-sm mb-2">
              €{property.price.toLocaleString()}
              {property.status === 'FOR_RENT' && '/mese'}
            </div>

            {/* Property Stats */}
            <div className="flex items-center space-x-3 text-xs text-gray-600 mb-2">
              {property.bedrooms && (
                <div className="flex items-center">
                  <Bed className="h-3 w-3 mr-1" />
                  {property.bedrooms}
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center">
                  <Bath className="h-3 w-3 mr-1" />
                  {property.bathrooms}
                </div>
              )}
              {property.area && (
                <div className="flex items-center">
                  <Square className="h-3 w-3 mr-1" />
                  {property.area}m²
                </div>
              )}
            </div>

            {/* Property Type and Actions */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {getTypeLabel(property.type)}
              </Badge>
              <div className="flex space-x-1">
                {property.owner.phone && (
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Phone className="h-3 w-3" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Mail className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
