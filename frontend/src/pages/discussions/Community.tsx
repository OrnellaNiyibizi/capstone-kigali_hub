import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useTranslation } from 'react-i18next';

const CommunityForum: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const categories = [
    {
      key: 'healthAdvice',
      title: t('discussionCategories.healthAdvice.title', 'Health Advice'),
      description: t(
        'discussionCategories.healthAdvice.description',
        'Discuss health-related questions and share advice.'
      ),
    },
    {
      key: 'financialSupport',
      title: t(
        'discussionCategories.financialSupport.title',
        'Financial Support'
      ),
      description: t(
        'discussionCategories.financialSupport.description',
        'Get and give financial advice and support.'
      ),
    },
    {
      key: 'jobOpportunities',
      title: t(
        'discussionCategories.jobOpportunities.title',
        'Job Opportunities'
      ),
      description: t(
        'discussionCategories.jobOpportunities.description',
        'Share job openings and career advice.'
      ),
    },
    {
      key: 'education',
      title: t('discussionCategories.education.title', 'Education'),
      description: t(
        'discussionCategories.education.description',
        'Discuss educational opportunities and challenges.'
      ),
    },
    {
      key: 'technology',
      title: t('discussionCategories.technology.title', 'Technology'),
      description: t(
        'discussionCategories.technology.description',
        'Share tech tips, advice, and opportunities.'
      ),
    },
  ];

  const navigateToDiscussions = (category?: string) => {
    const url = category
      ? `/discussions?category=${encodeURIComponent(category)}`
      : '/discussions';
    navigate(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-purple-900 mb-3">
              {t('community.welcome', 'Welcome to Our Community')}
            </h1>
            <p className="text-lg text-gray-700">
              {t(
                'community.description',
                'Connect with other women, share experiences, ask questions, and find support.'
              )}
            </p>

            <div className="mt-6">
              {isAuthenticated ? (
                <Link
                  to="/discussions/new"
                  className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 inline-block">
                  {t('community.startDiscussion', 'Start a New Discussion')}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 inline-block">
                  {t('community.signInToParticipate', 'Sign In to Participate')}
                </Link>
              )}
              <Link
                to="/discussions"
                className="ml-4 px-6 py-3 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 inline-block">
                {t('community.browseDiscussions', 'Browse Discussions')}
              </Link>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">
              {t('community.discussionCategories', 'Discussion Categories')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <div
                  key={category.key}
                  className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigateToDiscussions(category.title)}>
                  <h3 className="text-xl font-semibold text-purple-800">
                    {category.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{category.description}</p>
                  <button className="mt-4 text-purple-600 hover:text-purple-800">
                    {t('community.browseTopics', 'Browse topics →')}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
            <h2 className="text-xl font-bold text-purple-900 mb-4">
              {t('community.guidelines', 'Community Guidelines')}
            </h2>
            <ul className="list-disc ml-5 space-y-2 text-gray-700">
              <li>
                {t(
                  'community.guideline1',
                  'Be respectful and considerate to all community members'
                )}
              </li>
              <li>
                {t(
                  'community.guideline2',
                  "Keep discussions relevant to women's interests and needs"
                )}
              </li>
              <li>
                {t(
                  'community.guideline3',
                  "Share personal experiences but respect others' privacy"
                )}
              </li>
              <li>
                {t(
                  'community.guideline4',
                  'Provide constructive feedback and support'
                )}
              </li>
              <li>
                {t(
                  'community.guideline5',
                  'Report inappropriate content to moderators'
                )}
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityForum;
