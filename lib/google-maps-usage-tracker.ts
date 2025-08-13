// Google Maps API Usage Tracker
// This provides client-side tracking to complement Google Cloud Console monitoring

interface UsageMetrics {
  mapLoads: number;
  markerClicks: number;
  infoWindowOpens: number;
  searchQueries: number;
  lastReset: string;
  dailyUsage: { [date: string]: number };
}

class GoogleMapsUsageTracker {
  private static instance: GoogleMapsUsageTracker;
  private storageKey = 'google_maps_usage_metrics';
  private metrics: UsageMetrics;

  private constructor() {
    this.metrics = this.loadMetrics();
  }

  static getInstance(): GoogleMapsUsageTracker {
    if (!GoogleMapsUsageTracker.instance) {
      GoogleMapsUsageTracker.instance = new GoogleMapsUsageTracker();
    }
    return GoogleMapsUsageTracker.instance;
  }

  private loadMetrics(): UsageMetrics {
    if (typeof window === 'undefined') {
      return this.getDefaultMetrics();
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Reset daily if it's a new day
        const today = new Date().toISOString().split('T')[0];
        if (parsed.lastReset !== today) {
          parsed.dailyUsage[today] = 0;
          parsed.lastReset = today;
        }
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to load usage metrics:', error);
    }

    return this.getDefaultMetrics();
  }

  private getDefaultMetrics(): UsageMetrics {
    const today = new Date().toISOString().split('T')[0];
    return {
      mapLoads: 0,
      markerClicks: 0,
      infoWindowOpens: 0,
      searchQueries: 0,
      lastReset: today,
      dailyUsage: { [today]: 0 }
    };
  }

  private saveMetrics(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.metrics));
    } catch (error) {
      console.warn('Failed to save usage metrics:', error);
    }
  }

  // Track map load (most important for billing)
  trackMapLoad(): void {
    this.metrics.mapLoads++;
    const today = new Date().toISOString().split('T')[0];
    this.metrics.dailyUsage[today] = (this.metrics.dailyUsage[today] || 0) + 1;
    this.saveMetrics();
    
    // Log for debugging
    console.log(`📍 Google Maps Load #${this.metrics.mapLoads} (Today: ${this.metrics.dailyUsage[today]})`);
  }

  // Track marker interactions
  trackMarkerClick(): void {
    this.metrics.markerClicks++;
    this.saveMetrics();
  }

  // Track info window opens
  trackInfoWindowOpen(): void {
    this.metrics.infoWindowOpens++;
    this.saveMetrics();
  }

  // Track search queries (if using Places API)
  trackSearchQuery(): void {
    this.metrics.searchQueries++;
    this.saveMetrics();
  }

  // Get current usage statistics
  getUsageStats(): UsageMetrics {
    return { ...this.metrics };
  }

  // Get today's usage
  getTodayUsage(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.metrics.dailyUsage[today] || 0;
  }

  // Get usage for specific date
  getUsageForDate(date: string): number {
    return this.metrics.dailyUsage[date] || 0;
  }

  // Get last 7 days usage
  getWeeklyUsage(): { date: string; usage: number }[] {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        usage: this.metrics.dailyUsage[dateStr] || 0
      });
    }
    return result;
  }

  // Estimate monthly cost based on current usage
  estimateMonthlyCost(): {
    mapLoads: number;
    estimatedCost: number;
    dailyAverage: number;
  } {
    const weeklyUsage = this.getWeeklyUsage();
    const totalWeeklyUsage = weeklyUsage.reduce((sum, day) => sum + day.usage, 0);
    const dailyAverage = totalWeeklyUsage / 7;
    const monthlyEstimate = dailyAverage * 30;
    
    // Google Maps JavaScript API pricing: $7 per 1,000 map loads
    const estimatedCost = (monthlyEstimate / 1000) * 7;

    return {
      mapLoads: Math.round(monthlyEstimate),
      estimatedCost: Math.round(estimatedCost * 100) / 100,
      dailyAverage: Math.round(dailyAverage * 100) / 100
    };
  }

  // Reset all metrics (useful for testing)
  resetMetrics(): void {
    this.metrics = this.getDefaultMetrics();
    this.saveMetrics();
  }

  // Export usage data for analysis
  exportUsageData(): string {
    return JSON.stringify({
      ...this.metrics,
      exportDate: new Date().toISOString(),
      weeklyUsage: this.getWeeklyUsage(),
      monthlyEstimate: this.estimateMonthlyCost()
    }, null, 2);
  }
}

export const googleMapsUsageTracker = GoogleMapsUsageTracker.getInstance();

// Usage Analytics Hook for React components
export function useGoogleMapsUsage() {
  const getStats = () => googleMapsUsageTracker.getUsageStats();
  const getTodayUsage = () => googleMapsUsageTracker.getTodayUsage();
  const getWeeklyUsage = () => googleMapsUsageTracker.getWeeklyUsage();
  const getMonthlyEstimate = () => googleMapsUsageTracker.estimateMonthlyCost();

  return {
    trackMapLoad: () => googleMapsUsageTracker.trackMapLoad(),
    trackMarkerClick: () => googleMapsUsageTracker.trackMarkerClick(),
    trackInfoWindowOpen: () => googleMapsUsageTracker.trackInfoWindowOpen(),
    trackSearchQuery: () => googleMapsUsageTracker.trackSearchQuery(),
    getStats,
    getTodayUsage,
    getWeeklyUsage,
    getMonthlyEstimate,
    exportData: () => googleMapsUsageTracker.exportUsageData()
  };
}
