"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Share2,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Calendar,
  Euro,
  Heart,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PropertyCard } from "@/components/dashboard/property-card";

// Debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface Property {
  id: string;
  title: string;
  type: string;
  status: string;
  address: string;
  city: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  createdAt: string;
  updatedAt: string;
  _count: {
    favorites: number;
    inquiries: number;
  };
  latitude?: number;
  longitude?: number;
}

export default function PropertiesPage() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(
    null
  );

  const userRole = (session?.user as any)?.role || "CUSTOMER";
  const isAdmin = userRole === "ADMIN";

  // Function to share property location
  const sharePropertyLocation = async (property: Property) => {
    try {
      // Create map location URL
      const mapUrl = `/dashboard/map?lat=${property.latitude || 41.9028}&lng=${
        property.longitude || 12.4964
      }&zoom=15&propertyId=${property.id}`;
      const fullUrl = `${window.location.origin}${mapUrl}`;

      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Guarda questa proprietà: ${property.title}`,
          url: fullUrl,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(fullUrl);
        toast.success("Link della mappa copiato negli appunti!");
      }
    } catch (error: any) {
      // Don't show error if user simply cancelled the share dialog
      if (error.name === 'AbortError' || error.message === 'Share canceled') {
        return; // User cancelled, no need to show error
      }
      console.error("Error sharing property location:", error);
      toast.error("Errore durante la condivisione");
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      setSearchTerm(searchValue);
    }, 300),
    []
  );

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/properties");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProperties(data.properties || []);
        setFilteredProperties(data.properties || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Errore nel caricamento delle proprietà");
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(
        (property) => property.status === statusFilter
      );
    }

    if (typeFilter && typeFilter !== "all") {
      filtered = filtered.filter((property) => property.type === typeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'date':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredProperties(filtered);
  }, [properties, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      APARTMENT: "Appartamento",
      HOUSE: "Casa",
      VILLA: "Villa",
      COMMERCIAL: "Commerciale",
      OFFICE: "Ufficio",
      LAND: "Terreno",
      GARAGE: "Garage",
    };
    return types[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const statuses: { [key: string]: string } = {
      FOR_SALE: "In Vendita",
      FOR_RENT: "In Affitto",
      SOLD: "Venduto",
      RENTED: "Affittato",
      DRAFT: "Bozza",
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FOR_SALE":
        return "bg-green-100 text-green-800";
      case "FOR_RENT":
        return "bg-blue-100 text-blue-800";
      case "SOLD":
        return "bg-gray-100 text-gray-800";
      case "RENTED":
        return "bg-purple-100 text-purple-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDeleteProperty = async (property: Property) => {
    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setProperties((prev) => prev.filter((p) => p.id !== property.id));
      setFilteredProperties((prev) => prev.filter((p) => p.id !== property.id));
      toast.success("Proprietà eliminata con successo");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Errore nell'eliminazione della proprietà");
    } finally {
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isAdmin ? "Gestione Proprietà" : "Proprietà"}
              </h1>
              <p className="text-gray-600">
                {isAdmin
                  ? "Gestisci tutte le proprietà della piattaforma"
                  : "Visualizza le proprietà disponibili"}
              </p>
              <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1" />
                  <span className="font-medium">{filteredProperties.length}</span>
                  <span className="ml-1">proprietà trovate</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Aggiornato oggi</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
              
              <Link href="/dashboard/map">
                <Button variant="outline" className="bg-white">
                  <MapPin className="h-4 w-4 mr-2" />
                  Visualizza Mappa
                </Button>
              </Link>
              
              {isAdmin && (
                <Link href="/dashboard/properties/new">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi Proprietà
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

      {/* Enhanced Filters */}
      <Card className="shadow-sm border-0 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <Filter className="h-5 w-5 mr-2 text-emerald-600" />
              Filtri e Ricerca
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Ordina per:</span>
              <Select value={sortBy} onValueChange={(value: 'date' | 'price' | 'title') => setSortBy(value)}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="price">Prezzo</SelectItem>
                  <SelectItem value="title">Nome</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="h-8 w-8 p-0"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Cerca per nome, città o indirizzo..."
                value={searchTerm}
                onChange={(e) => debouncedSearch(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
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
              <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
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
            <div className="flex items-center justify-center bg-emerald-50 rounded-lg p-3 border border-emerald-200">
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-700">{filteredProperties.length}</div>
                <div className="text-xs text-emerald-600">Proprietà</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Display - Conditional Rendering based on viewMode */}
      {viewMode === 'table' ? (
        /* Table View */
        <Card className="shadow-sm border-0 bg-white overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700 py-4">Proprietà</TableHead>
                    <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
                    <TableHead className="font-semibold text-gray-700">Stato</TableHead>
                    <TableHead className="font-semibold text-gray-700">Prezzo</TableHead>
                    <TableHead className="font-semibold text-gray-700">Dettagli</TableHead>
                    <TableHead className="font-semibold text-gray-700">Statistiche</TableHead>
                    <TableHead className="font-semibold text-gray-700">Data</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Azioni</TableHead>
                    {isAdmin && <TableHead className="font-semibold text-gray-700 w-[50px]"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property, index) => (
                    <TableRow 
                      key={property.id} 
                      className={`hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      }`}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-gray-900 truncate">{property.title}</div>
                            <div className="text-sm text-gray-600 flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                              <span className="truncate">{property.address}, {property.city}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-white border-gray-300 text-gray-700 font-medium">
                          {getTypeLabel(property.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(property.status)} font-medium border`}>
                          {getStatusLabel(property.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Euro className="h-4 w-4 text-emerald-600 mr-1" />
                          <div>
                            <div className="font-bold text-emerald-600 text-lg">
                              {property.price.toLocaleString()}
                            </div>
                            {property.status === "FOR_RENT" && (
                              <div className="text-xs text-gray-500">/mese</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {property.bedrooms && (
                            <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md text-xs">
                              <span className="font-medium text-blue-700">{property.bedrooms} cam</span>
                            </div>
                          )}
                          {property.bathrooms && (
                            <div className="flex items-center bg-purple-50 px-2 py-1 rounded-md text-xs">
                              <span className="font-medium text-purple-700">{property.bathrooms} bagni</span>
                            </div>
                          )}
                          {property.area && (
                            <div className="flex items-center bg-green-50 px-2 py-1 rounded-md text-xs">
                              <span className="font-medium text-green-700">{property.area}m²</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center bg-red-50 px-2 py-1 rounded-md">
                            <Heart className="h-3 w-3 text-red-500 mr-1" />
                            <span className="text-xs font-medium text-red-700">{property._count?.favorites || 0}</span>
                          </div>
                          <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md">
                            <MessageSquare className="h-3 w-3 text-blue-500 mr-1" />
                            <span className="text-xs font-medium text-blue-700">{property._count?.inquiries || 0}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                          {new Date(property.createdAt).toLocaleDateString("it-IT")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => sharePropertyLocation(property)}
                            className="h-8 w-8 p-0 hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
                            title="Condividi posizione mappa"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                            title="Visualizza proprietà"
                          >
                            <Link href={`/dashboard/properties/${property.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/properties/${property.id}`} className="flex items-center">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Visualizza
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/dashboard/properties/${property.id}/edit`}
                                  className="flex items-center"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifica
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setPropertyToDelete(property);
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Elimina
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Empty State for Table View */}
            {filteredProperties.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessuna proprietà trovata</h3>
                <p className="text-gray-600 mb-6">
                  Non ci sono proprietà che corrispondono ai tuoi criteri di ricerca.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setTypeFilter("");
                  }}
                >
                  Cancella filtri
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Grid View */
        <div className="space-y-6">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              {filteredProperties.map((property) => {
                // Transform property data to match PropertyCard interface
                const transformedProperty = {
                  ...property,
                  listingStatus: property.status,
                  state: "",
                  zipCode: "",
                  country: "Italy",
                  description: "",
                  lotSize: 0,
                  yearBuilt: 0,
                  floors: 0,
                  parking: 0,
                  features: [],
                  amenities: [],
                  images: [],
                  virtualTour: "",
                  videoUrl: "",
                  publishedAt: property.createdAt,
                  owner: {
                    id: "1",
                    name: "Owner",
                    email: "owner@example.com",
                    phone: "+39 123 456 7890",
                    company: "Real Estate Agency",
                    image: ""
                  },
                  _count: property._count || { favorites: 0, inquiries: 0 }
                };

                return (
                  <div key={property.id} onClick={() => window.location.href = `/dashboard/properties/${property.id}`}>
                    <PropertyCard 
                      property={transformedProperty}
                      onClick={() => window.location.href = `/dashboard/properties/${property.id}`}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State for Grid View */
            <Card className="shadow-sm border-0 bg-white">
              <CardContent className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessuna proprietà trovata</h3>
                <p className="text-gray-600 mb-6">
                  Non ci sono proprietà che corrispondono ai tuoi criteri di ricerca.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setTypeFilter("");
                  }}
                >
                  Cancella filtri
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma Eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare la proprietà "
              {propertyToDelete?.title}"? Questa azione non può essere
              annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                propertyToDelete && handleDeleteProperty(propertyToDelete)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>
  );
}
