import React from 'react';

/**
 * A reusable loading spinner component.
 * Used to display a loading state while data is being fetched.
 */
const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700">
        <span className="sr-only">Loading...</span>
      </div>
      <p className="ml-3 text-purple-800 font-medium">Loading resource...</p>
    </div>
  );
};

export default Loader;
