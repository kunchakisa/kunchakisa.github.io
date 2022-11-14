'use strict'
// Establish a cache name
const cacheName = 'website_v1.0.5_001'

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(cacheName)
  await cache.addAll(resources)
  self.skipWaiting()
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache([
      '/',
      '/index.html',
      '/index.css',

      '/secrets/index.html',
      '/secrets/snake.html',
      '/secrets/css/snake.css',
      '/secrets/js/snake.js',
      '/secrets/prepostinfix.html',
      '/secrets/js/prepostinfix.js',

      '/service-worker-registrar.js',
      '/img/bg-header.jpg',
      '/img/logo.png',
      '/img/self.png',
      '/img/sns-fb.svg',
      '/img/sns-ig.svg',
      '/img/sns-li.svg',
      '/img/sns-tw.svg',
    ])
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (cacheName !== key) {
              return caches.delete(key)
            }
          })
        )
      )
      .then(() => {
        console.log('Cleaned cache!')
      })
  )
})

self.addEventListener('fetch', (event) => {
  // If, request is an image
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open(cacheName).then((cache) => {
        // Go to the cache first
        return cache.match(event.request.url).then((cachedResponse) => {
          // Return a cached response if we have one
          if (cachedResponse) {
            return cachedResponse
          }

          // Otherwise, hit the network
          return fetch(event.request).then((fetchedResponse) => {
            // Add the network response to the cache for later visits
            cache.put(event.request, fetchedResponse.clone())

            // Return the network response
            return fetchedResponse
          })
        })
      })
    )
  } else {
    // Open the cache
    event.respondWith(
      caches.open(cacheName).then((cache) => {
        // Go to the network first
        return fetch(event.request.url)
          .then((fetchedResponse) => {
            cache.put(event.request, fetchedResponse.clone())

            return fetchedResponse
          })
          .catch(() => {
            // If the network is unavailable, get
            return cache.match(event.request.url)
          })
      })
    )
  }
})
