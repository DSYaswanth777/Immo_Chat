"use client";

import { useState, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Plus, X, MapPin, Map } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { LocationPickerMap } from "@/components/dashboard/location-picker-map";

export default function NewPropertyPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [useMapLocation, setUseMapLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "APARTMENT",
    status: "DRAFT",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    yearBuilt: "",
    floors: "",
    parking: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });

    // Reverse geocoding to get address
    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat, lng };

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const address = results[0].formatted_address;
          setSelectedLocation({ lat, lng, address });

          // Parse address components
          const components = results[0].address_components;
          let street = "";
          let city = "";
          let state = "";
          let zipCode = "";

          components.forEach((component) => {
            const types = component.types;
            if (types.includes("street_number") || types.includes("route")) {
              street += component.long_name + " ";
            } else if (types.includes("locality")) {
              city = component.long_name;
            } else if (types.includes("administrative_area_level_1")) {
              state = component.long_name;
            } else if (types.includes("postal_code")) {
              zipCode = component.long_name;
            }
          });

          // Update form data with geocoded information
          setFormData((prev) => ({
            ...prev,
            address: street.trim(),
            city: city,
            state: state,
            zipCode: zipCode,
          }));

          toast.success("Posizione selezionata dalla mappa!");
        }
      });
    }
  }, []);

  const toggleLocationMethod = () => {
    setUseMapLocation(!useMapLocation);
    if (!useMapLocation) {
      // Clear manual address when switching to map
      setFormData((prev) => ({
        ...prev,
        address: "",
        city: "",
        state: "",
        zipCode: "",
      }));
      setSelectedLocation(null);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures((prev) => [...prev, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures((prev) => prev.filter((f) => f !== feature));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.title ||
        !formData.type ||
        !formData.address ||
        !formData.city ||
        !formData.price
      ) {
        toast.error("Compila tutti i campi obbligatori");
        return;
      }

      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms
          ? parseInt(formData.bathrooms)
          : undefined,
        area: formData.area ? parseFloat(formData.area) : undefined,
        yearBuilt: formData.yearBuilt
          ? parseInt(formData.yearBuilt)
          : undefined,
        floors: formData.floors ? parseInt(formData.floors) : undefined,
        parking: formData.parking ? parseInt(formData.parking) : undefined,
        features,
        // Include location data if selected from map
        ...(selectedLocation && {
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
        }),
      };

      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const createdProperty = await response.json();
      toast.success("Proprietà creata con successo!");
      router.push("/dashboard/properties");
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error("Errore nella creazione della proprietà");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Modern Header */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/10 to-purple-500/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard/properties">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white hover:bg-white/10 mb-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Torna alle Proprietà
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-white/20">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Aggiungi Nuova Proprietà
                </h1>
                <p className="text-slate-300 text-lg">
                  Inserisci i dettagli della tua proprietà immobiliare
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enhanced Basic Information Card */}
          <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-white/30"></div>
            <div className="relative z-10">
              <div className="p-6 border-b border-slate-200/50">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  Informazioni di Base
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className="text-slate-700 font-medium"
                    >
                      Titolo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="es. Appartamento Moderno Milano Centro"
                      className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="type"
                      className="text-slate-700 font-medium"
                    >
                      Tipo Proprietà <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.type || "APARTMENT"}
                      onValueChange={(value) =>
                        handleInputChange("type", value)
                      }
                    >
                      <SelectTrigger className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500">
                        <SelectValue placeholder="Seleziona tipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-md">
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
                  <Label
                    htmlFor="description"
                    className="text-slate-700 font-medium"
                  >
                    Descrizione
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Descrivi la proprietà..."
                    className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="status"
                      className="text-slate-700 font-medium"
                    >
                      Stato
                    </Label>
                    <Select
                      value={formData.status || "DRAFT"}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500">
                        <SelectValue placeholder="Seleziona stato" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-md">
                        <SelectItem value="DRAFT">Bozza</SelectItem>
                        <SelectItem value="FOR_SALE">In Vendita</SelectItem>
                        <SelectItem value="FOR_RENT">In Affitto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="price"
                      className="text-slate-700 font-medium"
                    >
                      Prezzo (€) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="450000"
                      className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Location Card */}
          <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-white/30"></div>
            <div className="relative z-10">
              <div className="p-6 border-b border-slate-200/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    Posizione
                  </h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleLocationMethod}
                    className="flex items-center space-x-2 bg-white/80 border-slate-300 hover:bg-white"
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
              </div>
              <div className="p-6 space-y-4">
                {useMapLocation ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>
                        Clicca sulla mappa per selezionare la posizione
                      </Label>
                      <div className="h-96 w-full border rounded-lg overflow-hidden">
                        <LocationPickerMap
                          center={{ lat: 45.4642, lng: 9.19 }} // Milan center
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
                          <span className="font-medium">
                            Posizione Selezionata:
                          </span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          {selectedLocation.address ||
                            `Lat: ${selectedLocation.lat.toFixed(
                              6
                            )}, Lng: ${selectedLocation.lng.toFixed(6)}`}
                        </p>
                      </div>
                    )}

                    {/* Show form fields populated from map selection */}
                    {selectedLocation && (
                      <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                          <Label
                            htmlFor="address"
                            className="text-slate-700 font-medium"
                          >
                            Indirizzo (dalla mappa)
                          </Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) =>
                              handleInputChange("address", e.target.value)
                            }
                            placeholder="Via Roma 123"
                            className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="city"
                              className="text-slate-700 font-medium"
                            >
                              Città
                            </Label>
                            <Input
                              id="city"
                              value={formData.city}
                              onChange={(e) =>
                                handleInputChange("city", e.target.value)
                              }
                              placeholder="Milano"
                              className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="state"
                              className="text-slate-700 font-medium"
                            >
                              Regione
                            </Label>
                            <Input
                              id="state"
                              value={formData.state}
                              onChange={(e) =>
                                handleInputChange("state", e.target.value)
                              }
                              placeholder="Lombardia"
                              className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="zipCode"
                              className="text-slate-700 font-medium"
                            >
                              CAP
                            </Label>
                            <Input
                              id="zipCode"
                              value={formData.zipCode}
                              onChange={(e) =>
                                handleInputChange("zipCode", e.target.value)
                              }
                              placeholder="20121"
                              className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="address"
                        className="text-slate-700 font-medium"
                      >
                        Indirizzo <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Via Roma 123"
                        className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="city"
                          className="text-slate-700 font-medium"
                        >
                          Città <span className="text-red-500">*</span> 
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          placeholder="Milano"
                          className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="state"
                          className="text-slate-700 font-medium"
                        >
                          Regione
                        </Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) =>
                            handleInputChange("state", e.target.value)
                          }
                          placeholder="Lombardia"
                          className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="zipCode"
                          className="text-slate-700 font-medium"
                        >
                          CAP
                        </Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) =>
                            handleInputChange("zipCode", e.target.value)
                          }
                          placeholder="20121"
                          className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Property Details Card */}
          <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-white/30"></div>
            <div className="relative z-10">
              <div className="p-6 border-b border-slate-200/50">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  Dettagli Proprietà
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="bedrooms"
                      className="text-slate-700 font-medium"
                    >
                      Camere da Letto
                    </Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) =>
                        handleInputChange("bedrooms", e.target.value)
                      }
                      placeholder="3"
                      min="0"
                      className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="bathrooms"
                      className="text-slate-700 font-medium"
                    >
                      Bagni
                    </Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) =>
                        handleInputChange("bathrooms", e.target.value)
                      }
                      placeholder="2"
                      min="0"
                      className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="area"
                      className="text-slate-700 font-medium"
                    >
                      Superficie (m²)
                    </Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={(e) =>
                        handleInputChange("area", e.target.value)
                      }
                      placeholder="120"
                      min="0"
                      className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="yearBuilt"
                      className="text-slate-700 font-medium"
                    >
                      Anno Costruzione
                    </Label>
                    <Input
                      id="yearBuilt"
                      type="number"
                      value={formData.yearBuilt}
                      onChange={(e) =>
                        handleInputChange("yearBuilt", e.target.value)
                      }
                      placeholder="2010"
                      min="1800"
                      max={new Date().getFullYear()}
                      className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="floors"
                      className="text-slate-700 font-medium"
                    >
                      Piani
                    </Label>
                    <Input
                      id="floors"
                      type="number"
                      value={formData.floors}
                      onChange={(e) =>
                        handleInputChange("floors", e.target.value)
                      }
                      placeholder="2"
                      min="1"
                      className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="parking"
                      className="text-slate-700 font-medium"
                    >
                      Posti Auto
                    </Label>
                    <Input
                      id="parking"
                      type="number"
                      value={formData.parking}
                      onChange={(e) =>
                        handleInputChange("parking", e.target.value)
                      }
                      placeholder="1"
                      min="0"
                      className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Features Card */}
          <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-white/30"></div>
            <div className="relative z-10">
              <div className="p-6 border-b border-slate-200/50">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  Caratteristiche
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Aggiungi caratteristica (es. Balcone, Ascensore...)"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addFeature())
                    }
                    className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <Button
                    type="button"
                    onClick={addFeature}
                    variant="outline"
                    className="bg-white/80 border-slate-300 hover:bg-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <Badge
                      key={feature}
                      variant="secondary"
                      className="flex items-center space-x-1 bg-slate-100 text-slate-700 border border-slate-300"
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="ml-1 hover:text-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Submit Section */}
          <div className="flex justify-end space-x-4 pt-6">
            <Link href="/dashboard/properties">
              <Button
                type="button"
                variant="outline"
                className="bg-white/80 border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400"
              >
                Annulla
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8"
            >
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
    </div>
  );
}
