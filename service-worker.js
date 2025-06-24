// A very basic service worker for PWA functionality
const CACHE_NAME = 'sheet-sender-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    // Add paths to your icon files here if you create them
    // '/icon-192x192.png',
    // '/icon-512x512.png',
    'https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
    'https://apis.google.com/js/api.js',
    'https://accounts.google.com/gsi/client'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
