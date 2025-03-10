import React from 'react';
import Header from '../components/common/Header.tsx';
import Hero from '../components/homepage/Hero.tsx';
import Objective from '../components/homepage/Objective.tsx';
import HighlightedCategories from '../components/homepage/HighlightedCategories.tsx';
import SuccessStories from '../components/homepage/SuccessStories.tsx';
import CallToAction from '../components/homepage/CallToAction.tsx';
import Footer from '../components/common/Footer.tsx';

const RwandaWomenHub: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <main className="flex-grow">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <Hero />

          <section className="py-12 md:py-16">
            <Objective />
          </section>

          <section className="py-12 md:py-16 bg-white rounded-xl shadow-sm">
            <HighlightedCategories />
          </section>

          <section className="py-12 md:py-16">
            <SuccessStories />
          </section>
        </div>

        <section className="bg-purple-50 py-16 mt-12">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <CallToAction />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RwandaWomenHub;
