'use client';
import { useEffect, useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GoogleMap } from '@/components/dashboard/google-map'
import { PropertyCard } from '@/components/dashboard/property-card'
import { useGoogleMapsUsage } from '@/lib/google-maps-usage-tracker'
import Link from 'next/link'

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

export default function MapPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    city: '',
  })

  const { getTodayUsage, getMonthlyEstimate } = useGoogleMapsUsage()

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/properties')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setProperties(data.properties || [])
        setFilteredProperties(data.properties || [])
      } catch (error) {
        console.error('Error fetching properties:', error)
        setProperties([])
        setFilteredProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const handleSearch = useCallback(() => {
    let filtered = properties

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Type filter
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(property => property.type === filters.type)
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(property => property.status === filters.status)
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(property => property.price >= parseInt(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= parseInt(filters.maxPrice))
    }

    // Bedrooms filter
    if (filters.bedrooms) {
      filtered = filtered.filter(property => 
        property.bedrooms && property.bedrooms >= parseInt(filters.bedrooms)
      )
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(property =>
        property.city.toLowerCase().includes(filters.city.toLowerCase())
      )
    }

    setFilteredProperties(filtered)
  }, [properties, searchTerm, filters])

  useEffect(() => {
    handleSearch()
  }, [handleSearch])

  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property)
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#10c03e]"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Left Sidebar - Property List */}
      <div className="w-1/3 bg-white border-r flex flex-col">
        {/* Search and Filters */}
        <div className="p-4 border-b space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Cerca proprietà..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i tipi</SelectItem>
                <SelectItem value="APARTMENT">Appartamento</SelectItem>
                <SelectItem value="HOUSE">Casa</SelectItem>
                <SelectItem value="VILLA">Villa</SelectItem>
                <SelectItem value="COMMERCIAL">Commerciale</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti</SelectItem>
                <SelectItem value="FOR_SALE">In Vendita</SelectItem>
                <SelectItem value="FOR_RENT">In Affitto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Prezzo min"
              value={filters.minPrice}
              onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Prezzo max"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            />
          </div>
        </div>

        {/* Results Count & Usage Info */}
        <div className="p-4 border-b space-y-2">
          <p className="text-sm text-gray-600">
            {filteredProperties.length} proprietà trovate
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              API Usage Today: {getTodayUsage()}
            </span>
            <Link 
              href="/dashboard/analytics/google-maps"
              className="text-[#10c03e] hover:underline"
            >
              View Analytics
            </Link>
          </div>
        </div>

        {/* Property List */}
        <div className="flex-1 overflow-y-auto">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isSelected={selectedProperty?.id === property.id}
              onClick={() => handleMarkerClick(property)}
            />
          ))}
        </div>
      </div>

      {/* Right Side - Google Map */}
      <div className="flex-1 relative">
        <GoogleMap
          properties={filteredProperties}
          selectedProperty={selectedProperty}
          onMarkerClick={handleMarkerClick}
        />
      </div>
    </div>
  )
}
