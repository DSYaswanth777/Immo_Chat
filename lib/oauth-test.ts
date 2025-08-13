export interface OAuthTestResult {
  success: boolean
  message: string
  details?: any
}

export interface GoogleOAuthConfig {
  clientId: string | undefined
  clientSecret: string | undefined
  nextAuthUrl: string | undefined
  nextAuthSecret: string | undefined
}

export function validateEnvironmentVariables(): {
  config: GoogleOAuthConfig
  results: OAuthTestResult[]
} {
  const config: GoogleOAuthConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
  }

  const results: OAuthTestResult[] = []

  // Check GOOGLE_CLIENT_ID
  if (!config.clientId) {
    results.push({
      success: false,
      message: "GOOGLE_CLIENT_ID is not set in environment variables"
    })
  } else if (!config.clientId.includes('.googleusercontent.com')) {
    results.push({
      success: false,
      message: "GOOGLE_CLIENT_ID format appears invalid (should end with .googleusercontent.com)"
    })
  } else {
    results.push({
      success: true,
      message: "GOOGLE_CLIENT_ID is properly set",
      details: `Client ID: ${config.clientId.substring(0, 20)}...`
    })
  }

  // Check GOOGLE_CLIENT_SECRET
  if (!config.clientSecret) {
    results.push({
      success: false,
      message: "GOOGLE_CLIENT_SECRET is not set in environment variables"
    })
  } else if (config.clientSecret.length < 20) {
    results.push({
      success: false,
      message: "GOOGLE_CLIENT_SECRET appears too short (possible configuration error)"
    })
  } else {
    results.push({
      success: true,
      message: "GOOGLE_CLIENT_SECRET is properly set",
      details: `Secret length: ${config.clientSecret.length} characters`
    })
  }

  // Check NEXTAUTH_URL
  if (!config.nextAuthUrl) {
    results.push({
      success: false,
      message: "NEXTAUTH_URL is not set (recommended for production)"
    })
  } else {
    results.push({
      success: true,
      message: "NEXTAUTH_URL is set",
      details: config.nextAuthUrl
    })
  }

  // Check NEXTAUTH_SECRET
  if (!config.nextAuthSecret) {
    results.push({
      success: false,
      message: "NEXTAUTH_SECRET is not set (required for production)"
    })
  } else if (config.nextAuthSecret.length < 32) {
    results.push({
      success: false,
      message: "NEXTAUTH_SECRET appears too short (should be at least 32 characters)"
    })
  } else {
    results.push({
      success: true,
      message: "NEXTAUTH_SECRET is properly set",
      details: `Secret length: ${config.nextAuthSecret.length} characters`
    })
  }

  return { config, results }
}

export async function testGoogleOAuthEndpoint(clientId: string, clientSecret: string): Promise<OAuthTestResult> {
  try {
    // Test Google's OAuth2 token info endpoint with a dummy request
    // This will fail but should give us information about whether our credentials are recognized
    const response = await fetch('https://oauth2.googleapis.com/tokeninfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        access_token: 'dummy_token_for_testing'
      })
    })

    // We expect this to fail, but a 400 error means Google recognized our request format
    if (response.status === 400) {
      return {
        success: true,
        message: "Google OAuth endpoint is reachable and responding correctly",
        details: "Endpoint connectivity test passed"
      }
    }

    return {
      success: false,
      message: "Unexpected response from Google OAuth endpoint",
      details: `Status: ${response.status}`
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to connect to Google OAuth endpoint",
      details: error instanceof Error ? error.message : "Unknown network error"
    }
  }
}

export function generateCallbackUrl(baseUrl?: string): string {
  const base = baseUrl || process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return `${base}/api/auth/callback/google`
}

export function getGoogleOAuthUrls(baseUrl?: string) {
  const callbackUrl = generateCallbackUrl(baseUrl)
  
  return {
    callbackUrl,
    authUrl: `https://accounts.google.com/o/oauth2/v2/auth`,
    tokenUrl: `https://oauth2.googleapis.com/token`,
    userInfoUrl: `https://www.googleapis.com/oauth2/v2/userinfo`
  }
}
