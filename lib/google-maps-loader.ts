// Optimized Google Maps loader to prevent multiple script inclusions and reduce API costs
class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private isLoaded = false;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;
  private callbacks: (() => void)[] = [];
  private mapInstances: Set<google.maps.Map> = new Set();
  private lastLoadTime = 0;
  private readonly LOAD_COOLDOWN = 1000; // 1 second cooldown between loads

  private constructor() {}

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  async load(): Promise<void> {
    // Implement cooldown to prevent rapid successive loads
    const now = Date.now();
    if (now - this.lastLoadTime < this.LOAD_COOLDOWN) {
      console.log('🚫 Google Maps load request throttled (cooldown active)');
      if (this.loadPromise) {
        return this.loadPromise;
      }
    }

    // If already loaded, resolve immediately
    if (this.isLoaded && typeof google !== 'undefined' && google.maps) {
      return Promise.resolve();
    }

    // If currently loading, return the existing promise
    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript && typeof google !== 'undefined' && google.maps) {
      this.isLoaded = true;
      return Promise.resolve();
    }

    // Start loading
    this.isLoading = true;
    this.lastLoadTime = now;
    
    this.loadPromise = new Promise((resolve, reject) => {
      // If Google Maps is already available
      if (typeof google !== 'undefined' && google.maps) {
        this.isLoaded = true;
        this.isLoading = false;
        resolve();
        return;
      }

      // If script exists but not loaded yet, wait for it
      if (existingScript) {
        const checkLoaded = () => {
          if (typeof google !== 'undefined' && google.maps) {
            this.isLoaded = true;
            this.isLoading = false;
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }

      // Create new script with optimized parameters
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.isLoaded = true;
        this.isLoading = false;
        this.callbacks.forEach(callback => callback());
        this.callbacks = [];
        console.log('✅ Google Maps loaded successfully');
        resolve();
      };

      script.onerror = (error) => {
        this.isLoading = false;
        this.loadPromise = null;
        console.error('❌ Failed to load Google Maps:', error);
        reject(error);
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  // Register a map instance for tracking
  registerMapInstance(map: google.maps.Map): void {
    this.mapInstances.add(map);
    console.log(`📍 Registered map instance. Total active maps: ${this.mapInstances.size}`);
  }

  // Unregister a map instance
  unregisterMapInstance(map: google.maps.Map): void {
    this.mapInstances.delete(map);
    console.log(`📍 Unregistered map instance. Total active maps: ${this.mapInstances.size}`);
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
    return this.isLoaded && typeof google !== 'undefined' && !!google.maps;
  }

  // Cleanup method to help with memory management
  cleanup(): void {
    this.mapInstances.clear();
  }
}

export const googleMapsLoader = GoogleMapsLoader.getInstance();