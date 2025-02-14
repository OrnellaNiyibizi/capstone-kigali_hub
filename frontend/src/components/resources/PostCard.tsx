import React from 'react';

interface PostCardProps {
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

const PostCard: React.FC<PostCardProps> = ({
  title,
  description,
  linkText,
  linkHref,
}) => {
  return (
    <div className="p-6 mb-4 bg-white rounded-lg shadow-sm max-sm:p-4">
      <h3 className="mb-3 text-xl font-bold text-neutral-900 max-sm:text-lg">
        {title}
      </h3>
      <p className="mb-4 leading-normal text-gray-700">{description}</p>
      <a href={linkHref} className="font-medium text-purple-600 no-underline">
        {linkText}
      </a>
    </div>
  );
};

export default PostCard;
