import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaUser,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';

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
  latitude?: number;
  longitude?: number;
  businessName?: string;
  businessAddress?: string;
}

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const {
    _id,
    title,
    description,
    category,
    link,
    imageUrl,
    tags,
    createdAt,
    user,
    latitude,
    longitude,
    businessName,
  } = resource;

  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Truncate description if it's too long
  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {imageUrl && (
        <Link
          to={`/resources/${_id}`}
          className="block h-48 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20 transition-opacity duration-300 hover:opacity-30"></div>
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-resource.png';
            }}
          />
        </Link>
      )}

      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-medium">
            {category}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <FaCalendarAlt className="mr-1 text-purple-400" />
            {formattedDate}
          </div>
        </div>

        <div className="flex justify-between items-center mb-3">
          <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
            {category}
          </span>

          {latitude && longitude && (
            <span className="flex items-center text-xs text-gray-500">
              <FaMapMarkerAlt className="text-purple-400 mr-1" />
              {businessName || 'Location available'}
            </span>
          )}
        </div>

        <Link to={`/resources/${_id}`}>
          <h3 className="text-xl font-bold mb-3 text-gray-800 hover:text-purple-700 transition-colors">
            {title}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {truncateDescription(description)}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center text-xs text-gray-500 mb-4">
          <FaUser className="mr-1 text-purple-400" />
          <span>By {user.name}</span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <Link
            to={`/resources/${_id}`}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm">
            Read More
            <svg
              className="w-4 h-4 ml-1"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"></path>
            </svg>
          </Link>

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-gray-500 hover:text-purple-600">
              <FaExternalLinkAlt className="mr-1" />
              Visit
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
