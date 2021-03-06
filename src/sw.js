// change to the version you get from `npm ls workbox-build`
importScripts('workbox-v3.4.1/workbox-sw.js');

var cacheName = 'mspwa-v1';
var appShellFiles = [
  '/',
  '/index.html',
  '/build/app.css',
  '/build/app.js',
  '/build/app/*',
  '/favicon.ico',
  '/offline.html'
];

if ('Notification' in self && 'serviceWorker' in self.navigator) {
  Notification.requestPermission(status => {
    // status will either be 'default', 'granted' or 'denied'
    if (status === 'granted') {
      // TODO
    }
    console.log(`Notification permissions have been ${status}`);
  });
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache;
    }),
  );
});

//If any fetch fails, it will show the offline page.
self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (r) {
      console.log('[Service Worker] Fetching resource: ' + e.request.url);
      return r || fetch(e.request).then(function (response) {
        return caches.open(cacheName).then(function (cache) {
          console.log('[Service Worker] Caching new resource: ' + e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener("message", ({
  data
}) => {
  if (data === "skipWaiting") {
    self.skipWaiting();
  }
});

// the precache manifest will be injected into the following line
self.workbox.precaching.precacheAndRoute([]);
