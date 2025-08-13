'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Plus, X, MapPin, Map } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { LocationPickerMap } from '@/components/dashboard/location-picker-map'

export default function NewPropertyPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState('')
  const [useMapLocation, setUseMapLocation] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
    address?: string
  } | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'APARTMENT',
    status: 'DRAFT',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    yearBuilt: '',
    floors: '',
    parking: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })
    
    // Reverse geocoding to get address
    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder()
      const latlng = { lat, lng }
      
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const address = results[0].formatted_address
          setSelectedLocation({ lat, lng, address })
          
          // Parse address components
          const components = results[0].address_components
          let street = ''
          let city = ''
          let state = ''
          let zipCode = ''
          
          components.forEach(component => {
            const types = component.types
            if (types.includes('street_number') || types.includes('route')) {
              street += component.long_name + ' '
            } else if (types.includes('locality')) {
              city = component.long_name
            } else if (types.includes('administrative_area_level_1')) {
              state = component.long_name
            } else if (types.includes('postal_code')) {
              zipCode = component.long_name
            }
          })
          
          // Update form data with geocoded information
          setFormData(prev => ({
            ...prev,
            address: street.trim(),
            city: city,
            state: state,
            zipCode: zipCode
          }))
          
          toast.success('Posizione selezionata dalla mappa!')
        }
      })
    }
  }, [])

  const toggleLocationMethod = () => {
    setUseMapLocation(!useMapLocation)
    if (!useMapLocation) {
      // Clear manual address when switching to map
      setFormData(prev => ({
        ...prev,
        address: '',
        city: '',
        state: '',
        zipCode: ''
      }))
      setSelectedLocation(null)
    }
  }

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures(prev => [...prev, newFeature.trim()])
      setNewFeature('')
    }
  }

  const removeFeature = (feature: string) => {
    setFeatures(prev => prev.filter(f => f !== feature))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.type || !formData.address || !formData.city || !formData.price) {
        toast.error('Compila tutti i campi obbligatori')
        return
      }

      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
        area: formData.area ? parseFloat(formData.area) : undefined,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
        floors: formData.floors ? parseInt(formData.floors) : undefined,
        parking: formData.parking ? parseInt(formData.parking) : undefined,
        features,
        // Include location data if selected from map
        ...(selectedLocation && {
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
        }),
      }

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const createdProperty = await response.json()
      toast.success('Proprietà creata con successo!')
      router.push('/dashboard/properties')
    } catch (error) {
      console.error('Error creating property:', error)
      toast.error('Errore nella creazione della proprietà')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/properties">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna alle Proprietà
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#203129]">
              Aggiungi Nuova Proprietà
            </h1>
            <p className="text-gray-600 mt-1">
              Inserisci i dettagli della tua proprietà immobiliare
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informazioni di Base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titolo *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="es. Appartamento Moderno Milano Centro"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo Proprietà *</Label>
                <Select value={formData.type || 'APARTMENT'} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APARTMENT">Appartamento</SelectItem>
                    <SelectItem value="HOUSE">Casa</SelectItem>
                    <SelectItem value="VILLA">Villa</SelectItem>
                    <SelectItem value="COMMERCIAL">Commerciale</SelectItem>
                    <SelectItem value="OFFICE">Ufficio</SelectItem>
                    <SelectItem value="LAND">Terreno</SelectItem>
                    <SelectItem value="GARAGE">Garage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrizione</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descrivi la proprietà..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Stato</Label>
                <Select value={formData.status || 'DRAFT'} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona stato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Bozza</SelectItem>
                    <SelectItem value="FOR_SALE">In Vendita</SelectItem>
                    <SelectItem value="FOR_RENT">In Affitto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Prezzo (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="450000"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Posizione</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleLocationMethod}
                className="flex items-center space-x-2"
              >
                {useMapLocation ? (
                  <>
                    <MapPin className="h-4 w-4" />
                    <span>Usa Indirizzo Manuale</span>
                  </>
                ) : (
                  <>
                    <Map className="h-4 w-4" />
                    <span>Seleziona dalla Mappa</span>
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {useMapLocation ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Clicca sulla mappa per selezionare la posizione</Label>
                  <div className="h-96 w-full border rounded-lg overflow-hidden">
                    <LocationPickerMap
                      center={{ lat: 45.4642, lng: 9.1900 }} // Milan center
                      zoom={12}
                      onClick={handleMapClick}
                      markers={selectedLocation ? [selectedLocation] : []}
                      className="w-full h-full"
                    />
                  </div>
                </div>
                
                {selectedLocation && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-800">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">Posizione Selezionata:</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      {selectedLocation.address || `Lat: ${selectedLocation.lat.toFixed(6)}, Lng: ${selectedLocation.lng.toFixed(6)}`}
                    </p>
                  </div>
                )}
                
                {/* Show form fields populated from map selection */}
                {selectedLocation && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="address">Indirizzo (dalla mappa)</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Via Roma 123"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Città</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Milano"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Regione</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="Lombardia"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">CAP</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          placeholder="20121"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Indirizzo *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Via Roma 123"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Città *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Milano"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Regione</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Lombardia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CAP</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="20121"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Dettagli Proprietà</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Camere da Letto</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  placeholder="3"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bagni</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  placeholder="2"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Superficie (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  placeholder="120"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearBuilt">Anno Costruzione</Label>
                <Input
                  id="yearBuilt"
                  type="number"
                  value={formData.yearBuilt}
                  onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                  placeholder="2010"
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floors">Piani</Label>
                <Input
                  id="floors"
                  type="number"
                  value={formData.floors}
                  onChange={(e) => handleInputChange('floors', e.target.value)}
                  placeholder="2"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parking">Posti Auto</Label>
                <Input
                  id="parking"
                  type="number"
                  value={formData.parking}
                  onChange={(e) => handleInputChange('parking', e.target.value)}
                  placeholder="1"
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Caratteristiche</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Aggiungi caratteristica (es. Balcone, Ascensore...)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
            {features.map((feature) => (
              <Badge key={feature} variant="secondary" className="flex items-center space-x-1">
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(feature)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link href="/dashboard/properties">
            <Button type="button" variant="outline">
              Annulla
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="bg-[#10c03e] hover:bg-[#0ea835]">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salva Proprietà
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
