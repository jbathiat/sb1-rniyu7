import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Camera from './Camera';
import Gallery from './Gallery';
import AdminRoute from './admin/AdminRoute';
import WelcomeScreen from './WelcomeScreen';
import { useInactivityTimer } from '../hooks/useInactivityTimer';

const AppContent: React.FC = () => {
  useInactivityTimer();

  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/capture" element={<Camera />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin" element={<AdminRoute />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppContent;