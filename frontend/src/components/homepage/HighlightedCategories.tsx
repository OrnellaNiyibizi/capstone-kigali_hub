import React from 'react';

const categories = ['Healthcare', 'Education', 'Finance', 'Networking'];

const HighlightedCategories: React.FC = () => {
  return (
    <div className="flex flex-col px-6 mt-32 w-full text-base max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <h2 className="self-start text-2xl font-semibold leading-none text-black">
        Highlighted Categories
      </h2>
      <div className="flex flex-wrap gap-5 justify-between mt-4 font-semibold text-black whitespace-nowrap max-md:max-w-full">
        {categories.map((category, index) => (
          <div
            key={index}
            className="overflow-hidden p-4 bg-white rounded shadow-sm max-md:pr-5">
            {category}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighlightedCategories;
