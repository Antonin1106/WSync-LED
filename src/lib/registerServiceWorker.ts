/**
 * Registers the service worker used to enable PWA capabilities.
 */
export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (location.protocol === "file:") return;

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });

    await navigator.serviceWorker.ready;

    console.log("Service Worker ready:", registration);
  } catch (error) {
    console.warn("Service worker registration failed:", error);
  }
}