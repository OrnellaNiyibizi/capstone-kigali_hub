import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KigaliWomenHub from './pages/Homepage';
import ResourcesForWomen from './pages/resources/Resources';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import DiscussionList from './pages/discussions/DiscussionList';
import DiscussionDetail from './pages/discussions/DiscussionDetail';
import AddEditDiscussion from './pages/discussions/AddEditDiscussion';
import ResourceDetail from './components/resources/ResourceDetail';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import ProtectedRoute from './context/ProtectedRoute';
import AddEditResource from './pages/resources/AddEditResource';
import CommunityForum from './pages/discussions/Community';
import OfflineIndicator from './components/common/OfflineIndicator';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col bg-gray-100 min-h-screen">
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<KigaliWomenHub />} />
              <Route path="/community" element={<CommunityForum />} />
              <Route path="/discussions" element={<DiscussionList />} />
              <Route path="/discussions/:id" element={<DiscussionDetail />} />
              <Route
                path="/discussions/new"
                element={
                  <ProtectedRoute>
                    <AddEditDiscussion />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/discussions/edit/:id"
                element={
                  <ProtectedRoute>
                    <AddEditDiscussion />
                  </ProtectedRoute>
                }
              />
              <Route path="/resources" element={<ResourcesForWomen />} />
              <Route path="/resources/:id" element={<ResourceDetail />} />
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
                path="/add-resource"
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
          </main>
          <OfflineIndicator />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
