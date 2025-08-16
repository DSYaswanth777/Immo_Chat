"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleAuthButton } from "@/components/auth/google-auth-button"
import { signupSchema, type SignupFormData, signupUser } from "@/lib/auth"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true)
      setSuccessMessage("")
      
      const result = await signupUser(data)
      
      if (result.success) {
        setSuccessMessage(result.message)
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
      }
    } catch (error: any) {
      setError("root", {
        message: error.message || "Si è verificato un errore durante la registrazione"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (

    <div className="sm:mx-auto sm:w-full sm:max-w-md">
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-[#203129]">
          Crea il tuo account
        </CardTitle>
        <CardDescription className="text-center">
          Registrati per iniziare a utilizzare Immochat
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        {errors.root && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{errors.root.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Inserisci il tuo nome completo"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Crea una password sicura"
                {...register("password")}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 focus:outline-none"
                onClick={(e) => {
                  e.preventDefault()
                  setShowPassword(!showPassword)
                }}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Conferma password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Conferma la tua password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 focus:outline-none"
                onClick={(e) => {
                  e.preventDefault()
                  setShowConfirmPassword(!showConfirmPassword)
                }}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#10c03e] hover:bg-[#0ea835] text-white"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Creazione account..." : "Crea account"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Oppure</span>
          </div>
        </div>

        <GoogleAuthButton text="Registrati con Google" />

        <div className="text-center text-sm">
          <span className="text-gray-600">Hai già un account? </span>
          <Link
            href="/auth/login"
            className="text-[#10c03e] hover:text-[#0ea835] font-medium"
          >
            Accedi
          </Link>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Registrandoti accetti i nostri{" "}
          <Link href="/terms" className="text-[#10c03e] hover:underline">
            Termini di Servizio
          </Link>{" "}
          e la{" "}
          <Link href="/privacy" className="text-[#10c03e] hover:underline">
            Privacy Policy
          </Link>
        </div>
      </CardContent>
    </Card>
    </div>

  )
}
