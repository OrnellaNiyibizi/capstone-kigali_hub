import React from 'react';

interface Story {
  name: string;
  content: string;
  role: string;
  image: string;
}

const stories: Story[] = [
  {
    name: 'Jane Doe',
    role: 'Software Developer',
    content:
      'Thanks to Rwanda Women Hub, I found a job that I love and met amazing women who inspire me every day! The resources and networking opportunities have been invaluable to my career growth.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Mary Kwizera',
    role: 'Entrepreneur',
    content:
      "The resources provided here helped me start my own business. I couldn't have done it without this platform! The mentorship program connected me with experienced business leaders who guided me through challenges.",
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
];

const SuccessStories: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-purple-900 text-center mb-10">
        Success Stories
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
