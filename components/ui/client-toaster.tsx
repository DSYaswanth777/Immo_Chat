"use client"

import { Toaster } from "sonner"
import { NoSSR } from "@/components/no-ssr"
import { ErrorBoundary } from "@/components/error-boundary"

interface ClientToasterProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center"
  theme?: "light" | "dark" | "system"
  richColors?: boolean
  expand?: boolean
  visibleToasts?: number
  closeButton?: boolean
}

function ToasterFallback() {
  return null // Silent fallback for toast errors
}

export function ClientToaster({
  position = "top-right",
  theme = "system",
  richColors = true,
  expand = true,
  visibleToasts = 4,
  closeButton = false,
  ...props
}: ClientToasterProps) {
  return (
    <NoSSR>
      <ErrorBoundary fallback={ToasterFallback}>
        <Toaster
          position={position}
          theme={theme}
          richColors={richColors}
          expand={expand}
          visibleToasts={visibleToasts}
          closeButton={closeButton}
          {...props}
        />
      </ErrorBoundary>
    </NoSSR>
  )
}
