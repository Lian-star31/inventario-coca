const CACHE = 'inventario-v10';
const ARCHIVOS = [
  './', './index.html', './styles.css?v=10', './app.js?v=10', './manifest.json',
  './icons/hero.png', './icons/fondo.png', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-180.png'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // Uno por uno: si un archivo falla, no debe tumbar toda la instalación
    // y dejar el dispositivo sin nada guardado.
    await Promise.all(ARCHIVOS.map(u => c.add(u).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const viejos = (await caches.keys()).filter(k => k !== CACHE);
    await Promise.all(viejos.map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;

  const esPagina = req.mode === 'navigate' || req.destination === 'document';
  e.respondWith(esPagina ? redPrimero(req) : cachePrimero(req));
});

/* La página: red primero para tomar la versión nueva cuando hay internet,
   y la copia guardada cuando no lo hay. */
async function redPrimero(req) {
  const c = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res && res.status === 200) c.put(req, res.clone());
    return res;
  } catch {
    return (await c.match(req))
        || (await c.match('./index.html'))
        || (await c.match('./'))
        || new Response('Sin conexión', { status: 503 });
  }
}

/* Lo demás: caché primero. Los archivos llevan ?v=N, así que subir la
   versión basta para que el dispositivo baje los nuevos. */
async function cachePrimero(req) {
  const c = await caches.open(CACHE);
  const guardado = await c.match(req);
  if (guardado) return guardado;
  try {
    const res = await fetch(req);
    if (res && res.status === 200 && res.type === 'basic') c.put(req, res.clone());
    return res;
  } catch {
    return new Response('', { status: 503 });
  }
}
