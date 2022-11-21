'use strict';

let appCaches = [
  {
    name: 'core-20221120.02',
    urls: [
      '/',
      '/bundle.js',
      '/favicon.png',
      '/help/about.html',
      '/icons.svg',
      '/index.html',
      '/js/load.js',
      '/manifest.json',
      '/robots.txt',
    ]
  },
  {
    name: 'css-20221117.01',
    urls: [
      '/css/kjs.css',
      '/css/font.css',
    ]
  },
  {
    name: 'font-20221117.01',
    urls: [
      '/font/dancing-script-v24-latin-regular.woff2',
      '/font/inconsolata-v31-latin-regular.woff2',
      '/font/merriweather-v30-latin-regular.woff2',
      '/font/noto-serif-hebrew-v20-latin-regular.woff2',
      '/font/open-sans-v34-latin-regular.woff2',
      '/font/roboto-mono-v22-latin-regular.woff2',
      '/font/roboto-slab-v24-latin-regular.woff2',
      '/font/roboto-v30-latin-regular.woff2',
      '/font/shadows-into-light-v15-latin-regular.woff2',
    ]
  },
  {
    name: 'help-20221117.01',
    urls: [
      '/help/bookmark.html',
      '/help/help.html',
      '/help/navigator.html',
      '/help/overview.html',
      '/help/name-mode.html',
      '/help/read.html',
      '/help/search.html',
      '/help/setting.html',
      '/help/strong.html',
      '/help/thats-my-king.html',
    ]
  },
  {
    name: 'json-20221117.01',
    urls: [
      '/json/kjv.json',
      '/json/strong.json',
    ]
  },
  {
    name: 'png-20221117.01',
    urls: [
      '/favicon.png',
      '/png/icon-192.png',
      '/png/icon-512.png',
      '/png/maskable-icon-192.png',
      '/png/maskable-icon-512.png',
    ],
  },
];

let cacheNames = appCaches.map((cache) => cache.name);

self.addEventListener('install', (event) => {
    event.waitUntil(caches.keys().then((keys) => {
      return Promise.all(appCaches.map(async (appCache) => {
        if (keys.indexOf(appCache.name) === -1) {
          const cache = await caches.open(appCache.name);
          console.log(`Caching: ${appCache.name}`);
          return await cache.addAll(appCache.urls);
        } else {
          console.log(`Found: ${appCache.name}`);
          return Promise.resolve(true);
        }
      }));
    }));
    self.skipWaiting();
  });

self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keys) => {
        return Promise.all(keys.map((key) => {
          if (cacheNames.indexOf(key) === -1) {
            console.log(`Deleting: ${key}`);
            return caches.delete(key);
          }
        }));
      })
    );
    self.clients.claim();
  });

self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => response ||
        fetch(event.request).then((response) => response)).catch((error) => {
          console.log('Fetch failed:', error);
        })
    );
  });
