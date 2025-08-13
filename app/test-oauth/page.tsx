"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react'

interface OAuthTestResult {
  success: boolean
  message: string
  details?: any
}

interface TestResponse {
  success: boolean
  summary: {
    total: number
    passed: number
    failed: number
    critical: number
  }
  results: OAuthTestResult[]
  configuration: {
    hasClientId: boolean
    hasClientSecret: boolean
    hasNextAuthUrl: boolean
    hasNextAuthSecret: boolean
    callbackUrl: string
  }
  recommendations: string[]
  urls: {
    callbackUrl: string
    authUrl: string
    tokenUrl: string
    userInfoUrl: string
  }
}

export default function TestOAuthPage() {
  const [testResults, setTestResults] = useState<TestResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runTests = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/test-google-oauth')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to run tests')
      }
      
      setTestResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? "default" : "destructive"}>
        {success ? "PASS" : "FAIL"}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Google OAuth Configuration Test</h1>
        <p className="text-muted-foreground">
          Test your Google OAuth credentials and configuration to ensure proper setup.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button onClick={runTests} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Tests
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

      {testResults && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(testResults.success)}
                Test Summary
              </CardTitle>
              <CardDescription>
                Overall configuration status and test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{testResults.summary.total}</div>
                  <div className="text-sm text-muted-foreground">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{testResults.summary.passed}</div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{testResults.summary.failed}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{testResults.summary.critical}</div>
                  <div className="text-sm text-muted-foreground">Critical</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Status */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration Status</CardTitle>
              <CardDescription>
                Environment variables and configuration check
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span>Google Client ID</span>
                  {getStatusBadge(testResults.configuration.hasClientId)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Google Client Secret</span>
                  {getStatusBadge(testResults.configuration.hasClientSecret)}
                </div>
                <div className="flex items-center justify-between">
                  <span>NextAuth URL</span>
                  {getStatusBadge(testResults.configuration.hasNextAuthUrl)}
                </div>
                <div className="flex items-center justify-between">
                  <span>NextAuth Secret</span>
                  {getStatusBadge(testResults.configuration.hasNextAuthSecret)}
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium mb-1">Callback URL:</div>
                <div className="text-sm font-mono break-all">{testResults.configuration.callbackUrl}</div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Test Results</CardTitle>
              <CardDescription>
                Individual test results and diagnostics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.results.map((result, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getStatusIcon(result.success)}
                    <div className="flex-1">
                      <div className="font-medium">{result.message}</div>
                      {result.details && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {typeof result.details === 'string' 
                            ? result.details 
                            : JSON.stringify(result.details, null, 2)
                          }
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {testResults.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>
                  Steps to fix any configuration issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {testResults.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Test Google Sign-In */}
          <Card>
            <CardHeader>
              <CardTitle>Test Google Sign-In</CardTitle>
              <CardDescription>
                Try the actual Google OAuth flow to verify everything works end-to-end
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <GoogleAuthButton text="Test Google Sign-In" />
                <div className="text-sm text-muted-foreground">
                  Click the button above to test the complete Google OAuth flow. 
                  If configured correctly, you should be redirected to Google for authentication.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* OAuth URLs Reference */}
          <Card>
            <CardHeader>
              <CardTitle>OAuth URLs Reference</CardTitle>
              <CardDescription>
                Important URLs for your Google OAuth configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium">Callback URL (add this to Google Console):</div>
                  <div className="text-sm font-mono bg-muted p-2 rounded mt-1 break-all">
                    {testResults.urls.callbackUrl}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Google Auth URL:</div>
                  <div className="text-sm font-mono bg-muted p-2 rounded mt-1 break-all">
                    {testResults.urls.authUrl}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Google Token URL:</div>
                  <div className="text-sm font-mono bg-muted p-2 rounded mt-1 break-all">
                    {testResults.urls.tokenUrl}
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
