import React from 'react';

const PostForm: React.FC = () => {
  return (
    <form>
      <h2 className="mb-4 text-2xl font-semibold max-sm:text-xl">
        Post a Question or Share Your Experience
      </h2>
      <label htmlFor="postContent" className="sr-only">Write your question or experience here</label>
      <textarea
        id="postContent"
        placeholder="Write your question or experience here..."
        className="p-3 w-full text-base rounded border border-gray-300 border-solid resize-y min-h-[120px]"
      />
      <button
        type="submit"
        className="px-6 py-3 mt-4 mb-8 text-base font-medium text-white bg-purple-600 rounded cursor-pointer border-[none] duration-[0.2s] transition-[background-color]"
      >
        Post
      </button>
    </form>
  );
};

export default PostForm;