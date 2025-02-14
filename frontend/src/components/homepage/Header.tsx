import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="flex flex-col py-6 pr-16 pl-6 w-full text-black bg-purple-600 max-md:px-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-5 justify-between max-md:max-w-full">
        <div className="text-3xl font-bold leading-tight">Kigali Women Hub</div>
        <div className="my-auto text-base">Sign In</div>
      </div>
      <nav className="flex gap-4 self-start mt-4 text-base whitespace-nowrap">
        <div className="grow">
          <a href="/">Home</a>
        </div>
        <div>
          <a href="/resources">Resources</a>
        </div>
        <div>
          <a href="/community">Discussion</a>
        </div>
      </nav>
    </div>
  );
};

export default Header;
