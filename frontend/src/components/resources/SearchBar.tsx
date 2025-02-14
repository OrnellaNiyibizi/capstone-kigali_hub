import React from 'react';

const SearchBar: React.FC = () => {
  return (
    <form className="flex px-5 py-0 mx-auto mt-10 mb-0 w-full max-w-[848px] max-sm:flex-col max-sm:gap-2">
      <label htmlFor="searchInput" className="sr-only">
        Search resources
      </label>
      <input
        id="searchInput"
        type="text"
        placeholder="Search resources..."
        className="grow p-3 text-base rounded border border-gray-300 border-solid border-r-[none] max-sm:w-full max-sm:rounded"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-purple-600 rounded-none cursor-pointer border-[none] text-[white] max-sm:w-full max-sm:rounded">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
