import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Camera as CameraIcon, Image, Settings } from 'lucide-react';
import Camera from './components/Camera';
import Gallery from './components/Gallery';
import AdminRoute from './components/admin/AdminRoute';
import WelcomeScreen from './components/WelcomeScreen';
import AppContent from './components/AppContent';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;