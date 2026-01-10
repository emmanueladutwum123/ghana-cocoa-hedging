// service-worker.js - FIXED VERSION - Won't interfere with downloads

const CACHE_NAME = 'ghana-cocoa-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/calculator.html',
    '/dashboard.html',
    '/data.html',
    '/research.html',
    '/ml-models.html',
    '/style.css',
    '/script.js',
    '/cocoa-hedging.js',
    '/ml-predictor.js',
    '/ghana-data.js',
    '/research-library.js',
    '/typewriter.js',
    '/seo-optimizer.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap'
];

// Install event - only cache essential files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching essential files');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Fetch event - DO NOT intercept download requests
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Skip caching for:
    // 1. Download requests (blob:, data:, .pdf, .csv, etc.)
    // 2. API requests
    // 3. Non-GET requests
    if (event.request.method !== 'GET' ||
        url.pathname.includes('/api/') ||
        url.protocol === 'blob:' ||
        url.protocol === 'data:' ||
        event.request.url.includes('.pdf') ||
        event.request.url.includes('.csv') ||
        event.request.url.includes('.xlsx') ||
        event.request.url.includes('download')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch new
                return response || fetch(event.request)
                    .then(response => {
                        // Don't cache if not a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    });
            })
            .catch(() => {
                // If both cache and network fail, show offline page
                if (event.request.mode === 'navigate') {
                    return caches.match('/offline.html');
                }
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => self.clients.claim())
    );
});
