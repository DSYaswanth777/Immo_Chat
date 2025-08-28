"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GoogleMap from "@/components/dashboard/google-map";
import { PropertyCard } from "@/components/dashboard/property-card";
import { useGoogleMapsUsage } from "@/lib/google-maps-usage-tracker";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
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

export default function MapPage() {
  const { data: session, status } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    city: "",
  });

  const { getTodayUsage, getMonthlyEstimate } = useGoogleMapsUsage();

  // Only access user role when session is loaded
  const userRole =
    status === "loading"
      ? "CUSTOMER"
      : (session?.user as any)?.role || "CUSTOMER";
  const isAdmin = userRole === "ADMIN";

  // Debug session state
  console.log("MapPage Session Debug:", { status, session, userRole, isAdmin });

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

    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((property) => property.type === filters.type);
    }

    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter(
        (property) => property.status === filters.status
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(
        (property) => property.price >= parseInt(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (property) => property.price <= parseInt(filters.maxPrice)
      );
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(
        (property) =>
          property.bedrooms && property.bedrooms >= parseInt(filters.bedrooms)
      );
    }

    if (filters.city) {
      filtered = filtered.filter((property) =>
        property.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
  }, [properties, filters]);

  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-200 rounded-full animate-spin animation-delay-150 mx-auto"></div>
          </div>
          <p className="text-slate-600 font-medium">Caricamento proprietà...</p>
        </div>
      </div>
    );
  }

  // Show loading while session is being fetched
  if (status === "loading") {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-200 rounded-full animate-spin animation-delay-150 mx-auto"></div>
          </div>
          <p className="text-slate-600 font-medium">Inizializzazione...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Left Sidebar - Property List */}
      <div className="w-1/3 bg-white/90 backdrop-blur-md border-r border-slate-200 flex flex-col shadow-xl">
        {/* Enhanced Search and Filters */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/10 to-purple-500/20"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full -translate-y-24 translate-x-24 blur-2xl"></div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Esplora Proprietà
                </h2>
                <p className="text-emerald-300 text-sm">
                  Trova la tua casa ideale
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters({ ...filters, type: value })
                }
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20 backdrop-blur-sm">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md">
                  <SelectItem value="all">Tutti i tipi</SelectItem>
                  <SelectItem value="APARTMENT">Appartamento</SelectItem>
                  <SelectItem value="HOUSE">Casa</SelectItem>
                  <SelectItem value="VILLA">Villa</SelectItem>
                  <SelectItem value="COMMERCIAL">Commerciale</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20 backdrop-blur-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md">
                  <SelectItem value="all">Tutti</SelectItem>
                  <SelectItem value="FOR_SALE">In Vendita</SelectItem>
                  <SelectItem value="FOR_RENT">In Affitto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Prezzo min"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20 backdrop-blur-sm"
              />
              <Input
                type="number"
                placeholder="Prezzo max"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Results Count & Usage Info */}
        <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700">
                {filteredProperties.length} proprietà trovate
              </span>
            </div>
            {/* {isAdmin && (
              <Link
                href="/dashboard/analytics/google-maps"
                className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
              >
                Analytics →
              </Link>
            )} */}
          </div>
          {isAdmin && (
            <div className="flex items-center justify-between text-xs bg-emerald-50 rounded-lg p-2">
              <span className="text-emerald-700 font-medium">
                API Usage Today: {getTodayUsage()}
              </span>
            </div>
          )}
        </div>

        {/* Enhanced Property List */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-slate-50">
          <div className="p-2">
            {filteredProperties.map((property, index) => (
              <div
                key={property.id}
                className={`mb-3 transition-all duration-200 hover:shadow-lg ${
                  selectedProperty?.id === property.id
                    ? "ring-2 ring-emerald-500 shadow-lg transform scale-[1.02] rounded-xl"
                    : "hover:shadow-md"
                }`}
              >
                <PropertyCard
                  property={property}
                  isSelected={selectedProperty?.id === property.id}
                  onClick={() => handleMarkerClick(property)}
                />
              </div>
            ))}

            {/* Empty State */}
            {filteredProperties.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Nessuna proprietà trovata
                </h3>
                <p className="text-slate-500 text-sm">
                  Prova ad aggiustare i filtri per vedere più risultati
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Right Side - Google Map */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-white/30 z-0"></div>
        <div className="relative z-10 h-full rounded-l-3xl overflow-hidden shadow-2xl border-l border-slate-200/50">
          <GoogleMap
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onMarkerClick={handleMarkerClick}
          />
        </div>
      </div>
    </div>
  );
}
