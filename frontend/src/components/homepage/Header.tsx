import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-purple-600 shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl md:text-3xl font-bold text-white">
              Kigali Women Hub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-purple-200 transition-colors">
              Home
            </Link>
            <Link
              to="/resources"
              className="text-white hover:text-purple-200 transition-colors">
              Resources
            </Link>
            <Link
              to="/community"
              className="text-white hover:text-purple-200 transition-colors">
              Discussion
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center text-white focus:outline-none">
                  <div className="w-8 h-8 bg-purple-300 rounded-full flex items-center justify-center text-purple-800 font-semibold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="ml-2">{user?.name.split(' ')[0]}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}>
                      Your Profile
                    </Link>
                    <Link
                      to="/add-resource"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}>
                      Add Resource
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md font-medium text-purple-600 bg-white hover:bg-purple-100 transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md font-medium text-white border border-white hover:bg-purple-500 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2">
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-purple-500">
            <Link
              to="/"
              className="block py-2 text-white hover:bg-purple-500 px-2 rounded">
              Home
            </Link>
            <Link
              to="/resources"
              className="block py-2 text-white hover:bg-purple-500 px-2 rounded">
              Resources
            </Link>
            <Link
              to="/community"
              className="block py-2 text-white hover:bg-purple-500 px-2 rounded">
              Discussion
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block py-2 text-white hover:bg-purple-500 px-2 rounded">
                  Your Profile
                </Link>
                <Link
                  to="/add-resource"
                  className="block py-2 text-white hover:bg-purple-500 px-2 rounded">
                  Add Resource
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left py-2 text-white hover:bg-purple-500 px-2 rounded">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-white hover:bg-purple-500 px-2 rounded">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-white hover:bg-purple-500 px-2 rounded">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
