import t from './lang';

/**
 * Registers the service worker used to enable PWA capabilities.
 */
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol === 'file:') return;

  try {
    await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });

    await navigator.serviceWorker.ready;
  } catch (error) {
    console.warn(t('swFailed') + ':', error);
  }
}