'use client'

import { useEffect, useState, use } from 'react'
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
import { ArrowLeft, Save, Loader2, User } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface UserData {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  company?: string
  bio?: string
  image?: string
  createdAt: string
  updatedAt: string
}

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    company: '',
    bio: '',
  })

  const userRole = (session?.user as any)?.role || 'CUSTOMER'
  const currentUserId = (session?.user as any)?.id
  const isAdmin = userRole === 'ADMIN'

  // Unwrap params
  const { id } = use(params)

  // Redirect if not admin
  useEffect(() => {
    if (userRole !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [userRole, router])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${id}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setUser(data)
        setFormData({
          name: data.name || '',
          email: data.email || '',
          role: data.role || '',
          phone: data.phone || '',
          company: data.company || '',
          bio: data.bio || '',
        })
      } catch (error) {
        console.error('Error fetching user:', error)
        toast.error('Errore nel caricamento dell\'utente')
      } finally {
        setLoading(false)
      }
    }

    if (session && isAdmin) {
      fetchUser()
    }
  }, [id, session, isAdmin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (saving) return
    
    try {
      setSaving(true)
      
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Errore durante l\'aggiornamento')
      }

      toast.success('Utente aggiornato con successo!')
      router.push('/dashboard/admin/users')
    } catch (error: any) {
      console.error('Error updating user:', error)
      toast.error(error.message || 'Errore durante l\'aggiornamento')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isAdmin) {
    return null
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

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Utente non trovato</h2>
          <p className="text-gray-600 mb-6">L'utente che stai cercando non esiste.</p>
          <Link href="/dashboard/admin/users">
            <Button>Torna agli utenti</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/admin/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna agli utenti
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#203129]">Modifica Utente</h1>
            <p className="text-gray-600 mt-1">Aggiorna i dettagli dell'utente</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Dettagli Utente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informazioni Base</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    disabled
                  />
                  <p className="text-xs text-gray-500">L'email non può essere modificata</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Ruolo *</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona ruolo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CUSTOMER">Cliente</SelectItem>
                      <SelectItem value="ADMIN">Amministratore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informazioni Aggiuntive</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+39 123 456 7890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Azienda</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Nome azienda"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                    placeholder="Breve descrizione dell'utente..."
                  />
                </div>
              </div>
            </div>

            {/* User Info Display */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Informazioni Sistema</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-gray-500">ID Utente</label>
                  <p className="text-gray-700 font-mono">{user.id}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-500">Creato il</label>
                  <p className="text-gray-700">
                    {new Date(user.createdAt).toLocaleDateString('it-IT')}
                  </p>
                </div>
                <div>
                  <label className="font-medium text-gray-500">Ultimo aggiornamento</label>
                  <p className="text-gray-700">
                    {new Date(user.updatedAt).toLocaleDateString('it-IT')}
                  </p>
                </div>
                <div>
                  <label className="font-medium text-gray-500">Ruolo attuale</label>
                  <p className="text-gray-700">{user.role}</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href="/dashboard/admin/users">
                <Button variant="outline" type="button">
                  Annulla
                </Button>
              </Link>
              <Button type="submit" disabled={saving} className="bg-[#10c03e] hover:bg-[#0ea835]">
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
  )
}
