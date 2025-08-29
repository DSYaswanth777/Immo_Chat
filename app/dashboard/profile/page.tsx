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
import {
  User,
  Mail,
  Phone,
  Building,
  Save,
  Loader2,
  Lock,
  Shield,
  Plus,
} from "lucide-react";
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
        const response = await fetch("/api/auth/set-password");
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
        <Card className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
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
    <div className="space-y-8 animate-fade-in">
      {/* Modern Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/10 to-purple-500/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>

        <div className="relative z-10 flex items-center space-x-6">
          <div className="relative">
            <Avatar className="w-16 h-16 ring-4 ring-white/20 shadow-2xl">
              <AvatarImage src={profile.image || ""} alt={profile.name} />
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full border-4 border-slate-800 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                {profile.name}
              </h1>
              <Badge
                className={`px-3 py-1 ${
                  profile.role === "ADMIN"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                    : "bg-blue-500/20 text-blue-300 border-blue-400/30"
                }`}
              >
                {profile.role}
              </Badge>
            </div>
            <p className="text-slate-300 text-sm mb-4 ">{profile.email}</p>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-emerald-300">
                <Building className="w-4 h-4" />
                <span>{profile._count.properties} Proprietà</span>
              </div>

          
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <Card className="lg:col-span-1 border-0 shadow-xl bg-white/90 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-16 translate-x-16"></div>
          <CardHeader className="relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900">
                  Informazioni Account
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Gestisci i tuoi dati personali
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            {/* Account Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <div className="text-2xl font-bold text-emerald-700">
                  {profile._count.properties}
                </div>
                <div className="text-xs text-emerald-600">Proprietà</div>
              </div>
    
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-700">
                  {new Date(profile.createdAt).getFullYear()}
                </div>
                <div className="text-xs text-purple-600">Membro dal</div>
              </div>
            </div>

            <Separator className="bg-gray-200" />

            {/* Account Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Email
                  </span>
                </div>
                <span className="text-sm text-gray-600">{profile.email}</span>
              </div>

              {profile.phone && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Telefono
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{profile.phone}</span>
                </div>
              )}

              {profile.company && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Azienda
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {profile.company}
                  </span>
                </div>
              )}
            </div>

            <Separator className="bg-gray-200" />

            {/* Security Actions */}
            <div className="space-y-3">
              {hasPassword ? (
                <Link href="/auth/change-password" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full group hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-300"
                  >
                    <Lock className="h-4 w-4 mr-2 group-hover:text-emerald-600" />
                    Cambia Password
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/set-password" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 hover:scale-[1.02]">
                    <Shield className="h-4 w-4 mr-2" />
                    Imposta Password
                  </Button>
                </Link>
              )}

              {!hasPassword && !checkingPassword && (
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Account Google
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        Imposta una password per accedere anche con email e
                        password
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="lg:col-span-2 border-0 shadow-xl bg-white/90 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16"></div>
          <CardHeader className="relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Save className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900">
                  Modifica Profilo
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Aggiorna le tue informazioni personali
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Nome Completo *
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    className={`transition-all duration-300 ${
                      errors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                    } bg-white hover:border-gray-300 rounded-xl`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      </span>
                      <span>{errors.name.message}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Telefono
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+39 333 123 4567"
                    {...register("phone")}
                    className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 bg-white hover:border-gray-300 rounded-xl transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="company"
                  className="text-sm font-medium text-gray-700"
                >
                  Azienda
                </Label>
                <Input
                  id="company"
                  placeholder="Nome della tua azienda"
                  {...register("company")}
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 bg-white hover:border-gray-300 rounded-xl transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="bio"
                  className="text-sm font-medium text-gray-700"
                >
                  Biografia
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Racconta qualcosa di te..."
                  rows={4}
                  {...register("bio")}
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-200 bg-white hover:border-gray-300 rounded-xl transition-all duration-300 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={saving}
                  className="px-6 py-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 rounded-xl"
                >
                  Annulla
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 hover:scale-[1.02] rounded-xl shadow-lg hover:shadow-emerald-500/25"
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
