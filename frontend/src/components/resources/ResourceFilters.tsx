import React, { useState } from 'react';
import { RESOURCE_CATEGORIES } from '../../utils/constants';

interface ResourceFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  category?: string;
  title?: string;
  sortBy?: 'newest' | 'oldest' | 'popular';
  // Removed tags property
}

const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    title: '',
    sortBy: 'newest',
    // Removed tags from initial state
  });

  // Removed availableTags array

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, category: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, title: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Removed handleTagChange function

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = {
      ...filters,
      sortBy: e.target.value as FilterOptions['sortBy'],
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const newFilters: FilterOptions = {
      category: '',
      title: '',
      sortBy: 'newest',
      // Removed tags from clear filters
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4 text-purple-800">
        Filter Resources
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500">
            <option value="">All Categories</option>
            {RESOURCE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="sort"
            className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sort"
            value={filters.sortBy}
            onChange={handleSortChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700 mb-1">
          Search by Title
        </label>
        <input
          id="search"
          type="text"
          placeholder="Search resources..."
          value={filters.title}
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      {/* Removed the tags section */}

      <button
        onClick={handleClearFilters}
        className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
        Clear Filters
      </button>
    </div>
  );
};

export default ResourceFilters;
