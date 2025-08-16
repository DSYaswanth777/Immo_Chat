import { NextRequest, NextResponse } from "next/server"
import { runAuthDiagnostics } from "@/lib/auth-diagnostics"

export async function GET(request: NextRequest) {
  try {
    const diagnostics = await runAuthDiagnostics()
    return NextResponse.json(diagnostics)
  } catch (error) {
    console.error("Diagnostics error:", error)
    return NextResponse.json(
      { 
        error: "Failed to run diagnostics",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
