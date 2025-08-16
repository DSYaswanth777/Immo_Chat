'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Phone,
  Mail,
  Heart,
  MessageSquare,
  Euro,
  Calendar,
  Building2,
} from 'lucide-react'
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
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'FOR_RENT':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'SOLD':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'RENTED':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card 
      className={cn(
        "mx-2 mb-3 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 bg-white overflow-hidden group",
        isSelected 
          ? "shadow-lg ring-2 ring-emerald-500 ring-opacity-50 bg-gradient-to-br from-emerald-50 to-white" 
          : "shadow-sm hover:shadow-xl"
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Header with gradient */}
        <div className={cn(
          "h-2 w-full transition-all duration-300",
          isSelected 
            ? "bg-gradient-to-r from-emerald-500 to-emerald-600" 
            : "bg-gradient-to-r from-gray-200 to-gray-300 group-hover:from-emerald-400 group-hover:to-emerald-500"
        )} />
        
        <div className="p-4">
          {/* Title and Status */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-base text-gray-900 line-clamp-2 pr-2 leading-tight group-hover:text-emerald-700 transition-colors">
              {property.title}
            </h3>
            <Badge className={cn("text-xs px-2 py-1 font-medium shrink-0", getStatusColor(property.status))}>
              {getStatusLabel(property.status)}
            </Badge>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-emerald-500" />
            <span className="truncate font-medium">{property.address}, {property.city}</span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-baseline">
              <Euro className="h-4 w-4 text-emerald-600 mr-1" />
              <span className="text-2xl font-bold text-emerald-600">
                {property.price.toLocaleString()}
              </span>
              {property.status === 'FOR_RENT' && (
                <span className="text-sm text-gray-500 ml-1 font-medium">/mese</span>
              )}
            </div>
          </div>

          {/* Property Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {property.bedrooms && (
                <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                  <Bed className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                  <Bath className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
              )}
              {property.area && (
                <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                  <Square className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="font-medium">{property.area}m²</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-xs font-medium bg-white">
                <Building2 className="h-3 w-3 mr-1" />
                {getTypeLabel(property.type)}
              </Badge>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(property.createdAt).toLocaleDateString('it-IT')}
              </div>
            </div>
            
            {/* Stats and Actions */}
            <div className="flex items-center space-x-2">
              {property._count && (
                <>
                  <div className="flex items-center text-xs text-gray-500 bg-red-50 px-2 py-1 rounded-md">
                    <Heart className="h-3 w-3 mr-1 text-red-500" />
                    <span className="font-medium">{property._count.favorites || 0}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-md">
                    <MessageSquare className="h-3 w-3 mr-1 text-blue-500" />
                    <span className="font-medium">{property._count.inquiries || 0}</span>
                  </div>
                </>
              )}
              
              <div className="flex space-x-1">
                {property.owner.phone && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`tel:${property.owner.phone}`);
                    }}
                  >
                    <Phone className="h-3 w-3" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`mailto:${property.owner.email}`);
                  }}
                >
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