"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Edit,
  MapPin,
  Building2,
  Users,
  Heart,
  MessageSquare,
  Bed,
  Bath,
  Square,
  Car,
  Calendar as CalendarIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Property {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  listingStatus: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  lotSize?: number;
  yearBuilt?: number;
  floors?: number;
  parking?: number;
  latitude?: number;
  longitude?: number;
  features: string[];
  amenities: string[];
  images: string[];
  virtualTour?: string;
  videoUrl?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    image?: string;
  };
  _count: {
    favorites: number;
    inquiries: number;
  };
}

// Enhanced Loading Skeleton Component
function PropertySkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-9 w-32" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex space-x-3">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j}>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ViewPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session } = useSession();
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [property, setProperty] = useState<Property | null>(null);

  const userRole = (session?.user as any)?.role || "CUSTOMER";
  const currentUserId = (session?.user as any)?.id;
  const isAdmin = userRole === "ADMIN";

  useEffect(() => {
    if (!id) return;
    
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/properties/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProperty(data);
      } catch (err) {
        console.error("Failed to fetch property:", err);
        setError("Errore nel caricamento della proprietà");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

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
    const colors: { [key: string]: string } = {
      FOR_SALE: "bg-emerald-100 text-emerald-800 border-emerald-200",
      FOR_RENT: "bg-blue-100 text-blue-800 border-blue-200",
      SOLD: "bg-gray-100 text-gray-800 border-gray-200",
      RENTED: "bg-purple-100 text-purple-800 border-purple-200",
      DRAFT: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const sharePropertyLocation = async () => {
    if (!property) return;

    try {
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
        await navigator.clipboard.writeText(fullUrl);
        toast.success("Link della mappa copiato negli appunti!");
      }
    } catch (error) {
      console.error("Error sharing property location:", error);
      toast.error("Errore durante la condivisione");
    }
  };

  // Loading state
  if (loading) {
    return <PropertySkeleton />;
  }

  // Error state
  if (error || !property) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Proprietà non trovata"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error ? "Si è verificato un errore durante il caricamento." : "La proprietà che stai cercando non esiste."}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/dashboard/properties">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Torna alle proprietà
              </Button>
            </Link>
            {error && (
              <Button onClick={() => window.location.reload()}>
                Riprova
              </Button>
            )}
          </div>
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
            <div className="flex items-start space-x-4">
              <Link href="/dashboard/properties">
                <Button variant="outline" size="sm" className="shrink-0">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Indietro
                </Button>
              </Link>
              <div className="min-w-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1 shrink-0" />
                  <span className="text-sm">
                    {property.address}, {property.city}, {property.state}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(property.status)} font-medium`}>
                    {getStatusLabel(property.status)}
                  </Badge>
                  <Badge variant="outline" className="font-medium">
                    {getTypeLabel(property.type)}
                  </Badge>
                  <div className="text-2xl font-bold text-emerald-600">
                    €{property.price.toLocaleString()}
                    {property.status === "FOR_RENT" && (
                      <span className="text-sm text-gray-500 font-normal">/mese</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={sharePropertyLocation} variant="outline" className="bg-white">
                <MapPin className="h-4 w-4 mr-2" />
                Condividi Posizione
              </Button>
              {(property.ownerId === currentUserId || isAdmin) && (
                <Link href={`/dashboard/properties/${property.id}/edit`}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifica
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {property.bedrooms && (
                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                  <Bed className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Camere</div>
                </Card>
              )}
              {property.bathrooms && (
                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                  <Bath className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bagni</div>
                </Card>
              )}
              {property.area && (
                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                  <Square className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-gray-900">{property.area}</div>
                  <div className="text-sm text-gray-600">m²</div>
                </Card>
              )}
              {property.parking && (
                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                  <Car className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-gray-900">{property.parking}</div>
                  <div className="text-sm text-gray-600">Posti auto</div>
                </Card>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-emerald-600" />
                    Descrizione
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Location Details */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                  Dettagli Posizione
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Indirizzo</label>
                      <p className="text-sm font-medium text-gray-900">{property.address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Città</label>
                      <p className="text-sm font-medium text-gray-900">{property.city}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Provincia</label>
                      <p className="text-sm font-medium text-gray-900">{property.state}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">CAP</label>
                      <p className="text-sm font-medium text-gray-900">{property.zipCode}</p>
                    </div>
                  </div>
                </div>
                {property.latitude && property.longitude && (
                  <div className="pt-3 border-t">
                    <label className="text-sm font-medium text-gray-500">Coordinate GPS</label>
                    <p className="text-sm text-gray-700 font-mono">
                      {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features & Amenities */}
            {(property.features?.length > 0 || property.amenities?.length > 0) && (
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Caratteristiche e Servizi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {property.features?.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-3 block">
                        Caratteristiche
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {property.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {property.amenities?.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-3 block">
                        Servizi
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {property.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="px-3 py-1">
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

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Owner Information */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-emerald-600" />
                  Proprietario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center pb-4 border-b">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{property.owner.name}</h3>
                  {property.owner.company && (
                    <p className="text-sm text-gray-600">{property.owner.company}</p>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Email
                    </label>
                    <p className="text-sm text-gray-900">{property.owner.email}</p>
                  </div>
                  {property.owner.phone && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Telefono
                      </label>
                      <p className="text-sm text-gray-900">{property.owner.phone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>



            {/* Additional Details */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Dettagli Aggiuntivi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {property.floors && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Piani</span>
                      <span className="text-sm font-medium">{property.floors}</span>
                    </div>
                  )}
                  {property.yearBuilt && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Anno costruzione</span>
                      <span className="text-sm font-medium">{property.yearBuilt}</span>
                    </div>
                  )}
                  {property.lotSize && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Superficie terreno</span>
                      <span className="text-sm font-medium">{property.lotSize}m²</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-emerald-600" />
                  Informazioni Temporali
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Creata il</span>
                  <span className="text-sm font-medium">
                    {new Date(property.createdAt).toLocaleDateString("it-IT")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Aggiornata il</span>
                  <span className="text-sm font-medium">
                    {new Date(property.updatedAt).toLocaleDateString("it-IT")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
