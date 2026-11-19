// Photo Blaster service worker — cache-first, ignores the ?cache-bust query strings
const CACHE = "photoblaster-v1";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./","index.html","manifest.webmanifest","photo_blaster_manifest.txt"])).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  // Network-first for the manifest/index so edits show up; cache-first for assets
  const fresh = /index\.html$|photo_blaster_manifest\.txt$|\/$/.test(new URL(req.url).pathname);
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (!fresh && hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok) cache.put(new Request(req.url.split("?")[0]), res.clone());
      return res;
    } catch (err) { if (hit) return hit; throw err; }
  })());
});
