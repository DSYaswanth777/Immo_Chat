import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          // First, check for demo users (for backward compatibility)
          if (credentials.email === "admin@immochat.com" && credentials.password === "admin123") {
            const adminUser = await prisma.user.upsert({
              where: { email: "admin@immochat.com" },
              update: {},
              create: {
                email: "admin@immochat.com",
                name: "Admin User",
                role: "ADMIN"
              }
            })

            return {
              id: adminUser.id,
              email: adminUser.email,
              name: adminUser.name,
              role: adminUser.role,
            }
          }

          if (credentials.email === "customer@immochat.com" && credentials.password === "customer123") {
            const customerUser = await prisma.user.upsert({
              where: { email: "customer@immochat.com" },
              update: {},
              create: {
                email: "customer@immochat.com",
                name: "Customer User",
                role: "CUSTOMER"
              }
            })

            return {
              id: customerUser.id,
              email: customerUser.email,
              name: customerUser.name,
              role: customerUser.role,
            }
          }

          // Check for real users in database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !user.password) {
            console.log("User not found or no password set")
            return null
          }

          // Verify password using bcrypt
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          
          if (!isPasswordValid) {
            console.log("Invalid password")
            return null
          }

          console.log("Authentication successful for user:", user.email)
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }

        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error", // Error code passed in query string as ?error=
  },
  debug: process.env.NODE_ENV === "development" && process.env.NEXTAUTH_DEBUG === "true",
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      
      // If signing in with Google, ensure user has a role
      if (account?.provider === "google" && user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email }
        })
        if (dbUser) {
          token.role = dbUser.role
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      console.log("SignIn callback triggered:", { 
        provider: account?.provider, 
        email: user?.email,
        userId: user?.id 
      })
      
      return true
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
