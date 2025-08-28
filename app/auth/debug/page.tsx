"use client";

import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface DiagnosticResult {
  name: string;
  status: "success" | "error" | "warning";
  message: string;
  details?: string;
}

export default function AuthDebugPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [origin, setOrigin] = useState(""); // store safe origin

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const runDiagnostics = async () => {
    setIsLoading(true);
    const results: DiagnosticResult[] = [];

    try {
      if (origin) {
        results.push({
          name: "NEXTAUTH_URL",
          status: origin.includes("localhost") ? "warning" : "success",
          message: origin.includes("localhost")
            ? "Running on localhost - ensure NEXTAUTH_URL matches"
            : "Production environment detected",
          details: `Current origin: ${origin}`,
        });
      }

      // Test NextAuth session
      try {
        const session = await getSession();
        setSessionInfo(session);
        results.push({
          name: "NextAuth Session",
          status: session ? "success" : "warning",
          message: session ? "Session available" : "No active session",
          details: session
            ? JSON.stringify(session, null, 2)
            : "Not logged in",
        });
      } catch (error) {
        results.push({
          name: "NextAuth Session",
          status: "error",
          message: "Session check failed",
          details:
            error instanceof Error ? error.message : "Unknown error",
        });
      }

      // Test API diagnostics endpoint
      try {
        const response = await fetch("/api/auth/diagnostics");
        const data = await response.json();

        if (response.ok) {
          results.push({
            name: "Environment Variables",
            status:
              data.envVars.googleClientId &&
              data.envVars.googleClientSecret
                ? "success"
                : "error",
            message:
              data.envVars.googleClientId &&
              data.envVars.googleClientSecret
                ? "Google OAuth credentials configured"
                : "Missing Google OAuth credentials",
            details: `Google ID: ${
              data.envVars.googleClientId ? "✓" : "✗"
            }, Secret: ${data.envVars.googleClientSecret ? "✓" : "✗"}`,
          });

          results.push({
            name: "Database Connection",
            status: data.database.connected ? "success" : "error",
            message: data.database.connected
              ? "Database connected"
              : "Database connection failed",
            details: data.database.error || "Connection successful",
          });
        } else {
          results.push({
            name: "API Diagnostics",
            status: "error",
            message: "Diagnostics API failed",
            details: data.error || "Unknown API error",
          });
        }
      } catch (error) {
        results.push({
          name: "API Diagnostics",
          status: "error",
          message: "Cannot reach diagnostics API",
          details:
            error instanceof Error ? error.message : "Network error",
        });
      }

      // Test Google OAuth flow (without actually signing in)
      try {
        const testResult = await fetch("/api/auth/providers");
        const providers = await testResult.json();

        const hasGoogle =
          providers.google ||
          Object.values(providers).some((p: any) => p.name === "Google");

        results.push({
          name: "Google OAuth Provider",
          status: hasGoogle ? "success" : "error",
          message: hasGoogle
            ? "Google provider configured"
            : "Google provider not found",
          details: JSON.stringify(providers, null, 2),
        });
      } catch (error) {
        results.push({
          name: "Google OAuth Provider",
          status: "error",
          message: "Cannot check OAuth providers",
          details:
            error instanceof Error ? error.message : "Unknown error",
        });
      }
    } catch (error) {
      results.push({
        name: "General Diagnostics",
        status: "error",
        message: "Diagnostics failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }

    setDiagnostics(results);
    setIsLoading(false);
  };

  const testGoogleAuth = async () => {
    try {
      console.log("Testing Google authentication...");

      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/dashboard/properties",
      });

      console.log("Test result:", result);

      if (result?.error) {
        toast.error(`Google Auth Error: ${result.error}`);
      } else {
        toast.success(
          "Google Auth test initiated - check console for details"
        );
      }
    } catch (error) {
      console.error("Test error:", error);
      toast.error("Test failed - check console for details");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  useEffect(() => {
    runDiagnostics();
  }, [origin]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-800">Success</Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-100 text-red-800">Error</Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Google OAuth Debug Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Comprehensive diagnostics for Google authentication issues
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={runDiagnostics} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Running..." : "Run Diagnostics"}
          </Button>
          <Button onClick={testGoogleAuth} variant="outline">
            Test Google Auth
          </Button>
        </div>

        {diagnostics.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {diagnostics.map((diagnostic, index) => (
              <Card
                key={index}
                className={`${
                  diagnostic.status === "error"
                    ? "border-red-200"
                    : diagnostic.status === "warning"
                    ? "border-yellow-200"
                    : "border-green-200"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(diagnostic.status)}
                      {diagnostic.name}
                    </CardTitle>
                    {getStatusBadge(diagnostic.status)}
                  </div>
                  <CardDescription>{diagnostic.message}</CardDescription>
                </CardHeader>
                {diagnostic.details && (
                  <CardContent>
                    <div className="bg-gray-50 rounded-md p-3 text-sm font-mono relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => copyToClipboard(diagnostic.details!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <pre className="whitespace-pre-wrap text-xs overflow-x-auto pr-8">
                        {diagnostic.details}
                      </pre>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {sessionInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Current Session</CardTitle>
              <CardDescription>
                Active NextAuth session information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-md p-4 text-sm font-mono">
                <pre className="whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(sessionInfo, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Quick Fix Instructions</CardTitle>
            <CardDescription>
              Common solutions for Google OAuth issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  1. Environment Variables
                </h4>
                <p>Ensure your `.env` file has correct values:</p>
                <div className="bg-gray-50 rounded-md p-3 mt-2 font-mono text-xs">
                  {`NEXTAUTH_URL=${origin || "http://localhost:3000"}
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret`}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  2. Google Cloud Console
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>
                    Authorized redirect URI:{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      {origin
                        ? `${origin}/api/auth/callback/google`
                        : "/api/auth/callback/google"}
                    </code>
                  </li>
                  <li>Enable Google Identity services</li>
                  <li>Configure OAuth consent screen</li>
                  <li>Ensure client ID and secret match your .env file</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  3. Common Issues
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Clear browser cookies and localStorage</li>
                  <li>Restart development server after env changes</li>
                  <li>
                    Check browser console for detailed error messages
                  </li>
                  <li>
                    Verify database connection and user table schema
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
