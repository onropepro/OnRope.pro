import { useEffect } from 'react';

export function usePWAUpdateCheck() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const checkForUpdate = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.update();
      } catch (error) {
        console.debug('SW update check failed:', error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdate();
      }
    };

    checkForUpdate();

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
