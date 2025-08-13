// Global Google Maps loader to prevent multiple script inclusions
class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private isLoaded = false;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;
  private callbacks: (() => void)[] = [];

  private constructor() {}

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  async load(): Promise<void> {
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

      // Create new script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.isLoaded = true;
        this.isLoading = false;
        this.callbacks.forEach(callback => callback());
        this.callbacks = [];
        resolve();
      };

      script.onerror = (error) => {
        this.isLoading = false;
        this.loadPromise = null;
        reject(error);
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
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
}

export const googleMapsLoader = GoogleMapsLoader.getInstance();
