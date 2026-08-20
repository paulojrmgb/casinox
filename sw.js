const CACHE_NAME = "casinox-v4.1";
const VERSION = "4.1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./assets/game-art/lucky-rabbit.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith("casinox-") && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({type:"window", includeUncontrolled:true}))
      .then(clients => clients.forEach(client => client.postMessage({
        type:"CASINOX_UPDATED", version:VERSION
      })))
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if(request.method !== "GET") return;

  const url = new URL(request.url);
  const local = url.origin === self.location.origin;
  if(!local) return;

  // Never let an old cached document boot the old game UI.
  if(request.mode === "navigate" || request.destination === "document"){
    event.respondWith(
      fetch(request, {cache:"no-store"})
        .then(response => response)
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // JS/CSS must always come from the deployed version first.
  const path=url.pathname.toLowerCase();
  const critical = path.endsWith("/app.js") ||
                   path.endsWith("/styles.css") ||
                   path.endsWith("/manifest.json") ||
                   path.endsWith(".html");

  if(critical){
    event.respondWith(
      fetch(request,{cache:"no-store"})
        .then(response => response)
        .catch(() => caches.match(request))
    );
    return;
  }

  // Game artwork: network first, cache fallback.
  if(path.includes("/assets/game-art/") || path.includes("/assets/characters/")){
    event.respondWith(
      fetch(request,{cache:"no-store"})
        .then(response => {
          if(response.ok){
            const copy=response.clone();
            caches.open(CACHE_NAME).then(c=>c.put(request,copy));
          }
          return response;
        })
        .catch(()=>caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response=>{
      if(response.ok){
        const copy=response.clone();
        caches.open(CACHE_NAME).then(c=>c.put(request,copy));
      }
      return response;
    }))
  );
});
