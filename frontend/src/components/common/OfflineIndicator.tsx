// src/components/common/OfflineIndicator.tsx
import React, { useState, useEffect } from 'react';

interface OfflineState {
  isOffline: boolean;
  usingCache: boolean;
  lastOnline: Date | null;
}

const OfflineIndicator: React.FC = () => {
  const [state, setState] = useState<OfflineState>({
    isOffline: !navigator.onLine,
    usingCache: false,
    lastOnline: navigator.onLine ? new Date() : null,
  });

  useEffect(() => {
    const handleOnline = () => {
      setState((prev) => ({
        ...prev,
        isOffline: false,
        lastOnline: new Date(),
      }));
    };

    const handleOffline = () => {
      setState((prev) => ({
        ...prev,
        isOffline: true,
      }));
    };

    const handleUsingCache = (e: Event) => {
      if ((e as CustomEvent).detail?.usingCache) {
        setState((prev) => ({
          ...prev,
          usingCache: true,
        }));

        // Hide the "using cache" message after 5 seconds
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            usingCache: false,
          }));
        }, 5000);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('app-offline', handleUsingCache as EventListener);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener(
        'app-offline',
        handleUsingCache as EventListener
      );
    };
  }, []);

  if (!state.isOffline && !state.usingCache) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      {state.isOffline && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md">
          <div className="flex items-center">
            <svg
              className="h-6 w-6 text-yellow-500 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p>
              <span className="font-bold">You are offline.</span> Some features
              may be limited.
              {state.lastOnline && (
                <span className="block text-xs mt-1">
                  Last online: {state.lastOnline.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {!state.isOffline && state.usingCache && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-md mt-2">
          <div className="flex">
            <svg
              className="h-6 w-6 text-blue-500 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>
              Showing cached content. Connect to the internet for the latest
              updates.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineIndicator;
