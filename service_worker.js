const CACHE_NAME = "site-static-v1";
const DYNAMIC_CACHE_NAME = "site-dynamic-v1";
var urlsToCache = [
    "/",
    "/index.html",
    "/scripts/main.js",
    "/styles/main.css",
    "/manifest.json",
    "/browserconfig.xml",
    "/favicon.ico",
    "/images/manifest_icons/maskable-icon-512x512.png",
    "/images/manifest_icons/icon-512x512.png",
    "/images/manifest_icons/icon-192x192.png",
    "/images/other_images/apple-touch-icon.png",
    "/images/other_images/safari-pinned-tab.svg",
    "/images/other_images/mstile-150x150.png",
    "https://use.fontawesome.com/releases/v5.0.13/css/all.css",
    "https://use.fontawesome.com/releases/v5.0.13/webfonts/fa-solid-900.woff2",
    "https://use.fontawesome.com/releases/v5.0.13/webfonts/fa-regular-400.woff2",
    "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2",
    "https://fonts.googleapis.com/css2?family=Roboto",
];

self.addEventListener("install", function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("activate", function (event) {
    var cacheAllowlist = [CACHE_NAME, DYNAMIC_CACHE_NAME];

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheAllowlist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            // Cache hit - return response
            if (response) {
                return response;
            }

            return fetch(event.request).then(function (response) {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== "basic") {
                    return response;
                }

                // IMPORTANT: Clone the response. A response is a stream
                // and because we want the browser to consume the response
                // as well as the cache consuming the response, we need
                // to clone it so we have two streams.
                var responseToCache = response.clone();

                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});
