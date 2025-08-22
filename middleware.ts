import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");

    // Allow change password, forgot password, and set password pages for authenticated users
    const isPasswordManagementPage =
      req.nextUrl.pathname.includes("/change-password") ||
      req.nextUrl.pathname.includes("/forgot-password") ||
      req.nextUrl.pathname.includes("/set-password");

    // Allow API routes to handle their own auth
    if (isApiRoute) {
      return NextResponse.next();
    }

    // Allow authenticated users to access password management pages
    if (isAuthPage && isAuth && isPasswordManagementPage) {
      return NextResponse.next();
    }

    // Redirect authenticated users away from other auth pages (login, signup)
    if (isAuthPage && isAuth && !isPasswordManagementPage) {
      return NextResponse.redirect(new URL("/dashboard/properties", req.url));
    }

    // Check admin routes - only if we have a valid token
    if (
      token &&
      (req.nextUrl.pathname.startsWith("/dashboard/admin") ||
        req.nextUrl.pathname.startsWith("/dashboard/properties/new"))
    ) {
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/properties", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow all requests to proceed to the middleware function
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/api/users/:path*",
    "/api/properties/:path*",
  ],
};
