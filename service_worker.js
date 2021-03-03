const staticCacheName = "site-static-v1";
const dynamicCacheName = "site-dynamic-v1";
const assets = [
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

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            cache.addAll(assets);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.filter((key) => key !== staticCacheName && key !== dynamicCacheName).map((key) => caches.delete(key)));
        })
    );
});

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
