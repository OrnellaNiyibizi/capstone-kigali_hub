import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import api from '../../services/api';
import { RESOURCE_CATEGORIES } from '../../utils/constants';
// Import Google Maps components
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from '@vis.gl/react-google-maps';
import { FaLocationArrow } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'; // Add this import

// Add a helper function for styling the map
const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(' ');

const mapStyles = {
  default: 'w-full h-64 rounded-md',
};

const AddEditResource: React.FC = () => {
  const { t } = useTranslation(); // Add translation hook
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { token } = useAuth();

  // Existing state variables
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // New state variables for business info
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Geolocation state
  const [marker, setMarker] = useState<google.maps.LatLngLiteral>(
    { lat: -1.94407, lng: 30.0619 } // Default to Rwanda coordinates
  );
  const [geolocating, setGeolocating] = useState(false);
  const [geoError, setGeoError] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Google Maps API key
  const googleAPI = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const mapId = 'resource-map';

  // Fetch resource data if editing
  useEffect(() => {
    if (isEditing) {
      setLoading(true);

      axios
        .get(`/resources/${id}`)
        .then((response) => {
          const data = response.data;
          setTitle(data.title);
          setDescription(data.description);
          setCategory(data.category);
          setUrl(data.url || '');
          setImageUrl(data.imageUrl || '');

          // Set business info if it exists
          setBusinessName(data.businessName || '');
          setBusinessAddress(data.businessAddress || '');
          setPhoneNumber(data.phoneNumber || '');

          // Set location if it exists
          if (data.latitude && data.longitude) {
            setMarker({
              lat: data.latitude,
              lng: data.longitude,
            });
          }
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
                t('resources.fetchError', 'Failed to fetch resource')
            );
          } else {
            setError(
              t('resources.unexpectedError', 'An unexpected error occurred')
            );
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEditing, t]);

  // Function to handle map clicks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMapClick = (event: any) => {
    // Access coordinates using event.detail.latLng
    if (event.detail && event.detail.latLng) {
      const newLocation = {
        lat: event.detail.latLng.lat(),
        lng: event.detail.latLng.lng(),
      };
      setMarker(newLocation);
    }
  };

  // Function to get user's current location
  const getCurrentLocation = () => {
    // Clear any previous errors
    setGeoError('');

    // Check if geolocation is available
    if (!navigator.geolocation) {
      setGeoError(
        t(
          'resources.geolocationNotSupported',
          'Geolocation is not supported by your browser'
        )
      );
      return;
    }

    // Set loading state
    setGeolocating(true);

    // Request current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success handler
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Update marker with current location
        setMarker(currentLocation);
        setGeolocating(false);
      },
      (error) => {
        // Error handler
        setGeolocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError(
              t(
                'resources.locationPermissionDenied',
                'Location permission was denied'
              )
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError(
              t(
                'resources.locationUnavailable',
                'Location information is unavailable'
              )
            );
            break;
          case error.TIMEOUT:
            setGeoError(
              t(
                'resources.locationTimeout',
                'The request to get location timed out'
              )
            );
            break;
          default:
            setGeoError(
              t('resources.unknownLocationError', 'An unknown error occurred')
            );
            break;
        }
      },
      // Options
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

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
      // Add business info
      businessName: businessName || undefined,
      businessAddress: businessAddress || undefined,
      phoneNumber: phoneNumber || undefined,
      // Add geolocation
      latitude: marker.lat,
      longitude: marker.lng,
    };

    try {
      const endpoint = isEditing ? `/resources/${id}` : '/resources';
      const method = isEditing ? 'put' : 'post';

      await api({
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
          ? t('resources.updateSuccess', 'Resource updated successfully!')
          : t('resources.createSuccess', 'Resource created successfully!')
      );

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/resources');
      }, 1500);
    } catch (error: unknown) {
      // Your existing error handling code
      console.error('Failed to save resource:', error);
      setError(
        t(
          'resources.saveError',
          'Failed to save resource. Please try again later.'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        t(
          'resources.deleteConfirm',
          'Are you sure you want to delete this resource?'
        )
      )
    ) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.delete(`/resources/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess(
        t('resources.deleteSuccess', 'Resource deleted successfully!')
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
              t(
                'resources.deleteError',
                `Failed to delete resource: ${axiosError.response.status}`
              )
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
            t('resources.requestError', `Request error: ${axiosError.message}`)
          );
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-purple-900 mb-6">
            {isEditing
              ? t('resources.editResource', 'Edit Resource')
              : t('resources.addNew', 'Add New Resource')}
          </h1>

          {/* Error and success messages */}
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
            {/* Existing form fields */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1">
                {t('resources.titleField', 'Title')} *
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

            {/* Category selection */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1">
                {t('resources.categoryField', 'Category')} *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                <option value="" disabled>
                  {t('resources.selectCategory', 'Select a category')}
                </option>
                {RESOURCE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1">
                {t('resources.descriptionField', 'Description')} *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"></textarea>
            </div>

            {/* URL */}
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 mb-1">
                {t('resources.urlField', 'URL')} (
                {t('common.optional', 'Optional')})
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

            {/* Image URL */}
            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 mb-1">
                {t('resources.imageUrlField', 'Image URL')} (
                {t('common.optional', 'Optional')})
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

            {/* New fields for business info */}
            <div className="border-t border-gray-200 pt-4 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('resources.businessInfo', 'Business Information')} (
                {t('common.optional', 'Optional')})
              </h3>

              {/* Business Name */}
              <div className="mb-4">
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  {t('resources.businessName', 'Business Name')}
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder={t(
                    'resources.businessNamePlaceholder',
                    'Business name'
                  )}
                />
              </div>

              {/* Business Address */}
              <div className="mb-4">
                <label
                  htmlFor="businessAddress"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  {t('resources.businessAddress', 'Address')}
                </label>
                <input
                  type="text"
                  id="businessAddress"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder={t(
                    'resources.businessAddressPlaceholder',
                    'Business address'
                  )}
                />
              </div>

              {/* Phone Number */}
              <div className="mb-4">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  {t('resources.phoneNumber', 'Phone Number')}
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder={t(
                    'resources.phoneNumberPlaceholder',
                    'Business phone number'
                  )}
                />
              </div>
            </div>

            {/* Map for location selection */}
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('resources.location', 'Location')} (
                {t('common.optional', 'Optional')})
              </label>
              <div className="relative w-full h-64">
                {googleAPI ? (
                  <>
                    {/* Current location button */}
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={geolocating}
                      className="absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      title={t(
                        'resources.useMyLocation',
                        'Use my current location'
                      )}>
                      <FaLocationArrow
                        className={`text-purple-600 ${
                          geolocating ? 'animate-pulse' : ''
                        }`}
                      />
                    </button>

                    <APIProvider apiKey={googleAPI}>
                      <Map
                        className={cn(mapStyles.default)}
                        center={marker}
                        mapId={import.meta.env.VITE_GOOGLE_MAP_ID || mapId}
                        disableDefaultUI={false}
                        zoom={12}
                        zoomControl={true}
                        scrollwheel={true}
                        gestureHandling="default"
                        onClick={handleMapClick}>
                        <AdvancedMarker
                          position={marker}
                          draggable={true}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          onDragEnd={(e: any) => {
                            if (e.latLng) {
                              const newLocation = {
                                lat: e.latLng.lat(),
                                lng: e.latLng.lng(),
                              };
                              setMarker(newLocation);
                            }
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
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100 rounded-md">
                    <p className="text-gray-500">
                      {t(
                        'resources.mapsNotConfigured',
                        'Google Maps API key not configured'
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Show geolocation error if any */}
              {geoError && (
                <p className="mt-2 text-sm text-red-500">{geoError}</p>
              )}

              <p className="mt-2 text-sm text-gray-500">
                {t(
                  'resources.mapInstructions',
                  'Click on the map to set a location, drag the marker to adjust, or use the location button to set your current position.'
                )}
              </p>

              {/* Display coordinates */}
              <div className="mt-2 text-sm text-gray-500">
                {t('resources.coordinates', 'Coordinates')}:{' '}
                {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
              </div>
            </div>

            {/* Submit and Delete buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                  {t('resources.delete', 'Delete')}
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                {loading
                  ? t('resources.saving', 'Saving...')
                  : isEditing
                  ? t('resources.update', 'Update')
                  : t('resources.create', 'Create')}
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
