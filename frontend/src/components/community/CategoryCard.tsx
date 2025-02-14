import React from 'react';

interface CategoryCardProps {
  title: string;
  description: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description }) => {
  return (
    <div className="flex-1 p-6 bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] max-sm:p-4">
      <h3 className="mb-2 text-lg font-bold max-sm:text-base">{title}</h3>
      <p className="text-base leading-normal text-gray-600">{description}</p>
    </div>
  );
};

export default CategoryCard;
