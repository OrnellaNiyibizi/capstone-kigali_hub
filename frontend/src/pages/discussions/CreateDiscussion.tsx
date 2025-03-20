import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDiscussion } from '../../services/discussionService';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useTranslation } from 'react-i18next';

const CreateDiscussion: React.FC = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { token } = useAuth();
  const navigate = useNavigate();

  const categories = [
    t('discussionCategories.healthAdvice.title', 'Health Advice'),
    t('discussionCategories.financialSupport.title', 'Financial Support'),
    t('discussionCategories.jobOpportunities.title', 'Job Opportunities'),
    t('discussionCategories.education.title', 'Education'),
    t('discussionCategories.general.title', 'General'),
    t('discussionCategories.other.title', 'Other'),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!title.trim()) {
      setError(t('createDiscussion.titleRequired', 'Title is required'));
      return;
    }

    if (!content.trim()) {
      setError(t('createDiscussion.contentRequired', 'Content is required'));
      return;
    }

    if (!category) {
      setError(
        t('createDiscussion.categoryRequired', 'Please select a category')
      );
      return;
    }

    if (!token) {
      setError(
        t(
          'createDiscussion.mustLogIn',
          'You must be logged in to create a discussion'
        )
      );
      return;
    }

    try {
      setLoading(true);
      setError('');

      const discussion = await createDiscussion(
        { title: title.trim(), content: content.trim(), category },
        token
      );

      navigate(`/discussions/${discussion._id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t('createDiscussion.failedToCreate', 'Failed to create discussion')
      );
      console.error('Error creating discussion:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-purple-900 mb-6">
            {t('createDiscussion.title', 'Start a New Discussion')}
          </h1>

          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
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

            {/* Category */}
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
                <option value="" disabled>
                  {t('createDiscussion.selectCategory', 'Select a category')}
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
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

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-purple-300 disabled:cursor-not-allowed">
                {loading ? (
                  <>
                    <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    {t('createDiscussion.creating', 'Creating...')}
                  </>
                ) : (
                  t('createDiscussion.postDiscussion', 'Post Discussion')
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateDiscussion;
