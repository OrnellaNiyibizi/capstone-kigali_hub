import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="flex flex-col items-start p-6 w-full text-white bg-purple-600 max-sm:p-5">
      <h1 className="text-3xl font-bold leading-tight max-sm:text-2xl">
        Resources for Women in Kigali
      </h1>
      <p className="mt-2 text-base text-white text-opacity-90 max-sm:text-sm">
        Explore job opportunities, events, and short courses tailored for women.
      </p>
    </div>
  );
};

export default Header;
