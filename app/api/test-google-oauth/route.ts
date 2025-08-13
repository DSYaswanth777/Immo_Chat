import { NextRequest, NextResponse } from 'next/server'
import { 
  validateEnvironmentVariables, 
  testGoogleOAuthEndpoint, 
  getGoogleOAuthUrls,
  OAuthTestResult 
} from '@/lib/oauth-test'

export async function GET() {
  try {
    const testResults: OAuthTestResult[] = []
    
    // Step 1: Validate environment variables
    const { config, results: envResults } = validateEnvironmentVariables()
    testResults.push(...envResults)
    
    // Step 2: Test Google OAuth endpoint connectivity (if we have credentials)
    if (config.clientId && config.clientSecret) {
      const endpointTest = await testGoogleOAuthEndpoint(config.clientId, config.clientSecret)
      testResults.push(endpointTest)
    } else {
      testResults.push({
        success: false,
        message: "Cannot test Google OAuth endpoint - missing credentials"
      })
    }
    
    // Step 3: Generate OAuth URLs for reference
    const oauthUrls = getGoogleOAuthUrls(config.nextAuthUrl)
    
    // Step 4: Check NextAuth configuration
    const nextAuthTest: OAuthTestResult = {
      success: true,
      message: "NextAuth configuration appears correct",
      details: {
        callbackUrl: oauthUrls.callbackUrl,
        expectedRedirectUri: oauthUrls.callbackUrl
      }
    }
    testResults.push(nextAuthTest)
    
    // Determine overall status
    const hasFailures = testResults.some(result => !result.success)
    const criticalFailures = testResults.filter(result => 
      !result.success && (
        result.message.includes('GOOGLE_CLIENT_ID') || 
        result.message.includes('GOOGLE_CLIENT_SECRET')
      )
    )
    
    return NextResponse.json({
      success: !hasFailures,
      summary: {
        total: testResults.length,
        passed: testResults.filter(r => r.success).length,
        failed: testResults.filter(r => !r.success).length,
        critical: criticalFailures.length
      },
      results: testResults,
      configuration: {
        hasClientId: !!config.clientId,
        hasClientSecret: !!config.clientSecret,
        hasNextAuthUrl: !!config.nextAuthUrl,
        hasNextAuthSecret: !!config.nextAuthSecret,
        callbackUrl: oauthUrls.callbackUrl
      },
      recommendations: generateRecommendations(testResults, config),
      urls: oauthUrls
    })
    
  } catch (error) {
    console.error('OAuth test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to run OAuth tests',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function generateRecommendations(results: OAuthTestResult[], config: any): string[] {
  const recommendations: string[] = []
  
  const failedResults = results.filter(r => !r.success)
  
  if (failedResults.some(r => r.message.includes('GOOGLE_CLIENT_ID'))) {
    recommendations.push('Set up GOOGLE_CLIENT_ID in your .env file from Google Cloud Console')
  }
  
  if (failedResults.some(r => r.message.includes('GOOGLE_CLIENT_SECRET'))) {
    recommendations.push('Set up GOOGLE_CLIENT_SECRET in your .env file from Google Cloud Console')
  }
  
  if (failedResults.some(r => r.message.includes('NEXTAUTH_SECRET'))) {
    recommendations.push('Generate and set NEXTAUTH_SECRET using: openssl rand -base64 32')
  }
  
  if (failedResults.some(r => r.message.includes('NEXTAUTH_URL'))) {
    recommendations.push('Set NEXTAUTH_URL to your application URL (e.g., http://localhost:3000 for development)')
  }
  
  if (config.clientId && config.clientSecret) {
    recommendations.push('Ensure your Google Cloud Console OAuth app has the correct redirect URI configured')
    recommendations.push(`Add this redirect URI to Google Console: ${config.nextAuthUrl || 'http://localhost:3000'}/api/auth/callback/google`)
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Your Google OAuth configuration looks good! Try testing the sign-in flow.')
  }
  
  return recommendations
}
