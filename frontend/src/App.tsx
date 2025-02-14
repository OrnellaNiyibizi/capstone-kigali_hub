import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KigaliWomenHub from './Homepage';
import CommunityForum from './Community';
import './App.css';
import ResourcesForWomen from './Resources';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col bg-gray-100">
        <Routes>
          <Route path="/" element={<KigaliWomenHub />} />
          <Route path="/community" element={<CommunityForum />} />
          <Route path="/resources" element={<ResourcesForWomen />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
