import React from 'react';
import SearchBar from './components/community/SearchBar';
import CategoryList from './components/community/CategoryList';
import DiscussionList from './components/community/DiscussionList';
import PostForm from './components/community/PostForm';

const CommunityForum: React.FC = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div className="flex flex-col w-full min-h-screen text-black bg-gray-100">
        <div className="flex flex-col items-center px-5 py-10 mx-auto my-0 w-full max-w-[1200px] max-sm:p-5">
          <h1 className="mb-2 text-3xl font-bold leading-tight text-center max-sm:text-2xl">
            Community Forum
          </h1>
          <p className="text-base text-center text-gray-600 max-sm:text-sm">
            Connect, ask questions, and share experiences
          </p>
          <div className="flex flex-col mt-8 w-full">
            <SearchBar />
            <CategoryList />
            <DiscussionList />
            <PostForm />
            <div className="mt-4 text-sm text-center text-gray-500">
              Moderation rules: Please be respectful and follow community
              guidelines.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityForum;
