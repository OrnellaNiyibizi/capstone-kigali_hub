import React from 'react';
import DiscussionCard from './DiscussionCard.tsx';

const discussions = [
  {
    title: 'How to manage stress during job hunting?',
    author: 'User123',
    date: '12/01/2023',
    content: 'I am feeling overwhelmed with job applications. Any tips?',
  },
  {
    title: 'Best practices for budgeting?',
    author: 'User456',
    date: '11/30/2023',
    content:
      'What are some effective budgeting methods that have worked for you?',
  },
  {
    title: 'Seeking advice on healthy eating.',
    author: 'User789',
    date: '11/29/2023',
    content: 'Looking for tips on maintaining a balanced diet.',
  },
];

const DiscussionList: React.FC = () => {
  return (
    <>
      <h2 className="mb-4 text-2xl font-semibold max-sm:text-xl">
        Recent Discussions
      </h2>
      {discussions.map((discussion, index) => (
        <DiscussionCard
          key={index}
          title={discussion.title}
          author={discussion.author}
          date={discussion.date}
          content={discussion.content}
        />
      ))}
    </>
  );
};

export default DiscussionList;
