"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Copy } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DatabaseTestResult {
  success: boolean
  error?: string
  connectionInfo?: {
    protocol: string
    host: string
    port: string
    database: string
    username: string
    hasPassword: boolean
    status?: string
  }
  details?: string
  recommendations?: string[]
  troubleshooting?: {
    currentDatabaseUrl: string
    errorCode: string
    errorType: string
  }
}

export default function DatabaseSetupPage() {
  const [testResult, setTestResult] = useState<DatabaseTestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDatabaseTest = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/test-database-connection')
      const data = await response.json()
      setTestResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDatabaseTest()
  }, [])

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Database Setup & Troubleshooting</h1>
        <p className="text-muted-foreground">
          Diagnose and fix database connection issues to enable Google OAuth sign-in/sign-up.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button onClick={runDatabaseTest} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Test Database Connection
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {testResult && (
        <div className="space-y-6">
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(testResult.success)}
                Database Connection Status
              </CardTitle>
              <CardDescription>
                Current database connection test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge variant={testResult.success ? "default" : "destructive"}>
                    {testResult.success ? "CONNECTED" : "FAILED"}
                  </Badge>
                </div>
                
                {testResult.error && (
                  <div>
                    <span className="font-medium text-red-600">Error:</span>
                    <p className="text-sm text-red-600 mt-1">{testResult.error}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Connection Details */}
          {testResult.connectionInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Connection Details</CardTitle>
                <CardDescription>
                  Current database configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Host:</Label>
                    <p className="text-sm font-mono bg-muted p-2 rounded mt-1">
                      {testResult.connectionInfo.host}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Port:</Label>
                    <p className="text-sm font-mono bg-muted p-2 rounded mt-1">
                      {testResult.connectionInfo.port}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Database:</Label>
                    <p className="text-sm font-mono bg-muted p-2 rounded mt-1">
                      {testResult.connectionInfo.database}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Username:</Label>
                    <p className="text-sm font-mono bg-muted p-2 rounded mt-1">
                      {testResult.connectionInfo.username}
                    </p>
                  </div>
                </div>
                
                {testResult.troubleshooting && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium">Current DATABASE_URL:</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-mono bg-muted p-2 rounded flex-1 break-all">
                        {testResult.troubleshooting.currentDatabaseUrl}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(testResult.troubleshooting?.currentDatabaseUrl || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {testResult.recommendations && testResult.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>
                  Steps to fix the database connection issue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {testResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Solutions */}
          <Card>
            <CardHeader>
              <CardTitle>Solutions</CardTitle>
              <CardDescription>
                How to fix your database connection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Option 1: Fix Current Database Credentials</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Contact your hosting provider to verify the correct database credentials for `u207318135_immochat`.
                  </p>
                  <div className="bg-muted p-3 rounded text-sm">
                    <p className="font-medium mb-1">Check with your hosting provider:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Verify the database password is correct</li>
                      <li>Ensure the database user has proper permissions</li>
                      <li>Confirm the database exists on srv1882.hstgr.io</li>
                      <li>Check if there are any IP restrictions</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Option 2: Use Local Database for Testing</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Set up a local MySQL database for development and testing.
                  </p>
                  <div className="bg-muted p-3 rounded text-sm space-y-2">
                    <p className="font-medium">Steps:</p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Install MySQL locally or use Docker</li>
                      <li>Create a database: <code className="bg-background px-1 rounded">CREATE DATABASE immochat;</code></li>
                      <li>Update your .env file with local DATABASE_URL</li>
                      <li>Run database setup: <code className="bg-background px-1 rounded">npm run setup</code></li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Option 3: Use SQLite for Quick Testing</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Switch to SQLite temporarily to test Google OAuth functionality.
                  </p>
                  <div className="bg-muted p-3 rounded text-sm">
                    <p className="font-medium mb-1">Update DATABASE_URL in .env:</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-background px-2 py-1 rounded flex-1">
                        DATABASE_URL="file:./dev.db"
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard('DATABASE_URL="file:./dev.db"')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground mt-2">
                      Then update prisma/schema.prisma provider to "sqlite" and run <code>npm run setup</code>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Issue Impact */}
          <Card>
            <CardHeader>
              <CardTitle>Impact on Google OAuth</CardTitle>
              <CardDescription>
                How this database issue affects your authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Google OAuth Credentials: Working ✅</p>
                    <p className="text-sm text-muted-foreground">
                      Your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are valid and Google authentication succeeds.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium">User Account Creation: Failing ❌</p>
                    <p className="text-sm text-muted-foreground">
                      After successful Google authentication, the app cannot save user data to the database, causing the sign-in to fail.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
