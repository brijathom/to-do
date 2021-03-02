// Set up the service worker to make the app installable.
// Information can be set to be made available offline.

const staticCacheName = "site-static-v1";
const dynamicCacheName = "site-dynamic-v1";
const assets = [
    "/",
    "/index.html",
    "/favicon.ico",
    "/manifest.json",
    "/browserconfig.xml",
    "/images/safari-pinned-tab.svg",
    "/images/mstile-150x150.png",
    "/images/apple-touch-icon.png",
    "/images/manifest_icons/icon-192x192.png",
    "/images/manifest_icons/icon-512x512.png",
    "/images/manifest_icons/maskable-icon-256x256.png",
    "/scripts/main.js",
    "/styles/main.css",
    "https://use.fontawesome.com/releases/v5.0.13/css/all.css",
    "https://use.fontawesome.com/releases/v5.0.13/webfonts/fa-solid-900.woff2",
    "https://use.fontawesome.com/releases/v5.0.13/webfonts/fa-regular-400.woff2",
    "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2",
    "https://fonts.googleapis.com/css2?family=Roboto",
];

self.addEventListener("install", (event) => {
    // return self.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log("Caching shell assets");
            cache.addAll(assets);
        })
    );
});

self.addEventListener("activate", (event) => {
    // self.clients.claim();
    event.waitUntil(
        caches.keys().then((keys) => {
            // console.log(keys);
            return Promise.all(keys.filter((key) => key !== staticCacheName && key !== dynamicCacheName).map((key) => caches.delete(key)));
        })
    );
});

// A fetch event is required to make tha application installable.
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cacheRes) => {
            return (
                cacheRes ||
                fetch(event.request).then((fetchRes) => {
                    return caches.open(dynamicCacheName).then((cache) => {
                        cache.put(event.request.url, fetchRes.clone());
                        return fetchRes;
                    });
                })
            );
        })
    );
});
