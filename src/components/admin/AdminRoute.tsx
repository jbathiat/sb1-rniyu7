import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { Camera, Image, Home } from 'lucide-react';
import LoginForm from './LoginForm';
import SettingsPanel from './SettingsPanel';

const AdminRoute: React.FC = () => {
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <div className="bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-white hover:text-gray-200 flex items-center gap-2">
              <Home size={24} />
              <span>WebBooth</span>
            </Link>
            <div className="flex gap-6">
              <Link
                to="/capture"
                className="flex items-center gap-2 text-white hover:text-gray-200"
              >
                <Camera size={20} />
                <span>Camera</span>
              </Link>
              <Link
                to="/gallery"
                className="flex items-center gap-2 text-white hover:text-gray-200"
              >
                <Image size={20} />
                <span>Gallery</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="container mx-auto p-6">
        <SettingsPanel />
      </div>
    </div>
  );
};

export default AdminRoute;