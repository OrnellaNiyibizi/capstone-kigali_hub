import React from 'react';
import Header from './components/resources/Header';
import SearchBar from './components/resources/SearchBar';
import PostList from './components/resources/PostList';
import Footer from './components/resources/Footer';

const ResourcesForWomen: React.FC = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <SearchBar />
        <PostList />
        <Footer />
      </div>
    </>
  );
};

export default ResourcesForWomen;
