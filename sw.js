const CACHE_NAME = "casinox-v0.8";
const VERSION = "0.8";

const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=0.8",
  "./app.js?v=0.8",
  "./CasinoX_v0.4_conta.js?v=0.8",
  "./manifest.json",
  "./assets/games/moon-temple.svg",
  "./assets/games/golden-pearls.svg",
  "./assets/games/wild-jungle.svg",
  "./assets/games/neon-roulette.svg",
  "./assets/games/rocket-cash.svg",
  "./assets/games/fortune-gems.svg",
  "./assets/games/royal-crown.svg",
  "./assets/games/dragon-gold.svg"
];

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .catch(() => {})
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key.startsWith("casinox-") && key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
      .then(() =>
        self.clients.matchAll({
          type: "window",
          includeUncontrolled: true
        })
      )
      .then(clients =>
        clients.forEach(client =>
          client.postMessage({
            type: "CASINOX_UPDATED",
            version: VERSION
          })
        )
      )
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  // HTML: network first so deployments appear immediately.
  if (request.mode === "navigate" ||
      request.destination === "document") {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put("./index.html", copy);
          });
          return response;
        })
        .catch(() =>
          caches.match(request)
            .then(cached => cached || caches.match("./index.html"))
        )
    );
    return;
  }

  // Versioned application assets: network first.
  const url = new URL(request.url);
  const isAppAsset =
    url.pathname.endsWith("/app.js") ||
    url.pathname.endsWith("/styles.css") ||
    url.pathname.endsWith("/CasinoX_v0.4_conta.js") ||
    url.pathname.endsWith("/manifest.json");

  if (isAppAsset) {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Other resources: cache first with network fallback.
  event.respondWith(
    caches.match(request)
      .then(cached => {
        if (cached) return cached;

        return fetch(request).then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        });
      })
  );
});
