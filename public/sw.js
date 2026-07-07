const CACHE_NAME = __CACHE_NAME__;

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/app-icon.svg",
  "/app-icon-192.png",
  "/app-icon-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      await cache.addAll(APP_SHELL);
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );

      await self.clients.claim();

      // Précharge immédiatement toutes les pages ouvertes.
      const clients = await self.clients.matchAll({
        type: "window",
      });

      for (const client of clients) {
        client.navigate(client.url);
      }
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== location.origin) {
    return;
  }

  // Navigation HTML
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);

          const cache = await caches.open(CACHE_NAME);
          cache.put("/index.html", response.clone());

          return response;
        } catch {
          return (
            (await caches.match("/index.html")) ||
            (await caches.match("/")) ||
            Response.error()
          );
        }
      })(),
    );

    return;
  }

  // Assets : network first, cache fallback
  event.respondWith(
    (async () => {
      try {
        const response = await fetch(request);

        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone());
        }

        return response;
      } catch {
        const cached = await caches.match(request);

        if (cached) {
          return cached;
        }

        return new Response("", {
          status: 404,
          statusText: "Offline",
        });
      }
    })(),
  );
});