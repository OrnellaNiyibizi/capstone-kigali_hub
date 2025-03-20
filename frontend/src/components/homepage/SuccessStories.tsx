import React from 'react';
import { useTranslation } from 'react-i18next';

interface Story {
  name: string;
  content: string;
  role: string;
  image: string;
}

const SuccessStories: React.FC = () => {
  const { t } = useTranslation();

  // Get stories from translations
  const story1 = {
    name: t('successStories.stories.0.name', 'Jane Doe'),
    role: t('successStories.stories.0.role', 'Software Developer'),
    content: t(
      'successStories.stories.0.content',
      'Thanks to Rwanda Women Hub, I found a job that I love and met amazing women who inspire me every day! The resources and networking opportunities have been invaluable to my career growth.'
    ),
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  };

  const story2 = {
    name: t('successStories.stories.1.name', 'Mary Kwizera'),
    role: t('successStories.stories.1.role', 'Entrepreneur'),
    content: t(
      'successStories.stories.1.content',
      "The resources provided here helped me start my own business. I couldn't have done it without this platform! The mentorship program connected me with experienced business leaders who guided me through challenges."
    ),
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  };

  const stories: Story[] = [story1, story2];

  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-purple-900 text-center mb-10">
        {t('successStories.title', 'Success Stories')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stories.map((story, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <img
                src={story.image}
                alt={story.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-bold text-lg text-purple-900">
                  {story.name}
                </h3>
                <p className="text-gray-600">{story.role}</p>
              </div>
            </div>
            <p className="text-gray-700 italic">"{story.content}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessStories;
