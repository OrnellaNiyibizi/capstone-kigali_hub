import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-900 leading-tight">
            Empowering Women in Kigali
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Join our platform to access resources, connect with events, and find
            job opportunities tailored for women in Kigali. We're here to
            support your personal and professional growth.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/resources"
              className="px-6 py-3 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700 transition-colors font-medium">
              Get Started
            </Link>
            <Link
              to="/community"
              className="px-6 py-3 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition-colors font-medium">
              Join Community
            </Link>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/f569a82b342b4a878c48adbe8885da1d/e59c1037cd038f099b4c2b056a7b68f68a797fa2c5b6070239d13352ee42cae7?apiKey=f569a82b342b4a878c48adbe8885da1d&"
            alt="Women empowerment illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
