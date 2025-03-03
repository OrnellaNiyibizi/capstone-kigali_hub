import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../common/Loader';

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
            className="text-purple-600 hover:text-purple-800">
            ← Back to Resources
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
            className="text-purple-600 hover:text-purple-800">
            ← Back to Resources
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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Link
          to="/resources"
          className="text-purple-600 hover:text-purple-800 mb-6 inline-block">
          ← Back to Resources
        </Link>

        {resource.imageUrl && (
          <img
            src={resource.imageUrl}
            alt={resource.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-resource.png';
            }}
          />
        )}

        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            {resource.category}
          </span>
          <span className="text-gray-500 text-sm">{formattedDate}</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {resource.title}
        </h1>

        <div className="prose max-w-none mb-6">
          <p className="text-gray-700">{resource.description}</p>
        </div>

        {resource.link && (
          <div className="mb-6">
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors">
              View Resource
            </a>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {resource.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600">
            Shared by <span className="font-medium">{resource.user.name}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
