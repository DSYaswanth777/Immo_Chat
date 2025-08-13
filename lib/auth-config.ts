import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // For demo purposes, create test admin user
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

          // For demo purposes, create test customer user
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

          return null
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
  },
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
      // If signing in with Google, ensure user has default role
      if (account?.provider === "google" && user?.email) {
        try {
          await prisma.user.upsert({
            where: { email: user.email },
            update: {
              name: user.name,
              image: user.image,
            },
            create: {
              email: user.email,
              name: user.name,
              image: user.image,
              role: "CUSTOMER", // Default role for new Google users
            }
          })
        } catch (error) {
          console.error("Error creating/updating user:", error)
          return false
        }
      }
      return true
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
