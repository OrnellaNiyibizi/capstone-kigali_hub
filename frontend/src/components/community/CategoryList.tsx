import React from 'react';
import CategoryCard from './CategoryCard.tsx';

const categories = [
  {
    title: 'Health Advice',
    description: 'Discuss health-related questions and share advice.',
  },
  {
    title: 'Financial Support',
    description: 'Get and give financial advice and support.',
  },
  {
    title: 'Job Opportunities',
    description: 'Share job openings and career advice.',
  },
];

const CategoryList: React.FC = () => {
  return (
    <>
      <h2 className="mt-8 mb-4 text-2xl font-semibold leading-none max-sm:text-xl">
        Categories
      </h2>
      <div className="flex gap-6 mb-8 max-sm:flex-col">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            title={category.title}
            description={category.description}
          />
        ))}
      </div>
    </>
  );
};

export default CategoryList;
