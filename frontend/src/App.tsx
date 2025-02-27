import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KigaliWomenHub from './pages/Homepage';
import CommunityForum from './pages/Community';
import ResourcesForWomen from './pages/resources/Resources';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';

import { AuthProvider } from './context/AuthContext';
import './App.css';
import ProtectedRoute from './context/ProtectedRoute';
import AddEditResource from './pages/resources/AddEditResource';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/" element={<KigaliWomenHub />} />
            <Route path="/community" element={<CommunityForum />} />
            <Route path="/resources" element={<ResourcesForWomen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="add-resource"
              element={
                <ProtectedRoute>
                  <AddEditResource />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-resource/:id"
              element={
                <ProtectedRoute>
                  <AddEditResource />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
