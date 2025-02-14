import React from 'react';

const SearchBar: React.FC = () => {
  return (
    <form>
      <label htmlFor="searchInput" className="sr-only">Search discussions</label>
      <input
        id="searchInput"
        type="text"
        placeholder="Search discussions..."
        className="p-3 w-full text-base text-gray-500 bg-white rounded border border-gray-300 border-solid"
      />
    </form>
  );
};

export default SearchBar;