let appPrefix = 'kjs';

let appCaches = [
  {
    name: 'kjs-core-20200511.01',
    urls: [
      './',
      './bundle.js',
      './favicon.png',
      './icons.svg',
      './index.html',
      './js/load.js',
      './manifest.json',
      './robots.txt',
      './sw.js'
    ]
  },
  {
    name: 'kjs-css-20200523.01',
    urls: [
      './css/kjs.css',
      './css/font.css'
    ]
  },
  {
    name: 'kjs-font-20200207.01',
    urls: [
      './font/lato-v16-latin-regular.woff2',
      './font/merriweather-v21-latin-regular.woff2',
      './font/open-sans-v17-latin-regular.woff2',
      './font/playfair-display-v20-latin-regular.woff2',
      './font/roboto-slab-v11-latin-regular.woff2',
      './font/roboto-v20-latin-regular.woff2'
    ]
  },
  {
    name: 'kjs-help-20200523.01',
    urls: [
      './help/about.html',
      './help/bookmark.html',
      './help/help.html',
      './help/navigator.html',
      './help/overview.html',
      './help/read.html',
      './help/search.html',
      './help/setting.html',
      './help/strong.html',
      './help/thats-my-king.html'
    ]
  },
  {
    name: 'kjs-json-20200418.01',
    urls: [
      './json/strong.json',
      './json/tome.kjv.json'
    ]
  },
  {
    name: 'kjs-png-20200201.01',
    urls: [
      './favicon.png',
      './png/icon-032.png',
      './png/icon-192.png',
      './png/icon-512.png',
      './png/touch-icon-057.png',
      './png/touch-icon-152.png',
      './png/touch-icon-167.png',
      './png/touch-icon-180.png'
    ]
  }
];

let cacheNames = appCaches.map((cache) => cache.name);

self.addEventListener('install', function(event) {
  event.waitUntil(caches.keys().then(function(keys) {
    let appKeys = keys.filter(key => key.startsWith(appPrefix));
    return Promise.all(appCaches.map(function(appCache) {
      if (appKeys.indexOf(appCache.name) === -1) {
        return caches.open(appCache.name).then(function(cache) {
          console.log(`Caching: ${appCache.name}`);
          return cache.addAll(appCache.urls);
        });
      } else {
        console.log(`Found: ${appCache.name}`);
        return Promise.resolve(true);
      }
    }));
  }));
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      let appKeys = keys.filter(key => key.startsWith(appPrefix));
      return Promise.all(appKeys.map(function(key) {
        if (cacheNames.indexOf(key) === -1) {
          console.log(`Deleting: ${key}`);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response ||
        fetch(event.request).then(function(response) {
          return response;
        });
    }).catch(function(error) {
      console.log('Fetch failed:', error);
    })
  );
});
