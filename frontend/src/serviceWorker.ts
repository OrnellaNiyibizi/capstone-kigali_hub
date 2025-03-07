import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, createHandlerBoundToURL, PrecacheEntry } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst, NetworkOnly } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

declare global {
  interface ServiceWorkerGlobalScope {
    skipWaiting(): Promise<void>;
    __WB_MANIFEST: Array<PrecacheEntry | string>;
  }
}

declare const self: ServiceWorkerGlobalScope & typeof globalThis;
clientsClaim();


// Precache all the assets in the build folder
precacheAndRoute(self.__WB_MANIFEST);


// Cache resources API responses for offline access
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/resources'),
  new NetworkFirst({
    cacheName: 'resources-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache discussions API responses
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/discussions'),
  new NetworkFirst({
    cacheName: 'discussions-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Handle navigation requests with a StaleWhileRevalidate strategy
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new StaleWhileRevalidate({
    cacheName: 'pages-cache',
  })
);

// Set up App Shell fallback - any other requests go to index.html
const handler = createHandlerBoundToURL('/index.html');
registerRoute(
  ({ request }) => request.mode === 'navigate' && !new URL(request.url).pathname.startsWith('/api'),
  handler
);

// Create a queue for background sync
const resourcesQueue = new BackgroundSyncPlugin('resources-queue', {
  maxRetentionTime: 24 * 60 // Retry for up to 24 hours (specified in minutes)
});

const discussionsQueue = new BackgroundSyncPlugin('discussions-queue', {
  maxRetentionTime: 24 * 60 // Retry for up to 24 hours
});

registerRoute(
  ({ url, request }) => url.pathname.startsWith('/api/resources') &&
    (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE'),
  new NetworkOnly({
    plugins: [resourcesQueue]
  }),
  'POST'
);

registerRoute(
  ({ url, request }) => url.pathname.startsWith('/api/discussions') &&
    (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE'),
  new NetworkOnly({
    plugins: [discussionsQueue]
  }),
  'POST'
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event: MessageEvent) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    // This allows the web app to trigger skipWaiting via
    // registration.waiting.postMessage({type: 'SKIP_WAITING'})
    self.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
      }
    });
  }
});