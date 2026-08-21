import { useCallback, useSyncExternalStore } from 'react';

/** True while the tab is in the background. */
export function useDocumentHidden(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => document.hidden,
    () => false,
  );
}
