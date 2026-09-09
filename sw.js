self.addEventListener("install", e => {
 e.waitUntil(
  caches.open("brain").then(cache => cache.addAll(["./"]))
 );
});

self.addEventListener("fetch", e => {
 e.respondWith(
  caches.match(e.request).then(res => res || fetch(e.request))
 );
});
