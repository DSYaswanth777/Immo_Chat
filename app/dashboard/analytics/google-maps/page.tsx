import { GoogleMapsUsageDashboard } from "@/components/dashboard/google-maps-usage-dashboard";

export default function GoogleMapsAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Google Maps Analytics</h1>
        <p className="text-muted-foreground">
          Monitor your Google Maps API usage, costs, and optimization opportunities.
        </p>
      </div>
      
      <GoogleMapsUsageDashboard />
    </div>
  );
}
