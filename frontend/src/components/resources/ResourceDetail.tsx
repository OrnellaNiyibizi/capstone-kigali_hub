import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../common/Loader';
import {
  FaCalendarAlt,
  FaUser,
  FaLink,
  FaTags,
  FaArrowLeft,
  FaEdit,
  FaShare,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  link: string;
  imageUrl?: string;
  tags: string[];
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

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/resources/${id}`
        );
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
    return resource && user && user.email === resource.user.email;
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
                  className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  <FaLink className="mr-2" /> Access Resource
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
