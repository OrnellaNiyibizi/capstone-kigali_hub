import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import api from '../../services/api';
import { RESOURCE_CATEGORIES } from '../../utils/constants';

const AddEditResource: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch resource data if editing
  useEffect(() => {
    if (isEditing) {
      setLoading(true);

      axios
        .get(`/api/resources/${id}`)
        .then((response) => {
          const data = response.data;
          setTitle(data.title);
          setDescription(data.description);
          setCategory(data.category);
          setUrl(data.url || '');
          setImageUrl(data.imageUrl || '');
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{
              message?: string;
              error?: string;
            }>;
            setError(
              axiosError.response?.data?.message ||
                axiosError.response?.data?.error ||
                'Failed to fetch resource'
            );
          } else {
            setError('An unexpected error occurred');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const resourceData = {
      title,
      description,
      category,
      url: url || undefined,
      imageUrl: imageUrl || undefined,
    };

    try {
      const endpoint = isEditing ? `/api/resources/${id}` : '/api/resources';
      const method = isEditing ? 'put' : 'post';

      await axios({
        method,
        url: endpoint,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: resourceData,
      });

      setSuccess(
        isEditing
          ? 'Resource updated successfully!'
          : 'Resource created successfully!'
      );

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/resources');
      }, 1500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          message?: string;
          error?: string;
        }>;
        if (axiosError.response) {
          setError(
            axiosError.response.data?.message ||
              axiosError.response.data?.error ||
              `Failed to save resource: ${axiosError.response.status}`
          );
        } else if (axiosError.request) {
          setError('No response received. Please check your connection.');
        } else {
          setError(`Request error: ${axiosError.message}`);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.delete(`/api/resources/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess('Resource deleted successfully!');

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/resources');
      }, 1500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          message?: string;
          error?: string;
        }>;
        if (axiosError.response) {
          setError(
            axiosError.response.data?.message ||
              axiosError.response.data?.error ||
              `Failed to delete resource: ${axiosError.response.status}`
          );
        } else if (axiosError.request) {
          setError('No response received. The resource may still be deleted.');
        } else {
          setError(`Request error: ${axiosError.message}`);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-purple-900 mb-6">
            {isEditing ? 'Edit Resource' : 'Add New Resource'}
          </h1>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                <option value="" disabled>
                  Select a category
                </option>
                {RESOURCE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"></textarea>
            </div>

            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 mb-1">
                URL (Optional)
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (Optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                  Delete
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddEditResource;
