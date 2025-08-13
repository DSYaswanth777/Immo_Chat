import { z } from "zod"

// Validation schemas
export const signupSchema = z.object({
  name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  email: z.string().email("Inserisci un indirizzo email valido"),
  password: z
    .string()
    .min(8, "La password deve contenere almeno 8 caratteri")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "La password deve contenere almeno una lettera minuscola, una maiuscola e un numero"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Le password non corrispondono",
  path: ["confirmPassword"],
})

export const loginSchema = z.object({
  email: z.string().email("Inserisci un indirizzo email valido"),
  password: z.string().min(1, "La password è obbligatoria"),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "La password attuale è obbligatoria"),
  newPassword: z
    .string()
    .min(8, "La nuova password deve contenere almeno 8 caratteri")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "La password deve contenere almeno una lettera minuscola, una maiuscola e un numero"),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Le password non corrispondono",
  path: ["confirmNewPassword"],
})

// Types
export type SignupFormData = z.infer<typeof signupSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

// Client-side authentication functions that call API routes
export const signupUser = async (data: SignupFormData) => {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Errore durante la registrazione")
    }

    return result
  } catch (error: any) {
    console.error("Signup error:", error)
    throw new Error(error.message || "Errore durante la registrazione")
  }
}

export const loginUser = async (data: LoginFormData) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Errore durante l'accesso")
    }

    return result
  } catch (error: any) {
    console.error("Login error:", error)
    throw new Error(error.message || "Errore durante l'accesso")
  }
}

export const changeUserPassword = async (data: ChangePasswordFormData, userEmail: string) => {
  try {
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        userEmail,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Errore durante il cambio password")
    }

    return result
  } catch (error: any) {
    console.error("Change password error:", error)
    throw new Error(error.message || "Errore durante il cambio password")
  }
}
