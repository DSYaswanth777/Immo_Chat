"use client";

import { useEffect, useState } from "react";
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
  DropdownMenuSeparator,
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
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

interface User {
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
  };
}

export default function UsersManagementPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);
  const [userToChangeRole, setUserToChangeRole] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<"ADMIN" | "CUSTOMER">("CUSTOMER");
  const [changingRole, setChangingRole] = useState(false);

  const userRole = (session?.user as any)?.role || "CUSTOMER";
  const currentUserId = (session?.user as any)?.id;

  // Redirect if not admin
  useEffect(() => {
    if (userRole !== "ADMIN") {
      window.location.href = "/dashboard/properties";
      return;
    }
  }, [userRole]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/users");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data.users || []);
        setFilteredUsers(data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Errore nel caricamento degli utenti");
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (userRole === "ADMIN") {
      fetchUsers();
    }
  }, [userRole]);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.company &&
            user.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (roleFilter && roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const handleDeleteUser = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setFilteredUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success("Utente eliminato con successo");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Errore nell'eliminazione dell'utente");
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleRoleChange = async () => {
    if (!userToChangeRole) return;

    try {
      setChangingRole(true);

      const response = await fetch(`/api/users/${userToChangeRole.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: newRole,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Errore durante il cambio ruolo");
      }

      const updatedUser = await response.json();

      // Update users in state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userToChangeRole.id ? { ...u, role: updatedUser.role } : u
        )
      );
      setFilteredUsers((prev) =>
        prev.map((u) =>
          u.id === userToChangeRole.id ? { ...u, role: updatedUser.role } : u
        )
      );

      const actionText =
        newRole === "ADMIN"
          ? "promosso ad amministratore"
          : "retrocesso a cliente";
      toast.success(`Utente ${actionText} con successo`);
    } catch (error: any) {
      console.error("Error changing user role:", error);
      toast.error(error.message || "Errore durante il cambio ruolo");
    } finally {
      setChangingRole(false);
      setRoleChangeDialogOpen(false);
      setUserToChangeRole(null);
    }
  };

  const initiateRoleChange = (user: User, targetRole: "ADMIN" | "CUSTOMER") => {
    // Prevent admin from demoting themselves
    if (user.id === currentUserId && targetRole === "CUSTOMER") {
      toast.error("Non puoi retrocedere il tuo stesso account");
      return;
    }

    setUserToChangeRole(user);
    setNewRole(targetRole);
    setRoleChangeDialogOpen(true);
  };

  if (userRole !== "ADMIN") {
    return null;
  }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Modern Header */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/10 to-purple-500/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-wrap m-0">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-white/20">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className=" ">
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Gestione Utenti
                  </h1>
                  <p className="text-slate-300 text-lg">
                    Gestisci tutti gli utenti della piattaforma
                  </p>
                  <div className="flex items-center mt-3 space-x-4 text-sm text-emerald-300">
                    <div className="flex items-center bg-white/10 rounded-full px-3 py-1 backdrop-blur-sm">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="font-medium">
                        {filteredUsers.length}
                      </span>
                      <span className="ml-1">utenti attivi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="relative bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-white/30"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-emerald-600" />
                Filtri e Ricerca
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 md:top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Cerca utenti..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="bg-white/70 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200">
                  <SelectValue placeholder="Ruolo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i ruoli</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center flex-row justify-center bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-1 border border-emerald-200/50">
                <div className="text-center flex items-center flex-row justify-center gap-4">
                  <div className="text-xl font-bold text-emerald-700">
                    {filteredUsers.length}
                  </div>
                  <div className="text-md text-emerald-600 font-medium">
                    utenti trovati
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Users Table */}
        <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-slate-50/30"></div>
          <div className="relative z-10">
            <Table>
              <TableHeader className="border-b border-slate-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-slate-700 py-4">
                    Utente
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Ruolo
                  </TableHead>
                  {/* <TableHead className="font-semibold text-slate-700">
                    Azienda
                  </TableHead> */}
                  <TableHead className="font-semibold text-slate-700">
                    Proprietà
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Data Registrazione
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className={`hover:bg-emerald-50/30 transition-all duration-200 border-b border-slate-100/50 ${
                      index % 2 === 0 ? "bg-white/50" : "bg-slate-50/30"
                    }`}
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-emerald-500/20">
                          <span className="text-white text-lg font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-slate-600">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "ADMIN" ? "default" : "secondary"
                        }
                        className={
                          user.role === "ADMIN"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300 font-medium"
                            : "bg-blue-100 text-blue-800 border-blue-300 font-medium"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    {/* <TableCell>
                      <div className="text-sm text-slate-700">
                        {user.company || "-"}
                      </div>
                    </TableCell> */}
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm font-medium text-slate-700">
                          {user._count.properties} proprietà
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString("it-IT")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-slate-100 transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white/95 backdrop-blur-md border-slate-200"
                        >
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(
                                `/dashboard/admin/users/${user.id}/edit`,
                                "_blank"
                              )
                            }
                            className="hover:bg-slate-50"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifica
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-slate-200" />

                          {user.role === "CUSTOMER" ? (
                            <DropdownMenuItem
                              onClick={() => initiateRoleChange(user, "ADMIN")}
                              className="text-emerald-600 hover:bg-emerald-50"
                            >
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              Promuovi ad Admin
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() =>
                                initiateRoleChange(user, "CUSTOMER")
                              }
                              className="text-orange-600 hover:bg-orange-50"
                              disabled={user.id === currentUserId}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Retrocedi a Cliente
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator className="bg-slate-200" />

                          <DropdownMenuItem
                            onClick={() => {
                              setUserToDelete(user);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600 hover:bg-red-50"
                            disabled={user.id === currentUserId}
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
          </div>
        </div>

        {/* Enhanced Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-white/95 backdrop-blur-md border border-slate-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-slate-900">
                Conferma Eliminazione
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600">
                Sei sicuro di voler eliminare l'utente "{userToDelete?.name}"?
                Questa azione non può essere annullata e eliminerà anche tutte
                le proprietà associate.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300">
                Annulla
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => userToDelete && handleDeleteUser(userToDelete)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Elimina
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Enhanced Role Change Confirmation Dialog */}
        <AlertDialog
          open={roleChangeDialogOpen}
          onOpenChange={setRoleChangeDialogOpen}
        >
          <AlertDialogContent className="bg-white/95 backdrop-blur-md border border-slate-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-slate-900">
                Conferma Cambio Ruolo
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600">
                {newRole === "ADMIN" ? (
                  <>
                    Sei sicuro di voler <strong>promuovere</strong> l'utente "
                    {userToChangeRole?.name}" ad <strong>Amministratore</strong>
                    ?
                    <br />
                    <br />
                    L'utente avrà accesso completo al pannello di
                    amministrazione e potrà gestire tutti gli utenti e le
                    proprietà.
                  </>
                ) : (
                  <>
                    Sei sicuro di voler <strong>retrocedere</strong> l'utente "
                    {userToChangeRole?.name}" a <strong>Cliente</strong>?
                    <br />
                    <br />
                    L'utente perderà l'accesso al pannello di amministrazione e
                    potrà gestire solo le proprie proprietà.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={changingRole}
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300"
              >
                Annulla
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRoleChange}
                disabled={changingRole}
                className={
                  newRole === "ADMIN"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-orange-600 hover:bg-orange-700 text-white"
                }
              >
                {changingRole
                  ? "Cambiando..."
                  : newRole === "ADMIN"
                  ? "Promuovi ad Admin"
                  : "Retrocedi a Cliente"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
