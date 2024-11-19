import { PaymentSettings } from '../types';

export const initializeSquareTerminal = async (settings: PaymentSettings) => {
  try {
    const terminal = await window.Square.payments(settings.squareAccessToken, settings.squareTerminalId);
    return terminal;
  } catch (error) {
    console.error('Failed to initialize Square Terminal:', error);
    throw error;
  }
};

export const processPayment = async (
  terminal: any,
  amount: number,
  currency: string
) => {
  try {
    const payment = await terminal.createPayment({
      amount,
      currency,
      note: 'Photo Prints Payment'
    });
    
    return payment;
  } catch (error) {
    console.error('Payment failed:', error);
    throw error;
  }
};