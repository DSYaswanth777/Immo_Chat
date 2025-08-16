"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  MapPin, 
  MousePointer, 
  Info, 
  Search,
  TrendingUp,
  DollarSign,
  Download,
  RefreshCw
} from "lucide-react";
import { useGoogleMapsUsage } from "@/lib/google-maps-usage-tracker";

interface UsageStats {
  mapLoads: number;
  markerClicks: number;
  infoWindowOpens: number;
  searchQueries: number;
  lastReset: string;
  dailyUsage: { [date: string]: number };
}

interface WeeklyUsage {
  date: string;
  usage: number;
}

interface MonthlyEstimate {
  mapLoads: number;
  estimatedCost: number;
  dailyAverage: number;
}

export function GoogleMapsUsageDashboard() {
  const {
    getStats,
    getTodayUsage,
    getWeeklyUsage,
    getMonthlyEstimate,
    exportData
  } = useGoogleMapsUsage();

  const [stats, setStats] = useState<UsageStats | null>(null);
  const [todayUsage, setTodayUsage] = useState<number>(0);
  const [weeklyUsage, setWeeklyUsage] = useState<WeeklyUsage[]>([]);
  const [monthlyEstimate, setMonthlyEstimate] = useState<MonthlyEstimate | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to prevent memory leaks and race conditions
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Memoized refresh function to prevent unnecessary re-renders
  const refreshData = useCallback(() => {
    if (!mountedRef.current) return;
    
    try {
      setIsRefreshing(true);
      setError(null);
      
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        if (!mountedRef.current) return;
        
        setStats(getStats());
        setTodayUsage(getTodayUsage());
        setWeeklyUsage(getWeeklyUsage());
        setMonthlyEstimate(getMonthlyEstimate());
        
        // Clear any existing timeout before setting new one
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }
        
        refreshTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            setIsRefreshing(false);
          }
        }, 300); // Reduced timeout for better UX
      });
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
      setError('Failed to refresh data');
      setIsRefreshing(false);
    }
  }, [getStats, getTodayUsage, getWeeklyUsage, getMonthlyEstimate]);

  // Optimized export function with proper DOM cleanup
  const handleExportData = useCallback(() => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link with proper cleanup
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `google-maps-usage-${new Date().toISOString().split('T')[0]}.json`;
      downloadLink.style.display = 'none'; // Hide the element
      
      // Use try-catch for DOM manipulation
      try {
        document.body.appendChild(downloadLink);
        downloadLink.click();
      } catch (domError) {
        console.error('DOM manipulation error during export:', domError);
        // Fallback: try to trigger download without DOM manipulation
        window.open(url, '_blank');
      } finally {
        // Ensure cleanup happens even if there's an error
        try {
          if (downloadLink.parentNode) {
            document.body.removeChild(downloadLink);
          }
        } catch (cleanupError) {
          console.warn('Cleanup error:', cleanupError);
        }
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export data');
    }
  }, [exportData]);

  // Initial data load and interval setup
  useEffect(() => {
    mountedRef.current = true;
    
    // Initial load
    refreshData();
    
    // Set up auto-refresh with longer interval to reduce load
    intervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        refreshData();
      }
    }, 60000); // Increased to 60 seconds to reduce performance impact
    
    // Cleanup function
    return () => {
      mountedRef.current = false;
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [refreshData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const getUsageLevel = (usage: number): { color: string; label: string } => {
    if (usage < 100) return { color: "bg-green-500", label: "Low" };
    if (usage < 500) return { color: "bg-yellow-500", label: "Medium" };
    if (usage < 1000) return { color: "bg-orange-500", label: "High" };
    return { color: "bg-red-500", label: "Very High" };
  };

  // Error boundary
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Google Maps API Usage</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-2">⚠️ {error}</p>
              <Button onClick={refreshData} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (!stats || !monthlyEstimate) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Google Maps API Usage</h3>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#10c03e]"></div>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">Loading usage data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const usageLevel = getUsageLevel(todayUsage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Google Maps API Usage</h3>
          <p className="text-sm text-gray-600">Monitor your API consumption and costs</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            disabled={isRefreshing}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Today's Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Today's Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{todayUsage}</div>
              <p className="text-sm text-gray-600">Map loads today</p>
            </div>
            <Badge 
              variant="secondary" 
              className={`${usageLevel.color} text-white`}
            >
              {usageLevel.label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Usage Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.mapLoads}</div>
                <p className="text-sm text-gray-600">Total Map Loads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MousePointer className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.markerClicks}</div>
                <p className="text-sm text-gray-600">Marker Clicks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Info className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.infoWindowOpens}</div>
                <p className="text-sm text-gray-600">Info Windows</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Search className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.searchQueries}</div>
                <p className="text-sm text-gray-600">Search Queries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weekly Usage Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyUsage.map((day, index) => {
              const maxUsage = Math.max(...weeklyUsage.map(d => d.usage));
              const percentage = maxUsage > 0 ? (day.usage / maxUsage) * 100 : 0;
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              const isToday = day.date === new Date().toISOString().split('T')[0];
              
              return (
                <div key={day.date} className="flex items-center gap-3">
                  <div className="w-12 text-sm text-gray-600">
                    {dayName}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        isToday ? 'bg-[#10c03e]' : 'bg-blue-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm font-medium text-right">
                    {day.usage}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cost Estimation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Monthly Cost Estimation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-[#10c03e]">
                {monthlyEstimate.mapLoads.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Estimated Monthly Loads</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ${monthlyEstimate.estimatedCost}
              </div>
              <p className="text-sm text-gray-600">Estimated Monthly Cost</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {monthlyEstimate.dailyAverage}
              </div>
              <p className="text-sm text-gray-600">Daily Average</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Estimation based on Google Maps JavaScript API pricing 
              ($7 per 1,000 map loads). Actual costs may vary based on usage patterns and other APIs used.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Optimization Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-[#10c03e] rounded-full mt-2"></div>
              <p>Your app already uses a singleton loader to prevent multiple map initializations</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-[#10c03e] rounded-full mt-2"></div>
              <p>Markers and info windows are rendered client-side, saving API calls</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <p>Consider implementing map caching for frequently accessed areas</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <p>Use static maps for property thumbnails to reduce interactive map loads</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
