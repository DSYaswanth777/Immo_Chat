// Optimized Google Maps loader to prevent multiple script inclusions and reduce API costs
class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private isLoaded = false;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;
  private callbacks: (() => void)[] = [];
  private mapInstances: Set<any> = new Set();
  private lastLoadTime = 0;
  private readonly LOAD_COOLDOWN = 2000; // Increased to 2 seconds cooldown between loads
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours cache
  private lastCacheTime = 0;

  private constructor() {}

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  async load(): Promise<void> {
    // Check if we can use cached version
    const now = Date.now();
    if (this.isLoaded && now - this.lastCacheTime < this.CACHE_DURATION) {
      return Promise.resolve();
    }

    // Implement cooldown to prevent rapid successive loads
    if (now - this.lastLoadTime < this.LOAD_COOLDOWN) {
      console.log("🚫 Google Maps load request throttled (cooldown active)");
      if (this.loadPromise) {
        return this.loadPromise;
      }
    }

    // If already loaded, resolve immediately
    if (
      this.isLoaded &&
      typeof window !== "undefined" &&
      window.google &&
      window.google.maps
    ) {
      this.lastCacheTime = now;
      return Promise.resolve();
    }

    // If currently loading, return the existing promise
    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    // Check if script already exists in DOM
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (
      existingScript &&
      typeof window !== "undefined" &&
      window.google &&
      window.google.maps
    ) {
      this.isLoaded = true;
      this.lastCacheTime = now;
      return Promise.resolve();
    }

    // Start loading
    this.isLoading = true;
    this.lastLoadTime = now;

    this.loadPromise = new Promise((resolve, reject) => {
      // If Google Maps is already available
      if (
        typeof window !== "undefined" &&
        window.google &&
        window.google.maps
      ) {
        this.isLoaded = true;
        this.isLoading = false;
        this.lastCacheTime = now;
        resolve();
        return;
      }

      // If script exists but not loaded yet, wait for it
      if (existingScript) {
        const checkLoaded = () => {
          if (
            typeof window !== "undefined" &&
            window.google &&
            window.google.maps
          ) {
            this.isLoaded = true;
            this.isLoading = false;
            this.lastCacheTime = now;
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }
      // Create new script with optimized parameters
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async&v=weekly`;
      console.log('Using API key:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

      script.async = true;
      script.defer = true;

      script.onload = () => {
        // Wait a bit more to ensure Google Maps is fully initialized
        setTimeout(() => {
          this.isLoaded = true;
          this.isLoading = false;
          this.lastCacheTime = now;
          this.callbacks.forEach((callback) => callback());
          this.callbacks = [];
          console.log("✅ Google Maps loaded successfully");
          resolve();
        }, 100);
      };

      script.onerror = (error) => {
        this.isLoading = false;
        this.loadPromise = null;
        console.error("❌ Failed to load Google Maps:", error);
        reject(error);
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  // Register a map instance for tracking
  registerMapInstance(map: any): void {
    this.mapInstances.add(map);
    console.log(
      `📍 Registered map instance. Total active maps: ${this.mapInstances.size}`
    );
  }

  // Unregister a map instance
  unregisterMapInstance(map: any): void {
    this.mapInstances.delete(map);
    console.log(
      `📍 Unregistered map instance. Total active maps: ${this.mapInstances.size}`
    );
  }

  // Get number of active map instances
  getActiveMapCount(): number {
    return this.mapInstances.size;
  }

  onLoad(callback: () => void): void {
    if (this.isLoaded) {
      callback();
    } else {
      this.callbacks.push(callback);
    }
  }

  isGoogleMapsLoaded(): boolean {
    return (
      this.isLoaded &&
      typeof window !== "undefined" &&
      window.google &&
      !!window.google.maps
    );
  }

  // Cleanup method to help with memory management
  cleanup(): void {
    this.mapInstances.clear();
  }

  // Force reload (useful for testing or when cache expires)
  forceReload(): void {
    this.isLoaded = false;
    this.lastCacheTime = 0;
    this.lastLoadTime = 0;
    this.loadPromise = null;
  }
}

export const googleMapsLoader = GoogleMapsLoader.getInstance();
