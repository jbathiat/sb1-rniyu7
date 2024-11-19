import React, { useState } from 'react';
import { X } from 'lucide-react';
import { sendEmail } from '../services/emailService';
import { SharingSettings } from '../types';

interface EmailDialogProps {
  imageUrl: string;
  settings: SharingSettings;
  onClose: () => void;
}

const EmailDialog: React.FC<EmailDialogProps> = ({ imageUrl, settings, onClose }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const success = await sendEmail(imageUrl, email, settings);
    setStatus(success ? 'success' : 'error');

    if (success) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Send Photo via Email</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Recipient Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
              required
            />
          </div>

          {status === 'error' && (
            <p className="text-red-500 text-sm">
              Failed to send email. Please try again.
            </p>
          )}

          {status === 'success' && (
            <p className="text-green-500 text-sm">
              Email sent successfully!
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending' || status === 'success'}
            className={`w-full py-2 rounded-lg text-white ${
              status === 'sending' || status === 'success'
                ? 'bg-gray-400'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {status === 'sending' ? 'Sending...' : 'Send Email'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmailDialog;