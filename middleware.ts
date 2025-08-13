import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')
    const isApiRoute = req.nextUrl.pathname.startsWith('/api')

    // Allow API routes to handle their own auth
    if (isApiRoute) {
      return NextResponse.next()
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect unauthenticated users to login
    if (isDashboard && !isAuth) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    // Check admin routes
    if (req.nextUrl.pathname.startsWith('/dashboard/admin') || req.nextUrl.pathname.startsWith('/dashboard/properties/new')) {
      if (!token || token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow all requests to proceed to the middleware function
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/api/users/:path*',
    '/api/properties/:path*'
  ]
}
