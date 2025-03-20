import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RESOURCE_CATEGORIES } from '../../utils/constants';

interface ResourceFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  category?: string;
  title?: string;
  sortBy?: 'newest' | 'oldest' | 'popular';
}

const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  onFilterChange,
}) => {
  const { t } = useTranslation();

  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    title: '',
    sortBy: 'newest',
  });

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
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4 text-purple-800">
        {t('resourceFilters.title', 'Filter Resources')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1">
            {t('resourceFilters.category', 'Category')}
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500">
            <option value="">
              {t('resourceFilters.allCategories', 'All Categories')}
            </option>
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
            {t('resourceFilters.sortBy', 'Sort By')}
          </label>
          <select
            id="sort"
            value={filters.sortBy}
            onChange={handleSortChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500">
            <option value="newest">
              {t('resourceFilters.newestFirst', 'Newest First')}
            </option>
            <option value="oldest">
              {t('resourceFilters.oldestFirst', 'Oldest First')}
            </option>
            <option value="popular">
              {t('resourceFilters.mostPopular', 'Most Popular')}
            </option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700 mb-1">
          {t('resourceFilters.searchTitle', 'Search by Title')}
        </label>
        <input
          id="search"
          type="text"
          placeholder={t(
            'resourceFilters.searchPlaceholder',
            'Search resources...'
          )}
          value={filters.title}
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <button
        onClick={handleClearFilters}
        className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
        {t('resourceFilters.clearFilters', 'Clear Filters')}
      </button>
    </div>
  );
};

export default ResourceFilters;
