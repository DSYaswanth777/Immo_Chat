# Google OAuth Setup Guide for Immochat

## 🔍 Issue Diagnosis
The Google signup functionality is not working because the required Google OAuth credentials are missing from the environment variables. This guide will help you set up Google OAuth properly.

## 🛠️ Quick Fix Steps

### Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select Project**
   - Create a new project or select an existing one
   - Note the project name for reference

3. **Enable Required APIs**
   - Go to "APIs & Services" > "Library"
   - Search for and enable:
     - Google+ API (or Google Identity API)
     - Google OAuth2 API

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application" as application type
   - Set the name (e.g., "Immochat OAuth")

5. **Configure Authorized Redirect URIs**
   Add these URIs based on your environment:
   
   **For Development:**
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   
   **For Production:**
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

6. **Save and Copy Credentials**
   - Copy the "Client ID" and "Client Secret"
   - Keep these secure and never commit them to version control

### Step 2: Configure Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the .env file and add your credentials:**
   ```env
   # Database Configuration
   DATABASE_URL="mysql://username:password@localhost:3306/immochat"

   # NextAuth Configuration
   NEXTAUTH_SECRET="your-nextauth-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

3. **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

### Step 3: Test the Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Run diagnostics:**
   - Visit: http://localhost:3000/auth/diagnostics
   - Click "Run Diagnostics" to verify configuration

3. **Test Google signup:**
   - Visit: http://localhost:3000/auth/signup
   - Click "Registrati con Google"
   - Should redirect to Google OAuth consent screen

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. "Google OAuth not configured: Missing GOOGLE_CLIENT_ID"
- **Cause:** Environment variables not set
- **Solution:** Follow Step 2 above to configure .env file

#### 2. "Error 400: redirect_uri_mismatch"
- **Cause:** Redirect URI not configured in Google Cloud Console
- **Solution:** Add the correct redirect URI in Google Cloud Console (Step 1.5)

#### 3. "Error 403: access_denied"
- **Cause:** OAuth consent screen not configured or app not verified
- **Solution:** Configure OAuth consent screen in Google Cloud Console

#### 4. Database connection errors
- **Cause:** DATABASE_URL not configured or database not accessible
- **Solution:** Verify database connection string and ensure database is running

### Debug Mode
The application runs in debug mode during development, providing detailed logs in the console. Check the browser console and terminal for detailed error messages.

## 📋 Verification Checklist

- [ ] Google Cloud project created
- [ ] Google+ API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Redirect URIs configured
- [ ] .env file configured with all required variables
- [ ] NEXTAUTH_SECRET generated
- [ ] Development server running
- [ ] Diagnostics page shows all green checkmarks
- [ ] Google signup button redirects to Google OAuth

## 🚀 Production Deployment

For production deployment, ensure:

1. **Environment Variables:**
   - Set all environment variables in your hosting platform
   - Use production URLs for NEXTAUTH_URL
   - Use production database URL

2. **Google Cloud Console:**
   - Add production redirect URIs
   - Configure OAuth consent screen for external users
   - Consider app verification for production use

3. **Security:**
   - Never expose client secrets in client-side code
   - Use secure, randomly generated NEXTAUTH_SECRET
   - Enable HTTPS for production

## 📞 Support

If you continue to experience issues:

1. Check the diagnostics page: `/auth/diagnostics`
2. Review browser console for error messages
3. Check server logs for detailed error information
4. Verify all environment variables are correctly set

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
