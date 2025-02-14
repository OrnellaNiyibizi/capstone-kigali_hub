import React from 'react';

const CallToAction: React.FC = () => {
  return (
    <>
      <h2 className="self-center mt-6 text-2xl font-semibold leading-none text-center text-black">
        Join Us Today!
      </h2>
      <div className="flex gap-5 self-center mt-2.5 w-64 max-w-full text-center">
        <button className="px-1.5 py-1.5 text-black bg-purple-600 rounded max-md:pr-5">
          Join Now
        </button>
        <button className="px-1.5 py-1.5 text-black bg-gray-300 rounded max-md:pr-5">
          Start Exploring
        </button>
      </div>
    </>
  );
};

export default CallToAction;
