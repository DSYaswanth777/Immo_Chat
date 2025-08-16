"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import { AuthDiagnostics } from "@/lib/auth-diagnostics"

export default function AuthDiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<AuthDiagnostics | null>(null)
  const [loading, setLoading] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/diagnostics')
      const data = await response.json()
      setDiagnostics(data)
    } catch (error) {
      console.error('Failed to run diagnostics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const StatusIcon = ({ status }: { status: boolean }) => {
    return status ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Google OAuth Diagnostics
          </h1>
          <p className="mt-2 text-gray-600">
            Check your Google authentication configuration
          </p>
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={runDiagnostics} 
            disabled={loading}
            className="bg-[#10c03e] hover:bg-[#0ea835]"
          >
            {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Running Diagnostics..." : "Run Diagnostics"}
          </Button>
        </div>

        {diagnostics && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Environment Variables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Environment Variables
                </CardTitle>
                <CardDescription>
                  Required environment variables for Google OAuth
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>GOOGLE_CLIENT_ID</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={diagnostics.envVars.googleClientId} />
                    <Badge variant={diagnostics.envVars.googleClientId ? "default" : "destructive"}>
                      {diagnostics.envVars.googleClientId ? "Set" : "Missing"}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>GOOGLE_CLIENT_SECRET</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={diagnostics.envVars.googleClientSecret} />
                    <Badge variant={diagnostics.envVars.googleClientSecret ? "default" : "destructive"}>
                      {diagnostics.envVars.googleClientSecret ? "Set" : "Missing"}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>NEXTAUTH_SECRET</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={diagnostics.envVars.nextAuthSecret} />
                    <Badge variant={diagnostics.envVars.nextAuthSecret ? "default" : "destructive"}>
                      {diagnostics.envVars.nextAuthSecret ? "Set" : "Missing"}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>NEXTAUTH_URL</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={diagnostics.envVars.nextAuthUrl} />
                    <Badge variant={diagnostics.envVars.nextAuthUrl ? "default" : "secondary"}>
                      {diagnostics.envVars.nextAuthUrl ? "Set" : "Optional"}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>DATABASE_URL</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={diagnostics.envVars.databaseUrl} />
                    <Badge variant={diagnostics.envVars.databaseUrl ? "default" : "destructive"}>
                      {diagnostics.envVars.databaseUrl ? "Set" : "Missing"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Database Connection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Database Connection
                </CardTitle>
                <CardDescription>
                  Database connectivity status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Connection Status</span>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={diagnostics.database.connected} />
                    <Badge variant={diagnostics.database.connected ? "default" : "destructive"}>
                      {diagnostics.database.connected ? "Connected" : "Failed"}
                    </Badge>
                  </div>
                </div>
                
                {diagnostics.database.error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-800">
                      <strong>Error:</strong> {diagnostics.database.error}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            {diagnostics.recommendations.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    Recommendations
                  </CardTitle>
                  <CardDescription>
                    Issues found and recommended fixes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {diagnostics.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Setup Instructions */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Setup Instructions</CardTitle>
                <CardDescription>
                  Follow these steps to configure Google OAuth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-md p-4 text-sm font-mono whitespace-pre-wrap">
{`1. Google Cloud Console Setup:
   - Go to https://console.cloud.google.com/
   - Create/select project
   - Enable Google+ API
   - Create OAuth 2.0 Client ID
   - Add redirect URI: ${window.location.origin}/api/auth/callback/google

2. Environment Variables (.env):
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   NEXTAUTH_URL="${window.location.origin}"

3. Database Setup:
   npm run db:push
   npm run db:generate`}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
