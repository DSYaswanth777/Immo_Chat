'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, MapPin, Building2, Euro, Users, Calendar } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

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
  ownerId: string
  createdAt: string
  updatedAt: string
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

export default function ViewPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  const userRole = (session?.user as any)?.role || 'CUSTOMER'
  const currentUserId = (session?.user as any)?.id
  const isAdmin = userRole === 'ADMIN'

  // Unwrap params
  const { id } = use(params)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setProperty(data)
      } catch (error) {
        console.error('Error fetching property:', error)
        toast.error('Errore nel caricamento della proprietà')
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchProperty()
    }
  }, [id, session])

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'APARTMENT': 'Appartamento',
      'HOUSE': 'Casa',
      'VILLA': 'Villa',
      'COMMERCIAL': 'Commerciale',
      'OFFICE': 'Ufficio',
      'LAND': 'Terreno',
      'GARAGE': 'Garage',
    }
    return types[type] || type
  }

  const getStatusLabel = (status: string) => {
    const statuses: { [key: string]: string } = {
      'FOR_SALE': 'In Vendita',
      'FOR_RENT': 'In Affitto',
      'SOLD': 'Venduto',
      'RENTED': 'Affittato',
      'DRAFT': 'Bozza',
    }
    return statuses[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'FOR_SALE': 'bg-blue-100 text-blue-800',
      'FOR_RENT': 'bg-green-100 text-green-800',
      'SOLD': 'bg-gray-100 text-gray-800',
      'RENTED': 'bg-purple-100 text-purple-800',
      'DRAFT': 'bg-yellow-100 text-yellow-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const sharePropertyLocation = async () => {
    if (!property) return
    
    try {
      // Create map location URL
      const mapUrl = `/dashboard/map?lat=${property.latitude || 41.9028}&lng=${property.longitude || 12.4964}&zoom=15&propertyId=${property.id}`
      const fullUrl = `${window.location.origin}${mapUrl}`
      
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Guarda questa proprietà: ${property.title}`,
          url: fullUrl,
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(fullUrl)
        toast.success('Link della mappa copiato negli appunti!')
      }
    } catch (error) {
      console.error('Error sharing property location:', error)
      toast.error('Errore durante la condivisione')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Proprietà non trovata</h2>
          <p className="text-gray-600 mb-6">La proprietà che stai cercando non esiste.</p>
          <Link href="/dashboard/properties">
            <Button>Torna alle proprietà</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/properties">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna alle proprietà
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#203129]">{property.title}</h1>
            <p className="text-gray-600 mt-1">
              {property.address}, {property.city}, {property.state}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button onClick={sharePropertyLocation} variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Condividi Posizione
          </Button>
          
          {/* Show edit button only if user owns the property or is admin */}
          {(property.ownerId === currentUserId || isAdmin) && (
            <Link href={`/dashboard/properties/${property.id}/edit`}>
              <Button className="bg-[#10c03e] hover:bg-[#0ea835]">
                <Edit className="h-4 w-4 mr-2" />
                Modifica
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Informazioni Base
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <p className="text-sm">{getTypeLabel(property.type)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Stato</label>
                  <Badge className={getStatusColor(property.status)}>
                    {getStatusLabel(property.status)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Prezzo</label>
                  <p className="text-lg font-semibold text-[#10c03e]">
                    €{property.price.toLocaleString()}
                    {property.status === 'FOR_RENT' && (
                      <span className="text-sm text-gray-500">/mese</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Superficie</label>
                  <p className="text-sm">{property.area ? `${property.area}m²` : 'N/A'}</p>
                </div>
              </div>

              {property.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Descrizione</label>
                  <p className="text-sm text-gray-700 mt-1">{property.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Posizione
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Indirizzo</label>
                  <p className="text-sm">{property.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Città</label>
                  <p className="text-sm">{property.city}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Provincia</label>
                  <p className="text-sm">{property.state}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">CAP</label>
                  <p className="text-sm">{property.zipCode}</p>
                </div>
                {property.country && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Paese</label>
                    <p className="text-sm">{property.country}</p>
                  </div>
                )}
              </div>

              {(property.latitude && property.longitude) && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Coordinate</label>
                  <p className="text-sm text-gray-700 mt-1">
                    {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Property Features */}
          {(property.features?.length > 0 || property.amenities?.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Caratteristiche e Servizi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {property.features?.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Caratteristiche</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {property.features.map((feature, index) => (
                        <Badge key={index} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {property.amenities?.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Servizi</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {property.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Proprietario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Nome</label>
                <p className="text-sm">{property.owner.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm">{property.owner.email}</p>
              </div>
              {property.owner.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Telefono</label>
                  <p className="text-sm">{property.owner.phone}</p>
                </div>
              )}
              {property.owner.company && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Azienda</label>
                  <p className="text-sm">{property.owner.company}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Property Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Preferiti</span>
                <span className="text-sm font-medium">{property._count.favorites}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Richieste</span>
                <span className="text-sm font-medium">{property._count.inquiries}</span>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Dettagli Aggiuntivi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                {property.bedrooms && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Camere</label>
                    <p className="text-sm">{property.bedrooms}</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Bagni</label>
                    <p className="text-sm">{property.bathrooms}</p>
                  </div>
                )}
                {property.floors && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Piani</label>
                    <p className="text-sm">{property.floors}</p>
                  </div>
                )}
                {property.parking && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Posti auto</label>
                    <p className="text-sm">{property.parking}</p>
                  </div>
                )}
                {property.yearBuilt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Anno costruzione</label>
                    <p className="text-sm">{property.yearBuilt}</p>
                  </div>
                )}
                {property.lotSize && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Superficie terreno</label>
                    <p className="text-sm">{property.lotSize}m²</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Date
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Creata il</label>
                <p className="text-sm">
                  {new Date(property.createdAt).toLocaleDateString('it-IT')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Aggiornata il</label>
                <p className="text-sm">
                  {new Date(property.updatedAt).toLocaleDateString('it-IT')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
