import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import axios, { AxiosError } from 'axios';
import ResourceFilters, {
  FilterOptions,
} from '../../components/resources/ResourceFilters';
import api from '../../services/api';
import Footer from '../../components/common/Footer';
import { useTranslation } from 'react-i18next';

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  url?: string;
  imageUrl?: string;
  user?: {
    email: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const ResourcesForWomen: React.FC = () => {
  const { t } = useTranslation();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { isAuthenticated, user, token } = useAuth();
  const [filters, setFilters] = useState({
    category: '',
    title: '',
    sortBy: 'newest',
  });
  // Add state to track online status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Debounced fetch resources
  const debouncedFetchResources = useCallback(
    (filterParams: typeof filters) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
            // Build query string from filters
            const params = new URLSearchParams();
            if (filterParams.category)
              params.append('category', filterParams.category);
            if (filterParams.title) params.append('title', filterParams.title);
            if (filterParams.sortBy)
              params.append('sortBy', filterParams.sortBy);

            console.log(
              'Fetching with params:',
              Object.fromEntries(params.entries())
            );

            const response = await api.get(`/resources?${params.toString()}`);
            setResources(response.data);
          } catch (error) {
            console.error('Error fetching resources:', error);
            if (axios.isAxiosError(error)) {
              const axiosError = error as AxiosError<{ message?: string }>;
              if (axiosError.response) {
                setError(
                  axiosError.response.data?.message ||
                    `Failed to fetch resources: ${axiosError.response.status}`
                );
              } else if (axiosError.request) {
                setError(
                  t(
                    'resources.connectionError',
                    'No response received. Please check your connection.'
                  )
                );
              } else {
                setError(`Request error: ${axiosError.message}`);
              }
            } else {
              setError(
                t('resources.unexpectedError', 'An unexpected error occurred')
              );
            }
          } finally {
            setLoading(false);
          }
        };

        fetchData();
      }, 300); // 300ms debounce
    },
    [t]
  );

  useEffect(() => {
    debouncedFetchResources(filters);
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filters, debouncedFetchResources]);

  // Update canEdit function to match the resource structure
  const canEdit = (resource: Resource) => {
    return (
      isAuthenticated && resource.user && user?.email === resource.user.email
    );
  };

  const handleDelete = async (resourceId: string, resourceTitle: string) => {
    if (
      !window.confirm(
        t(
          'resources.deleteConfirm',
          'Are you sure you want to delete "{{title}}"?',
          { title: resourceTitle }
        )
      )
    ) {
      return;
    }

    try {
      // Using axios instead of fetch
      await api.delete(`/resources/${resourceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage(
        t('resources.deleteSuccess', 'Resource deleted successfully!')
      );
      setResources(resources.filter((resource) => resource._id !== resourceId));

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        if (axiosError.response) {
          // Server responded with an error status
          setError(
            axiosError.response.data?.message ||
              `Delete failed: ${axiosError.response.status}`
          );
        } else if (axiosError.request) {
          // Request was made but no response received
          setError(
            t(
              'resources.connectionError',
              'No response from server. Please check your connection.'
            )
          );
        } else {
          // Error configuring the request
          setError(`Request error: ${axiosError.message}`);
        }
      } else {
        // Handle non-Axios errors
        setError(
          t('resources.unexpectedError', 'An unexpected error occurred')
        );
      }
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleFilterChange = (filters: FilterOptions) => {
    setFilters({
      category: filters.category || '',
      title: filters.title || '',
      sortBy: filters.sortBy || 'newest',
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-purple-900">
              {t('resources.title', 'Resources for Women')}
            </h1>
            {isAuthenticated && isOnline && (
              <Link
                to="/add-resource"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                {t('resources.addNew', 'Add New Resource')}
              </Link>
            )}
          </div>
          <ResourceFilters onFilterChange={handleFilterChange} />

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">
                {t('resources.loading', 'Loading resources...')}
              </p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-10 bg-white shadow rounded-lg">
              <p className="text-gray-600">
                {t(
                  'resources.noResources',
                  'No resources found. Be the first to add one!'
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <div
                  key={resource._id}
                  className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
                  <Link to={`/resources/${resource._id}`} className="block">
                    {resource.imageUrl ? (
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={resource.imageUrl}
                          alt={resource.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src =
                              'https://via.placeholder.com/400x200?text=No+Image';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity"></div>
                      </div>
                    ) : (
                      <div className="h-40 bg-purple-50 flex items-center justify-center">
                        <span className="text-purple-300 text-5xl font-light">
                          {resource.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </Link>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-2 flex items-center">
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {resource.category}
                      </span>
                      <span className="ml-auto text-xs text-gray-400">
                        {new Date(resource.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Link
                      to={`/resources/${resource._id}`}
                      className="block mb-2">
                      <h2 className="text-xl font-semibold text-gray-800 hover:text-purple-700 transition-colors">
                        {resource.title}
                      </h2>
                    </Link>

                    <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                      {resource.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/resources/${resource._id}`}
                          className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm">
                          {t('resources.details', 'Details')}
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"></path>
                          </svg>
                        </Link>

                        {resource.url && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-gray-500 hover:text-purple-600 text-sm">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                            {t('resources.visit', 'Visit')}
                          </a>
                        )}
                      </div>

                      {canEdit(resource) && (
                        <div className="flex space-x-3">
                          <Link
                            to={`/edit-resource/${resource._id}`}
                            className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center">
                            <svg
                              className="w-3.5 h-3.5 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                            {t('resources.edit', 'Edit')}
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(resource._id, resource.title)
                            }
                            className="text-sm text-red-600 hover:text-red-800 inline-flex items-center">
                            <svg
                              className="w-3.5 h-3.5 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            {t('resources.delete', 'Delete')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesForWomen;
