import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchDiscussion,
  createDiscussion,
  updateDiscussion,
} from '../../services/discussionService';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useTranslation } from 'react-i18next';

// Define category keys that exactly match backend enum values
const CATEGORY_KEYS = {
  HEALTH_ADVICE: 'Health Advice',
  FINANCIAL_SUPPORT: 'Financial Support',
  JOB_OPPORTUNITIES: 'Job Opportunities',
  EDUCATION: 'Education',
  GENERAL: 'General',
  OTHER: 'Other',
};

const AddEditDiscussion: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch discussion if editing
  useEffect(() => {
    if (isEditing && id) {
      const loadDiscussion = async () => {
        try {
          setFetching(true);
          const discussion = await fetchDiscussion(id);
          setTitle(discussion.title);
          setContent(discussion.content);
          setCategory(discussion.category);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'Failed to load discussion'
          );
          setTimeout(() => navigate('/discussions'), 3000);
        } finally {
          setFetching(false);
        }
      };

      loadDiscussion();
    }
  }, [id, isEditing, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError(t('createDiscussion.mustLogIn', 'You must be logged in'));
      return;
    }

    if (!title.trim() || !content.trim() || !category) {
      setError(t('createDiscussion.allRequired', 'All fields are required'));
      return;
    }

    const discussionData = {
      title,
      content,
      category,
    };

    setLoading(true);
    setError('');

    try {
      if (isEditing && id) {
        await updateDiscussion(id, discussionData, token);
        navigate(`/discussions/${id}`);
      } else {
        const newDiscussion = await createDiscussion(discussionData, token);
        navigate(`/discussions/${newDiscussion._id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  // Use translation only for display, but keep the actual values matching backend enum
  const categories = [
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-purple-900 mb-6">
            {isEditing
              ? t('createDiscussion.editTitle', 'Edit Discussion')
              : t('createDiscussion.title', 'Start a New Discussion')}
          </h1>

          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {fetching ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">
                {t('discussions.loading', 'Loading discussion...')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  {t('createDiscussion.titleField', 'Title')} *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder={t(
                    'createDiscussion.titlePlaceholder',
                    'What do you want to discuss?'
                  )}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  {t('createDiscussion.category', 'Category')} *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required>
                  <option value="">
                    {t('createDiscussion.selectCategory', 'Select a category')}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.display}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  {t('createDiscussion.content', 'Content')} *
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder={t(
                    'createDiscussion.contentPlaceholder',
                    'Share your thoughts, questions, or experiences...'
                  )}
                  required
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/discussions')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                  {t('createDiscussion.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed">
                  {loading
                    ? t('createDiscussion.submitting', 'Submitting...')
                    : isEditing
                    ? t(
                        'createDiscussion.updateDiscussion',
                        'Update Discussion'
                      )
                    : t('createDiscussion.postDiscussion', 'Post Discussion')}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddEditDiscussion;
