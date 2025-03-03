import React from 'react';
import { Link } from 'react-router-dom';

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

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const { _id, title, description, category, imageUrl, tags, createdAt, user } =
    resource;

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-resource.png';
            }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="mb-2">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
            {category}
          </span>
        </div>

        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>

        <p className="text-gray-600 mb-4">{truncateDescription(description)}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
          <span>By {user.name}</span>
          <span>{formattedDate}</span>
        </div>

        <div className="mt-4">
          <Link
            to={`/resources/${_id}`}
            className="text-purple-600 hover:text-purple-800 font-medium">
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
