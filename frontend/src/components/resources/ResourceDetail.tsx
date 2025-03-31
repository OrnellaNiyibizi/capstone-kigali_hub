import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../common/Loader';
import {
  FaCalendarAlt,
  FaUser,
  FaLink,
  FaTags,
  FaArrowLeft,
  FaEdit,
  FaShare,
  FaMapMarkerAlt,
  FaPhone,
  FaBuilding,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from '@vis.gl/react-google-maps';

// Extend AxiosResponse type to include fromCache property
declare module 'axios' {
  interface AxiosResponse {
    fromCache?: boolean;
  }
}

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  link: string;
  imageUrl?: string;
  tags: string[];
  businessName?: string;
  businessAddress?: string;
  phoneNumber?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isOfflineData, setIsOfflineData] = useState(false);

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

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        // Use our api service which handles offline caching
        const response = await api.get(`/resources/${id}`);

        // Check if the response came from cache
        if (response.fromCache) {
          setIsOfflineData(true);
        }

        setResource(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching resource:', err);
        setError(
          'Failed to load resource. It may have been removed or you may not have permission to view it.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => {
        setCopySuccess('URL copied!');
        setTimeout(() => setCopySuccess(''), 3000);
      },
      () => {
        setCopySuccess('Failed to copy');
        setTimeout(() => setCopySuccess(''), 3000);
      }
    );
  };

  const canEdit = () => {
    return resource && user && user.email === resource.user.email && isOnline;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <div className="mt-4">
          <Link
            to="/resources"
            className="text-purple-600 hover:text-purple-800 inline-flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Resource Not Found</h2>
          <p className="mb-4">
            The resource you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/resources"
            className="text-purple-600 hover:text-purple-800 inline-flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(resource.createdAt).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/resources"
            className="text-purple-600 hover:text-purple-800 inline-flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Resources
          </Link>

          <div className="flex space-x-2">
            {canEdit() && (
              <button
                onClick={() => navigate(`/edit-resource/${resource._id}`)}
                className="inline-flex items-center bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-md text-sm">
                <FaEdit className="mr-1" /> Edit
              </button>
            )}
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-2 rounded-md text-sm">
              <FaShare className="mr-1" /> Share
            </button>
            {copySuccess && (
              <span className="text-green-600 text-sm bg-green-50 px-3 py-2 rounded-md">
                {copySuccess}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {resource.imageUrl && (
            <div className="w-full h-72 md:h-96 relative">
              <img
                src={resource.imageUrl}
                alt={resource.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    '/placeholder-resource.png';
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <span className="inline-block bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                  {resource.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {resource.title}
                </h1>
              </div>
            </div>
          )}

          <div className="p-6 md:p-8">
            {!resource.imageUrl && (
              <div className="mb-6">
                <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {resource.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                  {resource.title}
                </h1>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-4 border-b border-gray-100">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-purple-400" />
                {formattedDate}
              </div>
              <div className="flex items-center">
                <FaUser className="mr-2 text-purple-400" />
                Shared by{' '}
                <span className="font-medium ml-1">{resource.user.name}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 whitespace-pre-line">
                {resource.description}
              </p>
            </div>

            {resource.link && (
              <div className="mb-8">
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors ${
                    !isOnline
                      ? 'opacity-50 cursor-not-allowed pointer-events-none'
                      : ''
                  }`}>
                  <FaLink className="mr-2" />{' '}
                  {isOnline
                    ? 'Access Resource'
                    : 'Access Resource (Unavailable Offline)'}
                </a>
              </div>
            )}

            {resource.tags && resource.tags.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center text-gray-700 font-medium mb-2">
                  <FaTags className="mr-2 text-purple-400" />
                  <h3>Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-default">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Business info section */}
            {(resource.businessName ||
              resource.businessAddress ||
              resource.phoneNumber) && (
              <div className="mt-8 p-6 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
                  <FaBuilding className="mr-2 text-purple-500" />
                  Business Information
                </h3>

                {resource.businessName && (
                  <div className="mb-2 flex items-center">
                    <span className="font-medium w-24 text-gray-700">
                      Name:
                    </span>
                    <span>{resource.businessName}</span>
                  </div>
                )}

                {resource.businessAddress && (
                  <div className="mb-2 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-purple-400" />
                    <span>{resource.businessAddress}</span>
                  </div>
                )}

                {resource.phoneNumber && (
                  <div className="mb-2 flex items-center">
                    <FaPhone className="mr-2 text-purple-400" />
                    <a
                      href={`tel:${resource.phoneNumber}`}
                      className={`text-purple-700 hover:text-purple-900 hover:underline ${
                        !isOnline ? 'opacity-50 pointer-events-none' : ''
                      }`}>
                      {resource.phoneNumber}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Map section */}
            {resource.latitude && resource.longitude && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-purple-500" />
                  Location
                </h3>

                <div className="h-64 w-full rounded-lg overflow-hidden">
                  {isOnline ? (
                    <APIProvider
                      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
                      <Map
                        className="w-full h-full"
                        center={{
                          lat: resource.latitude,
                          lng: resource.longitude,
                        }}
                        mapId={
                          import.meta.env.VITE_GOOGLE_MAP_ID ||
                          'resource-detail-map'
                        }
                        disableDefaultUI={true}
                        zoom={15}
                        zoomControl={true}>
                        <AdvancedMarker
                          position={{
                            lat: resource.latitude,
                            lng: resource.longitude,
                          }}>
                          <Pin
                            background={'#3b82f6'}
                            borderColor={'#1d4ed8'}
                            glyphColor={'#ffffff'}
                            scale={1.2}
                          />
                        </AdvancedMarker>
                      </Map>
                    </APIProvider>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <div className="text-center p-4">
                        <FaMapMarkerAlt className="mx-auto text-4xl text-gray-400 mb-2" />
                        <p className="text-gray-500">
                          Map unavailable offline
                          <br />
                          <span className="text-sm">
                            Coordinates: {resource.latitude.toFixed(6)},{' '}
                            {resource.longitude.toFixed(6)}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isOfflineData && (
        <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"></path>
          </svg>
          You're viewing cached content while offline
        </div>
      )}
    </div>
  );
};

export default ResourceDetail;
