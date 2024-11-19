import React, { useState } from 'react';
import { X, Printer, CreditCard } from 'lucide-react';
import { SharingSettings } from '../types';
import { initializeSquareTerminal, processPayment } from '../services/squareService';

interface PrintDialogProps {
  onClose: () => void;
  onPrint: (copies: number) => void;
  settings: SharingSettings;
}

const PrintDialog: React.FC<PrintDialogProps> = ({ onClose, onPrint, settings }) => {
  const [copies, setCopies] = useState(1);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  const totalAmount = copies * settings.payment.pricePerPrint;

  const handlePayment = async () => {
    if (!settings.payment.enablePayments) {
      onPrint(copies);
      return;
    }

    setStatus('processing');
    setError('');

    try {
      const terminal = await initializeSquareTerminal(settings.payment);
      await processPayment(terminal, totalAmount * 100, settings.payment.currency);
      
      setStatus('success');
      onPrint(copies);
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setStatus('error');
      setError('Payment failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Print Photos</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Copies
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCopies(Math.max(1, copies - 1))}
                className="px-3 py-1 border rounded-lg"
                disabled={copies <= 1}
              >
                -
              </button>
              <span className="text-xl font-semibold">{copies}</span>
              <button
                onClick={() => setCopies(Math.min(5, copies + 1))}
                className="px-3 py-1 border rounded-lg"
                disabled={copies >= 5}
              >
                +
              </button>
            </div>
          </div>

          {settings.payment.enablePayments && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span>Price per print:</span>
                <span>{settings.payment.currency} {settings.payment.pricePerPrint.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span>Total:</span>
                <span>{settings.payment.currency} {totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={handlePayment}
            disabled={status === 'processing'}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            {settings.payment.enablePayments ? (
              <>
                <CreditCard size={20} />
                {status === 'processing' ? 'Processing...' : 'Pay and Print'}
              </>
            ) : (
              <>
                <Printer size={20} />
                Print
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintDialog;