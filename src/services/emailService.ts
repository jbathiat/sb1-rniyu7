import emailjs from '@emailjs/browser';
import { SharingSettings } from '../types';

export const sendEmail = async (
  imageUrl: string,
  recipientEmail: string,
  settings: SharingSettings
): Promise<boolean> => {
  try {
    const response = await emailjs.send(
      settings.emailjs.serviceId,
      settings.emailjs.templateId,
      {
        to_email: recipientEmail,
        subject: settings.emailjs.defaultSubject,
        message: settings.emailTemplate,
        image_url: imageUrl,
      },
      settings.emailjs.publicKey
    );

    return response.status === 200;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};