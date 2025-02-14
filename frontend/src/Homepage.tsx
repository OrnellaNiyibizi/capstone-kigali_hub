import React from 'react';
import Header from './components/homepage/Header.tsx';
import Hero from './components/homepage/Hero.tsx';
import Objective from './components/homepage/Objective.tsx';
import HighlightedCategories from './components/homepage/HighlightedCategories.tsx';
import SuccessStories from './components/homepage/SuccessStories.tsx';
import CallToAction from './components/homepage/CallToAction.tsx';
import Footer from './components/homepage/Footer.tsx';
import './App.css';

const KigaliWomenHub: React.FC = () => {
  return (
    <div className="flex flex-col bg-gray-100">
      <Header />
      <Hero />
      <Objective />
      <HighlightedCategories />
      <SuccessStories />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default KigaliWomenHub;
