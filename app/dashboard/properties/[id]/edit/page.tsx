"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
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
}

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    status: "",
    listingStatus: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    lotSize: "",
    yearBuilt: "",
    floors: "",
    parking: "",
    latitude: "",
    longitude: "",
    features: "",
    amenities: "",
    images: "",
    virtualTour: "",
    videoUrl: "",
  });

  const userRole = (session?.user as any)?.role || "CUSTOMER";
  const currentUserId = (session?.user as any)?.id;
  const isAdmin = userRole === "ADMIN";

  // Unwrap params
  const { id } = use(params);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if user has permission to edit this property
        if (data.ownerId !== currentUserId && !isAdmin) {
          toast.error("Non hai i permessi per modificare questa proprietà");
          router.push("/dashboard/properties");
          return;
        }

        setProperty(data);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          type: data.type || "",
          status: data.status || "",
          listingStatus: data.listingStatus || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipCode || "",
          country: data.country || "",
          price: data.price?.toString() || "",
          bedrooms: data.bedrooms?.toString() || "",
          bathrooms: data.bathrooms?.toString() || "",
          area: data.area?.toString() || "",
          lotSize: data.lotSize?.toString() || "",
          yearBuilt: data.yearBuilt?.toString() || "",
          floors: data.floors?.toString() || "",
          parking: data.parking?.toString() || "",
          latitude: data.latitude?.toString() || "",
          longitude: data.longitude?.toString() || "",
          features: Array.isArray(data.features)
            ? data.features.join(", ")
            : "",
          amenities: Array.isArray(data.amenities)
            ? data.amenities.join(", ")
            : "",
          images: Array.isArray(data.images) ? data.images.join(", ") : "",
          virtualTour: data.virtualTour || "",
          videoUrl: data.videoUrl || "",
        });
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Errore nel caricamento della proprietà");
      } finally {
        setLoading(false);
      }
    };

    if (session && currentUserId) {
      fetchProperty();
    }
  }, [id, session, currentUserId, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (saving) return
    
    // Basic client-side validation
    if (!formData.title || !formData.title.trim()) {
      toast.error('Il titolo è obbligatorio')
      return
    }
    
    if (!formData.address || !formData.address.trim()) {
      toast.error('L\'indirizzo è obbligatorio')
      return
    }
    
    if (!formData.city || !formData.city.trim()) {
      toast.error('La città è obbligatoria')
      return
    }
    
    if (!formData.state || !formData.state.trim()) {
      toast.error('La provincia è obbligatoria')
      return
    }
    
    if (!formData.zipCode || !formData.zipCode.trim()) {
      toast.error('Il CAP è obbligatorio')
      return
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Il prezzo deve essere maggiore di zero')
      return
    }
    
    try {
      setSaving(true)
      
      // Convert form data to API format
      const updateData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : undefined,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
        area: formData.area ? parseFloat(formData.area) : undefined,
        lotSize: formData.lotSize ? parseFloat(formData.lotSize) : undefined,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
        floors: formData.floors ? parseInt(formData.floors) : undefined,
        parking: formData.parking ? parseInt(formData.parking) : undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : [],
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()).filter(a => a) : [],
        images: formData.images ? formData.images.split(',').map(i => i.trim()).filter(i => i) : [],
      }

      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.details && Array.isArray(errorData.details)) {
          // Show validation errors
          const validationErrors = errorData.details.map((err: any) => err.message).join(', ')
          throw new Error(`Errori di validazione: ${validationErrors}`)
        } else {
          throw new Error(errorData.error || 'Errore durante l\'aggiornamento')
        }
      }

      toast.success('Proprietà aggiornata con successo!')
      router.push('/dashboard/properties')
    } catch (error: any) {
      console.error('Error updating property:', error)
      toast.error(error.message || 'Errore durante l\'aggiornamento')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  if (!property) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Proprietà non trovata
          </h2>
          <p className="text-gray-600 mb-6">
            La proprietà che stai cercando non esiste o non hai i permessi per
            visualizzarla.
          </p>
          <Link href="/dashboard/properties">
            <Button>Torna alle proprietà</Button>
          </Link>
        </div>
      </div>
    );
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
            <h1 className="text-3xl font-bold text-[#203129]">
              Modifica Proprietà
            </h1>
            <p className="text-gray-600 mt-1">
              Aggiorna i dettagli della proprietà
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Dettagli Proprietà</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informazioni Base</h3>

                <div className="space-y-2">
                  <Label htmlFor="title">Titolo *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrizione</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleInputChange("type", value)
                      }
                    >
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

                  <div className="space-y-2">
                    <Label htmlFor="status">Stato *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona stato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FOR_SALE">In Vendita</SelectItem>
                        <SelectItem value="FOR_RENT">In Affitto</SelectItem>
                        <SelectItem value="SOLD">Venduto</SelectItem>
                        <SelectItem value="RENTED">Affittato</SelectItem>
                        <SelectItem value="DRAFT">Bozza</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Prezzo *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Posizione</h3>

                <div className="space-y-2">
                  <Label htmlFor="address">Indirizzo *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Città *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Provincia *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CAP *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Paese</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitudine</Label>
                    <Input
                      id="latitude"
                      type="number"
                      value={formData.latitude}
                      onChange={(e) =>
                        handleInputChange("latitude", e.target.value)
                      }
                      step="any"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitudine</Label>
                    <Input
                      id="longitude"
                      type="number"
                      value={formData.longitude}
                      onChange={(e) =>
                        handleInputChange("longitude", e.target.value)
                      }
                      step="any"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dettagli Aggiuntivi</h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Camere da letto</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) =>
                      handleInputChange("bedrooms", e.target.value)
                    }
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bagni</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      handleInputChange("bathrooms", e.target.value)
                    }
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Superficie (m²)</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floors">Piani</Label>
                  <Input
                    id="floors"
                    type="number"
                    value={formData.floors}
                    onChange={(e) =>
                      handleInputChange("floors", e.target.value)
                    }
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">
                  Caratteristiche (separate da virgole)
                </Label>
                <Input
                  id="features"
                  value={formData.features}
                  onChange={(e) =>
                    handleInputChange("features", e.target.value)
                  }
                  placeholder="es. Giardino, Cantina, Balcone"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amenities">Servizi (separati da virgole)</Label>
                <Input
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) =>
                    handleInputChange("amenities", e.target.value)
                  }
                  placeholder="es. Ascensore, Parcheggio, Condizionamento"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href="/dashboard/properties">
                <Button variant="outline" type="button">
                  Annulla
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#10c03e] hover:bg-[#0ea835]"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvataggio...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salva Modifiche
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
