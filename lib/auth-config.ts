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
        if (!credentials?.email || !credentials?.password) return null

        try {
          const user = await prisma.user.findUnique({ where: { email: credentials.email } })
          if (!user || !user.password) return null

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          if (!isPasswordValid) return null

          return { id: user.id, email: user.email, name: user.name, role: user.role }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: { signIn: "/auth/login", error: "/auth/error" },
  debug: process.env.NODE_ENV === "development" && process.env.NEXTAUTH_DEBUG === "true",

  // --- Secure cookies & proxy fix ---
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? `__Secure-next-auth.session-token`
        : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  callbacks: {
    async jwt({ token, user, account }) {
      try {
        if (user) {
          token.id = user.id
          token.role = (user as any).role
        }

        if (account?.provider === "google" && user?.email) {
          const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
          if (dbUser) token.role = dbUser.role
        }
        return token
      } catch (error) {
        console.error("JWT callback error:", error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (token && session.user) {
          (session.user as any).id = token.id as string
          (session.user as any).role = token.role as string
        }
        return session
      } catch (error) {
        console.error("Session callback error:", error)
        return session
      }
    },
    async signIn({ user, account }) {
      try {
        console.log("SignIn callback triggered:", { provider: account?.provider, email: user?.email, userId: user?.id })
        return true
      } catch (error) {
        console.error("SignIn callback error:", error)
        return false
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
