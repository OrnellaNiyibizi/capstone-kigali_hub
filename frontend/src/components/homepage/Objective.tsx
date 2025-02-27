import React from 'react';

const Objective: React.FC = () => {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-6">
        Our Objective
      </h2>
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <p className="text-lg text-gray-700 leading-relaxed">
          We aim to empower women in Kigali by providing access to vital
          resources, educational opportunities, and a supportive community.
          <br />
          <br />
          Our goal is to foster growth, collaboration, and success among women
          in our city, creating pathways to economic independence and
          leadership.
        </p>
      </div>
    </div>
  );
};

export default Objective;
