import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/homepage/Header';
import axios, { AxiosError } from 'axios';
import ResourceFilters from '../../components/resources/ResourceFilters';
import api from '../../services/api';

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

  const fetchResources = async () => {
    setLoading(true);
    try {
      // Build query string from filters
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.title) params.append('title', filters.title);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const response = await api.get(`/api/resources?${params.toString()}`);
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [filters]);

  // Update canEdit function to match the resource structure
  const canEdit = (resource: Resource) => {
    return (
      isAuthenticated && resource.user && user?.email === resource.user.email
    );
  };

  const handleDelete = async (resourceId: string, resourceTitle: string) => {
    if (
      !window.confirm(`Are you sure you want to delete "${resourceTitle}"?`)
    ) {
      return;
    }

    try {
      // Using axios instead of fetch
      await api.delete(`/api/resources/${resourceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage('Resource deleted successfully!');
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
          setError('No response from server. Please check your connection.');
        } else {
          // Error configuring the request
          setError(`Request error: ${axiosError.message}`);
        }
      } else {
        // Handle non-Axios errors
        setError('An unexpected error occurred');
      }
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleFilterChange = (newFilters: {
    category: string;
    title: string;
    sortBy: string;
  }) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          search
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-purple-900">
              Resources for Women
            </h1>
            {isAuthenticated && (
              <Link
                to="/add-resource"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                Add New Resource
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
              <p className="mt-2 text-gray-600">Loading resources...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-10 bg-white shadow rounded-lg">
              <p className="text-gray-600">
                No resources found. Be the first to add one!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <div
                  key={resource._id}
                  className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {resource.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={resource.imageUrl}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src =
                            'https://via.placeholder.com/400x200?text=No+Image';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                      {resource.category}
                    </span>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {resource.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {resource.description}
                    </p>
                    <div className="flex justify-between items-center">
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800">
                          Visit Resource
                        </a>
                      )}
                      {canEdit(resource) && (
                        <div className="flex space-x-3">
                          <Link
                            to={`/edit-resource/${resource._id}`}
                            className="text-sm text-blue-600 hover:text-blue-800">
                            Edit
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(resource._id, resource.title)
                            }
                            className="text-sm text-red-600 hover:text-red-800">
                            Delete
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
    </div>
  );
};

export default ResourcesForWomen;
