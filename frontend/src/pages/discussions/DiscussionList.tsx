import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchDiscussions } from '../../services/discussionService';
import { Discussion } from '../../types/Discussion';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const DiscussionList: React.FC = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { isAuthenticated } = useAuth();

  const categories = [
    'All',
    'Health Advice',
    'Financial Support',
    'Job Opportunities',
    'Education',
    'General',
    'Other',
  ];

  useEffect(() => {
    const loadDiscussions = async () => {
      try {
        setLoading(true);
        const category =
          selectedCategory === 'All' ? undefined : selectedCategory;
        const data = await fetchDiscussions(category);
        setDiscussions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load discussions'
        );
      } finally {
        setLoading(false);
      }
    };

    loadDiscussions();
  }, [selectedCategory]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Discussions</h1>
            {isAuthenticated && (
              <Link
                to="/discussions/new"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
                Start Discussion
              </Link>
            )}
          </div>

          {/* Category filter */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-700 mb-3">
              Filter by category
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}>
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading discussions...</p>
            </div>
          ) : discussions.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <p className="text-gray-700 mb-4">No discussions found.</p>
              {isAuthenticated ? (
                <Link
                  to="/discussions/create"
                  className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
                  Start the first discussion
                </Link>
              ) : (
                <p>
                  <Link to="/login" className="text-purple-600 hover:underline">
                    Sign in
                  </Link>{' '}
                  to start a discussion
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {discussions.map((discussion) => (
                <div
                  key={discussion._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/discussions/${discussion._id}`}
                        className="text-xl font-semibold text-gray-900 hover:text-purple-600">
                        {discussion.title}
                      </Link>
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {discussion.category}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span>
                        Posted by {discussion.user?.name || 'Unknown User'}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(discussion.createdAt)}</span>
                    </div>

                    <p className="mt-3 text-gray-700 line-clamp-2">
                      {discussion.content}
                    </p>

                    <div className="mt-4 flex justify-between items-center">
                      <Link
                        to={`/discussions/${discussion._id}`}
                        className="text-purple-600 hover:text-purple-800">
                        Read more →
                      </Link>

                      <div className="flex items-center text-sm text-gray-500">
                        <span>
                          {discussion.comments?.length || 0} comment
                          {discussion.comments?.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DiscussionList;
