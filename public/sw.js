const CACHE_NAME = 'utility-hub-v2';
const STATIC_CACHE = 'utility-hub-static-v2';
const RUNTIME_CACHE = 'utility-hub-runtime-v2';

const CORE_ASSETS = [
    '/',
    '/index.html',
    '/offline.html',
    '/404.html',
    '/favicon.ico',
    '/icon.svg',
    '/manifest.json'
];

// Install Event - Precache Core Assets
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            return cache.addAll(CORE_ASSETS);
        })
    );
});

// Activate Event - Clean Old Caches and Claim Clients
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    const validCaches = [CACHE_NAME, STATIC_CACHE, RUNTIME_CACHE];
                    if (!validCaches.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Listen for message to skip waiting (Update Flow)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Fetch Event - Routing Strategies
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Ignore non-GET requests, browser extensions, and APIs with secrets
    if (request.method !== 'GET' || (url.protocol !== 'http:' && url.protocol !== 'https:')) {
        return;
    }
    
    // Security: Do not cache sensitive endpoints (if any in future)
    if (url.pathname.startsWith('/api/secure')) {
        return;
    }

    // HTML Navigation - Network First, fallback to Offline Page
    if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    return caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    });
                })
                .catch(() => {
                    return caches.match(request).then((cachedResponse) => {
                        return cachedResponse || caches.match('/offline.html');
                    });
                })
        );
        return;
    }

    // Static Assets (Fonts, Images, Manifest) - Cache First
    const isStaticAsset = request.destination === 'image' || request.destination === 'font' || url.pathname.endsWith('.json');
    if (isStaticAsset) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        const responseClone = networkResponse.clone();
                        caches.open(STATIC_CACHE).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return networkResponse;
                }).catch(() => {
                    // Fallback for images if needed
                });
            })
        );
        return;
    }

    // JS/CSS - Stale While Revalidate
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            const fetchPromise = fetch(request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(request, networkResponse.clone());
                        // Cache Management - Prevent unlimited growth (e.g., limit to 50 items)
                        limitCacheSize(RUNTIME_CACHE, 50);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Ignore network errors in SWR
            });

            return cachedResponse || fetchPromise;
        })
    );
});

// Helper for Cache Management
async function limitCacheSize(name, size) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    if (keys.length > size) {
        await cache.delete(keys[0]);
        limitCacheSize(name, size);
    }
}

// Background Support Architecture
self.addEventListener('sync', (event) => {
    // Placeholder for background sync
    if (event.tag === 'sync-data') {
        console.log('Background sync triggered');
    }
});

self.addEventListener('push', (event) => {
    // Placeholder for push notifications
    const payload = event.data ? event.data.text() : 'No payload';
    console.log('Push received:', payload);
});

self.addEventListener('periodicsync', (event) => {
    // Placeholder for periodic background sync
    console.log('Periodic sync triggered');
});
