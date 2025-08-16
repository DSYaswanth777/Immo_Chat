"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Building, Save, Loader2, Lock, Shield, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  phone: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  company?: string;
  bio?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    properties: number;
    favorites: number;
    inquiries: number;
  };
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hasPassword, setHasPassword] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const userId = (session?.user as any)?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);

        if (response.ok) {
          const userData = await response.json();
          setProfile(userData);
          // Set form values
          setValue("name", userData.name || "");
          setValue("phone", userData.phone || "");
          setValue("company", userData.company || "");
          setValue("bio", userData.bio || "");
        } else {
          setError("Errore nel caricamento del profilo");
        }
      } catch (error) {
        setError("Errore nel caricamento del profilo");
      } finally {
        setLoading(false);
      }
    };

    const checkPasswordStatus = async () => {
      try {
        setCheckingPassword(true);
        const response = await fetch('/api/auth/set-password');
        if (response.ok) {
          const result = await response.json();
          setHasPassword(result.hasPassword);
        }
      } catch (error) {
        console.error("Error checking password status:", error);
      } finally {
        setCheckingPassword(false);
      }
    };

    fetchProfile();
    checkPasswordStatus();
  }, [userId, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!userId) return;

    try {
      setSaving(true);

      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      setProfile(updatedUser);

      // Update session with new name
      await update({
        name: updatedUser.name,
      });

      toast.success("Profilo aggiornato con successo!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Errore nell'aggiornamento del profilo");
    } finally {
      setSaving(false);
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

  if (!profile) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              Impossibile caricare il profilo
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#203129]">Il Mio Profilo</h1>
        <p className="text-gray-600 mt-1">
          Gestisci le informazioni del tuo account
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Informazioni Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile.image || ""} alt={profile.name} />
                <AvatarFallback className="bg-[#10c03e] text-white text-xl">
                  {profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">{profile.name}</h3>
              <p className="text-sm text-gray-600">{profile.email}</p>
              <Badge variant="secondary" className="mt-2">
                {profile.role}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-600">Membro dal:</span>
                <span className="ml-auto">
                  {new Date(profile.createdAt).toLocaleDateString("it-IT")}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-600">Email:</span>
                <span className="ml-auto text-xs">{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">Telefono:</span>
                  <span className="ml-auto">{profile.phone}</span>
                </div>
              )}
              {profile.company && (
                <div className="flex items-center text-sm">
                  <Building className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">Azienda:</span>
                  <span className="ml-auto text-xs">{profile.company}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              {hasPassword ? (
                <Link href="/auth/change-password" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Cambia Password
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/set-password" className="w-full">
                  <Button className="w-full bg-[#10c03e] hover:bg-[#0ea835]">
                    <Shield className="h-4 w-4 mr-2" />
                    Imposta Password
                  </Button>
                </Link>
              )}
              
              {!hasPassword && !checkingPassword && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-start">
                    <Shield className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-amber-800">
                        Account Google
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        Imposta una password per accedere anche con email e password
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Modifica Profilo</CardTitle>
            <CardDescription>
              Aggiorna le tue informazioni personali
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+39 333 123 4567"
                    {...register("phone")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Azienda</Label>
                <Input
                  id="company"
                  placeholder="Nome della tua azienda"
                  {...register("company")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  placeholder="Racconta qualcosa di te..."
                  rows={4}
                  {...register("bio")}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={saving}
                >
                  Annulla
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#10c03e] hover:bg-[#0ea835]"
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {saving ? "Salvando..." : "Salva Modifiche"}
                  {!saving && <Save className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
