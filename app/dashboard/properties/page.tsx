'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Building2,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Property {
  id: string
  title: string
  type: string
  status: string
  address: string
  city: string
  price: number
  bedrooms?: number
  bathrooms?: number
  area?: number
  createdAt: string
  updatedAt: string
  _count: {
    favorites: number
    inquiries: number
  }
}

export default function PropertiesPage() {
  const { data: session } = useSession()
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null)

  const userRole = (session?.user as any)?.role || 'CUSTOMER'
  const isAdmin = userRole === 'ADMIN'

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
        toast.error('Errore nel caricamento delle proprietà')
        setProperties([])
        setFilteredProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  useEffect(() => {
    let filtered = properties

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter)
    }

    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter(property => property.type === typeFilter)
    }

    setFilteredProperties(filtered)
  }, [properties, searchTerm, statusFilter, typeFilter])

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
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDeleteProperty = async (property: Property) => {
    try {
      const response = await fetch(`/api/properties/${property.id}`, { 
        method: 'DELETE' 
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      setProperties(prev => prev.filter(p => p.id !== property.id))
      setFilteredProperties(prev => prev.filter(p => p.id !== property.id))
      toast.success('Proprietà eliminata con successo')
    } catch (error) {
      console.error('Error deleting property:', error)
      toast.error('Errore nell\'eliminazione della proprietà')
    } finally {
      setDeleteDialogOpen(false)
      setPropertyToDelete(null)
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#203129]">
            {isAdmin ? 'Gestione Proprietà' : 'Le Mie Proprietà'}
          </h1>
          <p className="text-gray-600 mt-1">
            Gestisci e monitora le tue proprietà immobiliari
          </p>
        </div>
        <div className="flex space-x-3">
          <Link href="/dashboard/map">
            <Button variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Visualizza Mappa
            </Button>
          </Link>
          <Link href="/dashboard/properties/new">
            <Button className="bg-[#10c03e] hover:bg-[#0ea835]">
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Proprietà
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtri e Ricerca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                <SelectItem value="FOR_SALE">In Vendita</SelectItem>
                <SelectItem value="FOR_RENT">In Affitto</SelectItem>
                <SelectItem value="SOLD">Venduto</SelectItem>
                <SelectItem value="RENTED">Affittato</SelectItem>
                <SelectItem value="DRAFT">Bozza</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i tipi</SelectItem>
                <SelectItem value="APARTMENT">Appartamento</SelectItem>
                <SelectItem value="HOUSE">Casa</SelectItem>
                <SelectItem value="VILLA">Villa</SelectItem>
                <SelectItem value="COMMERCIAL">Commerciale</SelectItem>
                <SelectItem value="OFFICE">Ufficio</SelectItem>
                <SelectItem value="LAND">Terreno</SelectItem>
                <SelectItem value="GARAGE">Garage</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center text-sm text-gray-600">
              <Building2 className="h-4 w-4 mr-2" />
              {filteredProperties.length} proprietà trovate
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proprietà</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Prezzo</TableHead>
                <TableHead>Dettagli</TableHead>
                <TableHead>Statistiche</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{property.title}</div>
                      <div className="text-sm text-gray-600">
                        {property.address}, {property.city}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTypeLabel(property.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(property.status)}>
                      {getStatusLabel(property.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-[#10c03e]">
                      €{property.price.toLocaleString()}
                      {property.status === 'FOR_RENT' && (
                        <span className="text-xs text-gray-500">/mese</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {property.bedrooms && `${property.bedrooms} cam`}
                      {property.bedrooms && property.bathrooms && ' • '}
                      {property.bathrooms && `${property.bathrooms} bagni`}
                      {(property.bedrooms || property.bathrooms) && property.area && ' • '}
                      {property.area && `${property.area}m²`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>❤️ {property._count.favorites} preferiti</div>
                      <div>💬 {property._count.inquiries} richieste</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {new Date(property.createdAt).toLocaleDateString('it-IT')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/properties/${property.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizza
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/properties/${property.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifica
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setPropertyToDelete(property)
                            setDeleteDialogOpen(true)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Elimina
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma Eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare la proprietà "{propertyToDelete?.title}"?
              Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => propertyToDelete && handleDeleteProperty(propertyToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
