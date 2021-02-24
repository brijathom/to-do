// Set up the service worker to make the app installable.
// Information can be set to be made available offline.

self.addEventListener("install", function (event) {
    return self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    self.clients.claim();
});

// A fetch event is required to make tha application installable.
self.addEventListener("fetch", function (event) {});
