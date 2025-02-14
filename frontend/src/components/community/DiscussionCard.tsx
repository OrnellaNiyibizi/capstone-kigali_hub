import React from 'react';

interface DiscussionCardProps {
  title: string;
  author: string;
  date: string;
  content: string;
}

const DiscussionCard: React.FC<DiscussionCardProps> = ({
  title,
  author,
  date,
  content,
}) => {
  return (
    <div className="p-6 mb-4 bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] max-sm:p-4">
      <h3 className="mb-2 text-lg font-bold max-sm:text-base">{title}</h3>
      <p className="mb-3 text-sm text-gray-500">
        Posted by {author} on {date}
      </p>
      <p className="mb-4 text-base text-gray-700">{content}</p>
      <button className="text-sm font-medium text-indigo-500 cursor-pointer">
        Reply
      </button>
    </div>
  );
};

export default DiscussionCard;
