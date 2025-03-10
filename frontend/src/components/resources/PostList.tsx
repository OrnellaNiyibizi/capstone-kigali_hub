import React from 'react';
import PostCard from './PostCard.tsx';

interface Post {
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

const posts: Post[] = [
  {
    title: 'Job Opportunity: Project Manager',
    description:
      'We are looking for a skilled project manager to lead our new initiatives. Experience in community development is a plus.',
    linkText: 'Learn More',
    linkHref: '#',
  },
  {
    title: 'Event: Women in Tech Conference',
    description:
      'Join us for a day of networking and learning from industry leaders. Open to all women interested in technology.',
    linkText: 'Register Here',
    linkHref: '#',
  },
  {
    title: 'Short Course: Digital Marketing',
    description:
      'Enhance your skills with our digital marketing course. Perfect for beginners and professionals looking to upskill.',
    linkText: 'Sign Up Now',
    linkHref: '#',
  },
  {
    title: 'Job Fair: Rwanda Job Expo',
    description:
      'Attend the Rwanda Job Expo to meet potential employers and explore job openings across various sectors.',
    linkText: 'Find Out More',
    linkHref: '#',
  },
  {
    title: 'Workshop: Leadership Skills for Women',
    description:
      'Join our workshop to develop essential leadership skills and connect with like-minded women.',
    linkText: 'Register Today',
    linkHref: '#',
  },
  {
    title: 'Short Course: Financial Literacy',
    description:
      'Learn how to manage your finances effectively in this hands-on course designed for women.',
    linkText: 'Enroll Now',
    linkHref: '#',
  },
  {
    title: 'Networking Event: Women Entrepreneurs',
    description:
      'Connect with fellow women entrepreneurs and share experiences at our monthly networking event.',
    linkText: 'Join Us',
    linkHref: '#',
  },
  {
    title: 'Job Opportunity: Marketing Assistant',
    description:
      'We are seeking a marketing assistant to support our team. Ideal for recent graduates.',
    linkText: 'Apply Now',
    linkHref: '#',
  },
  {
    title: "Event: Women's Health Awareness Day",
    description:
      "Join us for a day of workshops and talks focused on women's health and wellness.",
    linkText: 'Get Involved',
    linkHref: '#',
  },
  {
    title: 'Short Course: Public Speaking',
    description:
      'Improve your public speaking skills in this interactive course designed for women.',
    linkText: 'Register Here',
    linkHref: '#',
  },
];

const PostList: React.FC = () => {
  return (
    <div className="px-5 py-0 mx-auto my-0 max-w-[848px]">
      <h2 className="mx-0 mt-8 mb-6 text-2xl font-semibold">Latest Posts</h2>
      {posts.map((post, index) => (
        <PostCard key={index} {...post} />
      ))}
    </div>
  );
};

export default PostList;
