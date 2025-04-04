import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchDiscussions } from '../../services/discussionService';
import { Discussion } from '../../types/Discussion';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useTranslation } from 'react-i18next';

// Define category keys that exactly match backend enum values
const CATEGORY_KEYS = {
  ALL: 'All', // Special case for frontend filtering
  HEALTH_ADVICE: 'Health Advice',
  FINANCIAL_SUPPORT: 'Financial Support',
  JOB_OPPORTUNITIES: 'Job Opportunities',
  EDUCATION: 'Education',
  GENERAL: 'General',
  OTHER: 'Other',
};

const DiscussionList: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_KEYS.ALL);
  const { isAuthenticated } = useAuth();
  // Add state to track online status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Define categories with display names that can be translated
  const categories = [
    {
      key: CATEGORY_KEYS.ALL,
      display: t('discussionCategories.all.title', 'All'),
    },
    {
      key: CATEGORY_KEYS.HEALTH_ADVICE,
      display: t('discussionCategories.healthAdvice.title', 'Health Advice'),
    },
    {
      key: CATEGORY_KEYS.FINANCIAL_SUPPORT,
      display: t(
        'discussionCategories.financialSupport.title',
        'Financial Support'
      ),
    },
    {
      key: CATEGORY_KEYS.JOB_OPPORTUNITIES,
      display: t(
        'discussionCategories.jobOpportunities.title',
        'Job Opportunities'
      ),
    },
    {
      key: CATEGORY_KEYS.EDUCATION,
      display: t('discussionCategories.education.title', 'Education'),
    },
    {
      key: CATEGORY_KEYS.GENERAL,
      display: t('discussionCategories.general.title', 'General'),
    },
    {
      key: CATEGORY_KEYS.OTHER,
      display: t('discussionCategories.other.title', 'Other'),
    },
  ];

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const loadDiscussions = async () => {
      try {
        setLoading(true);
        const category =
          selectedCategory === CATEGORY_KEYS.ALL ? undefined : selectedCategory;
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
    // Consider using a date-formatting library with i18n support
    // For simplicity, we'll use the built-in formatter
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(
      i18n.language === 'rw' ? 'fr-RW' : undefined,
      options
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {t('discussions.title', 'Discussions')}
            </h1>
            {isAuthenticated && isOnline && (
              <Link
                to="/discussions/new"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
                {t('discussions.startDiscussion', 'Start Discussion')}
              </Link>
            )}
          </div>

          {/* Category filter */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-700 mb-3">
              {t('discussions.filterByCategory', 'Filter by category')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === category.key
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}>
                  {category.display}
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
              <p className="mt-2 text-gray-600">
                {t('discussions.loading', 'Loading discussions...')}
              </p>
            </div>
          ) : discussions.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <p className="text-gray-700 mb-4">
                {t('discussions.noDiscussions', 'No discussions found.')}
              </p>
              {isAuthenticated ? (
                isOnline ? (
                  <Link
                    to="/discussions/new"
                    className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
                    {t('discussions.startFirst', 'Start the first discussion')}
                  </Link>
                ) : (
                  <p className="text-gray-500">
                    {t(
                      'discussions.offlineMode',
                      'Cannot create discussions while offline'
                    )}
                  </p>
                )
              ) : (
                <p>
                  <Link to="/login" className="text-purple-600 hover:underline">
                    {t('nav.signIn', 'Sign in')}
                  </Link>{' '}
                  {t('discussions.signInToStart', 'to start a discussion')}
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
                        {t('discussions.postedBy', 'Posted by')}{' '}
                        {discussion.user?.name || 'Unknown User'}
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
                        {t('discussions.readMore', 'Read more →')}
                      </Link>

                      <div className="flex items-center text-sm text-gray-500">
                        <span>
                          {discussion.comments?.length || 0}{' '}
                          {discussion.comments?.length !== 1
                            ? t('discussions.commentsPlural', 'comments')
                            : t('discussions.comments', 'comment')}
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
