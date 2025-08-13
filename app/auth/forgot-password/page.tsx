"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const forgotPasswordSchema = z.object({
  email: z.string().email("Inserisci un indirizzo email valido"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true)
      setSuccessMessage("")
      
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSuccessMessage(
        "Se l'email esiste nel nostro sistema, riceverai un link per reimpostare la password."
      )
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (error: any) {
      setError("root", {
        message: error.message || "Si è verificato un errore durante l'invio dell'email"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Link
            href="/auth/login"
            className="flex items-center text-[#10c03e] hover:text-[#0ea835] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna al login
          </Link>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-[#203129]">
              Password Dimenticata
            </CardTitle>
            <CardDescription className="text-center">
              Inserisci la tua email per ricevere un link di reset
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-green-400 mr-2" />
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              </div>
            )}

            {errors.root && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{errors.root.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Indirizzo Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@esempio.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#10c03e] hover:bg-[#0ea835] text-white"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Invio in corso..." : "Invia Link di Reset"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-gray-600">Ti sei ricordato la password? </span>
              <Link
                href="/auth/login"
                className="text-[#10c03e] hover:text-[#0ea835] font-medium"
              >
                Accedi
              </Link>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                Cosa succede dopo?
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Controlla la tua casella email</li>
                <li>• Clicca sul link ricevuto</li>
                <li>• Imposta una nuova password sicura</li>
                <li>• Accedi con le nuove credenziali</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}