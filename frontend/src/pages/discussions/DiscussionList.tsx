import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchDiscussions } from '../../services/discussionService';
import { Discussion } from '../../types/Discussion';
import Header from '../../components/homepage/Header';
import Footer from '../../components/homepage/Footer';
import { useAuth } from '../../context/AuthContext';

const DiscussionList: React.FC = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
        const category = selectedCategory === 'All' ? '' : selectedCategory;
        const data = await fetchDiscussions(category);
        setDiscussions(data);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
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
            <h1 className="text-3xl font-bold text-purple-900">Discussions</h1>
            {isAuthenticated ? (
              <Link
                to="/discussions/new"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                Start New Discussion
              </Link>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                Sign in to Post
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Filter by Category:</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === category ||
                    (category === 'All' && selectedCategory === '')
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() =>
                    setSelectedCategory(category === 'All' ? '' : category)
                  }>
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading discussions...</p>
            </div>
          ) : discussions.length === 0 ? (
            <div className="text-center py-10 bg-white shadow rounded-lg">
              <p className="text-gray-600">
                No discussions found in this category. Be the first to start
                one!
              </p>
              {isAuthenticated && (
                <Link
                  to="/discussions/new"
                  className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  Start New Discussion
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <div
                  key={discussion._id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        to={`/discussions/${discussion._id}`}
                        className="text-xl font-semibold text-purple-900 hover:text-purple-700">
                        {discussion.title}
                      </Link>
                      <div className="flex items-center mt-2 space-x-3">
                        <span className="text-sm text-gray-500">
                          Posted by {discussion.user.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(discussion.createdAt)}
                        </span>
                        <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                          {discussion.category}
                        </span>
                      </div>
                    </div>
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {discussion.comments.length}{' '}
                      {discussion.comments.length === 1 ? 'reply' : 'replies'}
                    </span>
                  </div>
                  <p className="mt-3 text-gray-600 line-clamp-2">
                    {discussion.content}
                  </p>
                  <Link
                    to={`/discussions/${discussion._id}`}
                    className="mt-4 inline-block text-purple-600 hover:text-purple-800">
                    Read more →
                  </Link>
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
