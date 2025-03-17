import React from 'react';
import { useNetworkStatus } from '../../context/NetworkStatusContext';
import { processOfflineQueue } from '../../services/api';

const SyncStatus: React.FC = () => {
  const { pendingChangesCount, isSyncing, isOnline } = useNetworkStatus();

  // Don't show if no pending changes and not syncing
  if (pendingChangesCount === 0 && !isSyncing) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 shadow-lg rounded z-50">
      <div className="flex items-center">
        {isSyncing ? (
          <>
            <svg
              className="animate-spin h-4 w-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Syncing your data...</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {pendingChangesCount}{' '}
              {pendingChangesCount === 1 ? 'change' : 'changes'} pending
            </span>
            {isOnline && (
              <button
                onClick={() => processOfflineQueue()}
                className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                Sync now
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SyncStatus;
