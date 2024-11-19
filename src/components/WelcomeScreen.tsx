import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, Image, Settings, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAdminStore } from '../store/adminStore';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const settings = useAdminStore((state) => state.settings);

  // Ensure we have default values if settings.uiux.welcomeScreen is undefined
  const welcomeText = {
    heading: settings?.uiux?.welcomeScreen?.heading ?? 'Welcome to WebBooth',
    subheading: settings?.uiux?.welcomeScreen?.subheading ?? 'Capture your perfect moment with our professional photo booth'
  };

  return (
    <div className="min-h-screen relative">
      {/* Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-white hover:text-gray-200 flex items-center gap-2">
              <Camera size={24} />
              <span>WebBooth</span>
            </Link>
            <div className="flex gap-6">
              <Link
                to="/gallery"
                className="flex items-center gap-2 text-white hover:text-gray-200"
              >
                <Image size={20} />
                <span>Gallery</span>
              </Link>
              <Link
                to="/admin"
                className="flex items-center gap-2 text-white hover:text-gray-200"
              >
                <Settings size={20} />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&auto=format&fit=crop&q=80"
          alt="Photography"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-screen flex items-center justify-center">
        <div className="text-center max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">
            {welcomeText.heading}
          </h1>
          
          <p className="text-2xl mb-12 text-gray-100 drop-shadow-md">
            {welcomeText.subheading}
          </p>

          <button
            onClick={() => navigate('/capture')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg hover:scale-105 transform transition-transform duration-200"
          >
            <Camera size={24} />
            Start Capturing
          </button>
        </div>
      </div>

      {/* Need a Photobooth Button */}
      <button
        onClick={() => setShowPopup(true)}
        className="absolute bottom-6 left-6 z-20 px-4 py-2 bg-white/90 hover:bg-white text-gray-800 rounded-lg shadow-lg transition-colors"
      >
        Need a Photobooth?
      </button>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full relative overflow-hidden">
            {/* Header */}
            <div className="bg-blue-500 p-6 text-white">
              <h2 className="text-2xl font-bold text-center">Snapsociety.fr</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* QR Code */}
            <div className="p-8 flex flex-col items-center space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <QRCodeSVG
                  value="https://snapsociety.fr/?=QRbooth"
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              
              <p className="text-gray-600 text-center">
                Scan this QR code to visit Snapsociety and discover our photo booth solutions
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;