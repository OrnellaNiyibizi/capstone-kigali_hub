import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Healthcare',
    description: 'Access health resources and services tailored for women',
    icon: '🩺',
  },
  {
    name: 'Education',
    description:
      'Discover learning opportunities and skill development programs',
    icon: '📚',
  },
  {
    name: 'Finance',
    description: 'Find financial literacy resources and funding opportunities',
    icon: '💰',
  },
  {
    name: 'Networking',
    description: 'Connect with other women professionals and mentors',
    icon: '🔗',
  },
];

const HighlightedCategories: React.FC = () => {
  return (
    <div className="px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-purple-900 text-center mb-10">
        Highlighted Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <Link
            to="/resources"
            key={index}
            className="p-6 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="text-4xl mb-4">{category.icon}</div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2 group-hover:text-purple-600 transition-colors">
              {category.name}
            </h3>
            <p className="text-gray-600">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HighlightedCategories;
