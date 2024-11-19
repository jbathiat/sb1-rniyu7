import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';

const LoginForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAdminStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = login(password);
    if (!isValid) {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full">
            <Lock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6">Admin Access</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin password"
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;