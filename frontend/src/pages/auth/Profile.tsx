import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios'; // Add AxiosError type
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import api from '../../services/api';
import { useTranslation } from 'react-i18next'; // Add translation hook

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  url?: string;
  imageUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    email: string;
    name: string;
  };
}

const Profile: React.FC = () => {
  const { t } = useTranslation(); // Initialize translation
  const { user, token, isAuthenticated, logout } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userResources, setUserResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchUserResources();
    }
  }, [isAuthenticated, token, user?.id]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const fetchUserResources = async () => {
    setLoadingResources(true);
    try {
      const response = await api.get('/resources');
      const allResources = response.data;

      const myResources = allResources.filter(
        (resource: Resource) =>
          resource.user && resource.user.email === user?.email
      );

      setUserResources(myResources);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        if (axiosError.response) {
          // Server responded with error status
          setError(
            axiosError.response.data?.message ||
              t('profile.serverError', 'Server error: {{status}}', {
                status: axiosError.response.status,
              })
          );
        } else if (axiosError.request) {
          // Request made but no response received
          setError(
            t(
              'resources.connectionError',
              'No response received. Please check your connection.'
            )
          );
        } else {
          // Error setting up request
          setError(
            t('profile.requestError', 'Request error: {{message}}', {
              message: axiosError.message,
            })
          );
        }
      } else {
        // Handle non-Axios errors
        setError(
          t('resources.unexpectedError', 'An unexpected error occurred')
        );
      }
    } finally {
      setLoadingResources(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.put(
        `/users/${user?.id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(t('profile.updateSuccess', 'Profile updated successfully'));
      setIsEditing(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        if (axiosError.response) {
          setError(
            axiosError.response.data?.message ||
              t('profile.updateFailed', 'Update failed: {{status}}', {
                status: axiosError.response.status,
              })
          );
        } else if (axiosError.request) {
          setError(
            t('profile.noResponse', 'No response received. Please try again.')
          );
        } else {
          setError(
            t('profile.requestFailed', 'Request failed: {{message}}', {
              message: axiosError.message,
            })
          );
        }
      } else {
        setError(
          t(
            'profile.unexpectedError',
            'Update failed due to an unexpected error'
          )
        );
      }
    }
  };

  const handleDeleteResource = async (
    resourceId: string,
    resourceTitle: string
  ) => {
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
      await api.delete(`/resources/${resourceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(
        t('resources.deleteSuccess', 'Resource deleted successfully!')
      );
      setUserResources(
        userResources.filter((resource) => resource._id !== resourceId)
      );
      setTimeout(() => setMessage(''), 3000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        if (axiosError.response) {
          setError(
            axiosError.response.data?.message ||
              t('profile.deleteFailed', 'Delete failed: {{status}}', {
                status: axiosError.response.status,
              })
          );
        } else if (axiosError.request) {
          setError(
            t(
              'resources.noResponse',
              'No response received. The resource may still be deleted.'
            )
          );
        } else {
          setError(
            t(
              'profile.deleteRequestFailed',
              'Delete request failed: {{message}}',
              { message: axiosError.message }
            )
          );
        }
      } else {
        setError(
          t(
            'profile.deleteUnexpectedError',
            'Failed to delete resource due to an unexpected error'
          )
        );
      }
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-purple-900 mb-6">
            {t('profile.title', 'My Profile')}
          </h1>

          {message && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.nameField', 'Name')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              ) : (
                <p className="text-gray-900 py-2">{name}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.emailField', 'Email')}
              </label>
              <p className="text-gray-900 py-2">{email}</p>
              <p className="text-sm text-gray-500 mt-1">
                {t('profile.emailNoChange', 'Email cannot be changed')}
              </p>
            </div>

            <div className="flex space-x-4">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                    {t('profile.saveChanges', 'Save Changes')}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    onClick={() => {
                      setIsEditing(false);
                      if (user) setName(user.name);
                    }}>
                    {t('createDiscussion.cancel', 'Cancel')}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  onClick={() => setIsEditing(true)}>
                  {t('profile.editProfile', 'Edit Profile')}
                </button>
              )}

              <button
                type="button"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                onClick={logout}>
                {t('nav.signOut', 'Logout')}
              </button>
            </div>
          </form>

          <div className="mt-10 border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-purple-900">
                {t('profile.myResources', 'My Resources')}
              </h2>
              <Link
                to="/add-resource"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
                {t('resources.addNew', 'Add New Resource')}
              </Link>
            </div>

            {loadingResources ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-purple-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">
                  {t('profile.loadingResources', 'Loading your resources...')}
                </p>
              </div>
            ) : userResources.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-600">
                  {t(
                    'profile.noResourcesYet',
                    "You haven't created any resources yet."
                  )}
                </p>
                <Link
                  to="/add-resource"
                  className="mt-2 inline-block text-purple-600 hover:text-purple-800">
                  {t(
                    'profile.createFirstResource',
                    'Create your first resource'
                  )}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userResources.map((resource) => (
                  <div
                    key={resource._id}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {resource.title}
                        </h3>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full mt-1 inline-block">
                          {resource.category}
                        </span>
                      </div>
                      {resource.imageUrl && (
                        <img
                          src={resource.imageUrl}
                          alt={resource.title}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src =
                              'https://via.placeholder.com/64?text=No+Image';
                          }}
                        />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="mt-3 flex justify-end space-x-3">
                      <Link
                        to={`/edit-resource/${resource._id}`}
                        className="text-sm text-blue-600 hover:text-blue-800">
                        {t('resources.edit', 'Edit')}
                      </Link>
                      <button
                        onClick={() =>
                          handleDeleteResource(resource._id, resource.title)
                        }
                        className="text-sm text-red-600 hover:text-red-800">
                        {t('resources.delete', 'Delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
