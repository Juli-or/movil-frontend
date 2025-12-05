/* eslint-disable no-restricted-globals */
const APP_VERSION = '1.0.0';
const CACHE_NAME = `app-cache-v${APP_VERSION}`;
const DYNAMIC_CACHE = `dynamic-cache-v${APP_VERSION}`;

const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/login',
  '/register'
];

// Archivos importantes pero no críticos
const IMPORTANT_ASSETS = [
  '/AdminView',
  '/admin',
  '/login',
  './1.png',
  '/catalogo',
  '/produto/:id',
  '/blog',
  '/ofertas',
  '/configuracion'

];

// Instalación - Cachea archivos críticos
self.addEventListener('install', event => {
  console.log('[SW] Instalando versión:', APP_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cacheando recursos críticos');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => {
        console.log('[SW] Instalación completada');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Error en instalación:', error);
      })
  );
});

// Activación - Limpieza de caches antiguos
self.addEventListener('activate', event => {
  console.log('[SW] Activando versión:', APP_VERSION);
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Eliminar caches que no sean las actuales
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
            console.log('[SW] Eliminando cache antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
    .then(() => {
      // Pre-cache recursos importantes después de activación
      return precacheImportantAssets();
    })
  );
});

// Pre-cache de recursos importantes
async function precacheImportantAssets() {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  // URLs importantes para el funcionamiento de la app
  const importantUrls = [
    // Añade aquí las rutas importantes de tu app
    '/static/css/main.css',
    '/static/js/main.js'
  ];
  
  for (const url of importantUrls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
        console.log('[SW] Pre-cached:', url);
      }
    } catch (error) {
      console.warn('[SW] No se pudo pre-cachear:', url);
    }
  }
}

// Estrategia de fetch para móvil
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Solo manejar solicitudes GET y del mismo origen
  if (request.method !== 'GET' || !url.origin.startsWith(self.location.origin)) {
    return;
  }
  
  // Para APIs, usar Network First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(apiStrategy(request));
    return;
  }
  
  // Para HTML/navegación, usar Network First con fallback a cache
  if (request.mode === 'navigate') {
    event.respondWith(navigationStrategy(request));
    return;
  }
  
  // Para assets estáticos, usar Cache First
  event.respondWith(staticAssetStrategy(request));
});

// Estrategia para navegación (páginas HTML)
async function navigationStrategy(request) {
  try {
    // Primero intentar red
    const networkResponse = await fetch(request);
    
    // Si es exitosa, actualizar cache
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback a cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Último fallback: index.html (para SPA)
    return caches.match('/index.html');
  }
}

// Estrategia para assets estáticos
async function staticAssetStrategy(request) {
  // Primero buscar en cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // Actualizar cache en segundo plano
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  try {
    // Si no está en cache, ir a red
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Guardar en cache dinámica
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Si no hay conexión y es una imagen, devolver placeholder
    if (request.url.match(/\.(png|jpg|jpeg|gif|svg)$/i)) {
      return getImagePlaceholder();
    }
    
    // Para fuentes, devolver respuesta vacía
    if (request.url.match(/\.(woff|woff2|ttf)$/i)) {
      return new Response('', { status: 404 });
    }
    
    throw error;
  }
}

// Estrategia para APIs
async function apiStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    // Network First para APIs
    const networkResponse = await fetch(request);
    
    // Si es exitosa, guardar en cache (solo para GET)
    if (networkResponse.ok && request.method === 'GET') {
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback a cache solo para GET
    if (request.method === 'GET') {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    // Devolver error apropiado
    return new Response(
      JSON.stringify({ error: 'Sin conexión', offline: true }),
      {
        status: 408,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Actualizar cache en segundo plano
function updateCacheInBackground(request) {
  fetch(request)
    .then(response => {
      if (response.ok) {
        caches.open(DYNAMIC_CACHE)
          .then(cache => cache.put(request, response));
      }
    })
    .catch(() => {
      // Silenciar errores en actualización en segundo plano
    });
}

// Placeholder para imágenes offline
function getImagePlaceholder() {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
      <rect width="200" height="150" fill="#f5f5f5"/>
      <text x="100" y="75" text-anchor="middle" dy=".3em" fill="#ccc" font-family="Arial" font-size="14">
        Imagen no disponible offline
      </text>
    </svg>`,
    {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache'
      }
    }
  );
}

// Manejo de mensajes desde la app
self.addEventListener('message', async event => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      await self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      await caches.delete(CACHE_NAME);
      await caches.delete(DYNAMIC_CACHE);
      break;
      
    case 'GET_CACHE_INFO':
      const cacheNames = await caches.keys();
      const cacheInfo = await Promise.all(
        cacheNames.map(async name => {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          return {
            name,
            size: keys.length
          };
        })
      );
      
      event.ports[0].postMessage(cacheInfo);
      break;
  }
});