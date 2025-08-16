import { prisma } from "@/lib/prisma"

export interface AuthDiagnostics {
  envVars: {
    googleClientId: boolean
    googleClientSecret: boolean
    nextAuthSecret: boolean
    nextAuthUrl: boolean
    databaseUrl: boolean
  }
  database: {
    connected: boolean
    error?: string
  }
  recommendations: string[]
}

export async function runAuthDiagnostics(): Promise<AuthDiagnostics> {
  const diagnostics: AuthDiagnostics = {
    envVars: {
      googleClientId: !!process.env.GOOGLE_CLIENT_ID,
      googleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      nextAuthUrl: !!process.env.NEXTAUTH_URL,
      databaseUrl: !!process.env.DATABASE_URL,
    },
    database: {
      connected: false,
    },
    recommendations: []
  }

  // Check database connectivity
  try {
    await prisma.$connect()
    await prisma.user.findFirst()
    diagnostics.database.connected = true
  } catch (error) {
    diagnostics.database.connected = false
    diagnostics.database.error = error instanceof Error ? error.message : "Unknown database error"
  } finally {
    await prisma.$disconnect()
  }

  // Generate recommendations
  if (!diagnostics.envVars.googleClientId) {
    diagnostics.recommendations.push("Missing GOOGLE_CLIENT_ID environment variable")
  }
  
  if (!diagnostics.envVars.googleClientSecret) {
    diagnostics.recommendations.push("Missing GOOGLE_CLIENT_SECRET environment variable")
  }
  
  if (!diagnostics.envVars.nextAuthSecret) {
    diagnostics.recommendations.push("Missing NEXTAUTH_SECRET environment variable")
  }
  
  if (!diagnostics.envVars.nextAuthUrl) {
    diagnostics.recommendations.push("Consider setting NEXTAUTH_URL for production deployments")
  }
  
  if (!diagnostics.envVars.databaseUrl) {
    diagnostics.recommendations.push("Missing DATABASE_URL environment variable")
  }
  
  if (!diagnostics.database.connected) {
    diagnostics.recommendations.push(`Database connection failed: ${diagnostics.database.error}`)
  }

  // Google OAuth specific recommendations
  if (diagnostics.envVars.googleClientId && diagnostics.envVars.googleClientSecret) {
    diagnostics.recommendations.push("Ensure Google OAuth redirect URI is set to: http://localhost:3000/api/auth/callback/google (for development)")
    diagnostics.recommendations.push("Verify OAuth consent screen is configured in Google Cloud Console")
  }

  return diagnostics
}

export function generateSetupInstructions(): string {
  return `
# Google OAuth Setup Instructions

## 1. Google Cloud Console Setup
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable Google+ API (or Google Identity API)
4. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
5. Set Application type to "Web application"
6. Add Authorized redirect URIs:
   - Development: http://localhost:3000/api/auth/callback/google
   - Production: https://yourdomain.com/api/auth/callback/google

## 2. Environment Variables
Copy .env.example to .env and fill in the values:
- GOOGLE_CLIENT_ID: From Google Cloud Console
- GOOGLE_CLIENT_SECRET: From Google Cloud Console
- NEXTAUTH_SECRET: Generate with: openssl rand -base64 32
- NEXTAUTH_URL: Your app URL (http://localhost:3000 for development)
- DATABASE_URL: Your MySQL database connection string

## 3. Database Setup
Run the following commands:
npm run db:push
npm run db:generate

## 4. Test the Setup
1. Start the development server: npm run dev
2. Go to /auth/signup
3. Click "Registrati con Google"
4. Check browser console for any errors
`
}
