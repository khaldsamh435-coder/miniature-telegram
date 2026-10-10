const CACHE_NAME = "miyaar-static-v1";
const FILES = ["/", "/index.html", "/assets/style.css", "/assets/app.js", "/manifest.json"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(FILES)).catch(()=>{})); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r=e.request;
  if(r.method!=="GET" || new URL(r.url).origin!==self.location.origin) return;
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE_NAME).then(c=>c.put("/index.html",cp));return res;}).catch(()=>caches.match("/index.html")));return;}
  e.respondWith(caches.match(r).then(cached=>cached||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE_NAME).then(c=>c.put(r,cp));}return res;})));
});