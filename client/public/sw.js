// Service Worker for PWA offline support
const CACHE_NAME = "sanket-pwa-v2"; // Updated version to force refresh
const urlsToCache = [
  "/",
  "/feed",
  "/report",
  "/manifest.json",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        // Don't fail installation if some resources can't be cached
        console.warn("Service Worker: Some resources failed to cache", err);
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  // Take control immediately
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        );
      }),
      // Claim all clients immediately
      self.clients.claim()
    ])
  );
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Helper function to check if request is to API/backend
  const isAPIRequest = () => {
    // Check for backend server port (9000)
    if (url.port === "9000" || (url.hostname === "localhost" && url.port === "9000")) {
      return true;
    }
    
    // Check if pathname starts with /api/
    if (url.pathname.startsWith("/api/")) {
      return true;
    }
    
    // Check if request is to a different port than the frontend
    const frontendPort = self.location.port || (self.location.protocol === "https:" ? "443" : "80");
    if (url.hostname === self.location.hostname && url.port && url.port !== frontendPort) {
      return true;
    }
    
    // Check if request is cross-origin (different hostname)
    if (url.hostname !== self.location.hostname && url.protocol.startsWith("http")) {
      return true;
    }
    
    return false;
  };

  // Skip unsupported schemes (chrome-extension://, etc.)
  if (url.protocol === "chrome-extension:" || url.protocol === "moz-extension:") {
    return;
  }

  // Skip API requests entirely - don't intercept them
  if (isAPIRequest()) {
    // Don't intercept - let the browser handle the request naturally
    return;
  }

  // Skip non-GET requests (POST, PUT, DELETE, etc.)
  if (request.method !== "GET") {
    return;
  }

  // Only handle static assets with cache-first strategy
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached response if available
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Fetch from network and cache the response
      return fetch(request)
        .then((response) => {
          // Only cache successful GET responses
          if (request.method === "GET" && response.ok && response.status === 200) {
            // Clone the response for caching
            const responseToCache = response.clone();
            
            // Cache in background (don't block response)
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache).catch((err) => {
                // Silently fail if caching fails (e.g., for chrome-extension URLs)
                // Error will be caught and logged but won't break the request
              });
            });
          }
          
          return response;
        })
        .catch((error) => {
          // Log warning but don't throw - let browser handle error
          console.warn("Service Worker: Network request failed for", request.url);
          // Re-throw to let browser handle naturally
          throw error;
        });
    })
  );
});
