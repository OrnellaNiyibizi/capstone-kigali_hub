import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-6">
        Join Our Community Today
      </h2>
      <p className="text-lg text-gray-700 mb-8">
        Get access to exclusive resources, networking events, and job
        opportunities designed specifically for women in Rwanda.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/register"
          className="px-8 py-4 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700 transition-colors font-medium text-lg">
          Join Now
        </Link>
        <Link
          to="/resources"
          className="px-8 py-4 bg-white text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50 transition-colors font-medium text-lg">
          Explore Resources
        </Link>
      </div>
    </div>
  );
};

export default CallToAction;
