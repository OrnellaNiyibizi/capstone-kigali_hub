import React from 'react';

interface Story {
  name: string;
  content: string;
}

const stories: Story[] = [
  {
    name: 'Jane Doe',
    content:
      'Thanks to Kigali Women Hub, I found a job that I love and met amazing women who inspire me every day!',
  },
  {
    name: 'Mary Kwizera',
    content:
      "The resources provided here helped me start my own business. I couldn't have done it without this platform!",
  },
];

const SuccessStories: React.FC = () => {
  return (
    <div className="flex flex-col px-6 w-full text-base max-md:px-5 max-md:max-w-full">
      <h2 className="self-start mt-8 text-2xl font-semibold leading-none text-black">
        Success Stories
      </h2>
      {stories.map((story, index) => (
        <div
          key={index}
          className="flex overflow-hidden flex-wrap p-4 mt-4 text-black bg-white rounded shadow-sm">
          <div className="font-bold">{story.name}:</div>
          <div className="flex-auto w-[1099px] max-md:max-w-full">
            &quot;{story.content}&quot;
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuccessStories;
