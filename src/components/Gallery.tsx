import React, { useState } from 'react';
import { Trash2, Send, Printer, Camera, Image, Settings, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePhotoStore } from '../store/photoStore';
import { Photo } from '../types';
import EmailDialog from './EmailDialog';
import { useAdminStore } from '../store/adminStore';
import PhotoEditor from './PhotoEditor';

const Gallery: React.FC = () => {
  const photos = usePhotoStore((state) => state.photos);
  const deletePhoto = usePhotoStore((state) => state.deletePhoto);
  const settings = useAdminStore((state) => state.settings);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      deletePhoto(id);
    }
  };

  const handlePrint = (photo: Photo) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Photo</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
              img { max-width: 100%; height: auto; }
              @media print {
                body { margin: 0; padding: 0; }
                img { width: 100%; height: auto; }
              }
            </style>
          </head>
          <body>
            <img src="${photo.url}" alt="Print photo" />
            <script>
              window.onload = () => {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

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

      {/* Gallery Content */}
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Photo Gallery</h1>
        
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
            <Camera size={64} className="mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">No Photos Yet</h2>
            <p className="text-center max-w-md">
              Your captured photos will appear here. Start by taking some amazing photos!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative aspect-[3/4] cursor-pointer group">
                  <img
                    src={photo.thumbnailUrl || photo.url}
                    alt={`Photo ${photo.id}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onClick={() => setSelectedPhoto(photo)}
                    style={{
                      filter: `brightness(${photo.filters.brightness}) contrast(${photo.filters.contrast})`
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />
                </div>
                
                <div className="p-3">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(photo.timestamp).toLocaleString()}
                  </div>
                  
                  <div className="flex justify-end gap-1">
                    {settings.sharing.enableEmail && (
                      <button
                        onClick={() => {
                          setSelectedPhoto(photo);
                          setShowEmailDialog(true);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                        title="Share via Email"
                      >
                        <Send size={18} />
                      </button>
                    )}
                    
                    {settings.sharing.enablePrinting && (
                      <button
                        onClick={() => handlePrint(photo)}
                        className="p-2 text-green-500 hover:bg-green-50 rounded-full"
                        title="Print Photo"
                      >
                        <Printer size={18} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                      title="Delete Photo"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPhoto && !showEmailDialog && (
        <PhotoEditor
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}

      {showEmailDialog && selectedPhoto && (
        <EmailDialog
          imageUrl={selectedPhoto.url}
          settings={settings.sharing}
          onClose={() => {
            setShowEmailDialog(false);
            setSelectedPhoto(null);
          }}
        />
      )}
    </div>
  );
};

export default Gallery;