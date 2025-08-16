"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { ErrorBoundary } from "@/components/error-boundary"

interface ProvidersProps {
  children: ReactNode
}

function SessionErrorFallback({ error, resetError }: { error?: Error; resetError?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-xl font-semibold text-red-600 mb-2">Session Error</h2>
      <p className="text-sm text-gray-600 mb-4">
        There was an issue with your session. Please try refreshing the page.
      </p>
      <div className="space-x-2">
        <button
          onClick={resetError}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  )
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary 
      fallback={SessionErrorFallback}
      onError={(error, errorInfo) => {
        console.error("Session Provider Error:", error, errorInfo)
      }}
    >
      <SessionProvider>
        {children}
      </SessionProvider>
    </ErrorBoundary>
  )
}
