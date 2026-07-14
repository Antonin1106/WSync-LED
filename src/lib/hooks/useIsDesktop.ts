// lib/hooks/useIsDesktop.ts
// Custom React hook to determine if the current viewport width corresponds to a desktop layout (minimum width of 780px).

import { useEffect, useState } from 'react';

/**
 * Custom React hook to determine if the current viewport width corresponds to a desktop layout (minimum width of 780px).
 * @returns A boolean indicating whether the viewport is in desktop mode.
 */
export default function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    window.matchMedia('(min-width: 780px)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(min-width: 780px)');

    const onChange = () => setIsDesktop(media.matches);

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
}