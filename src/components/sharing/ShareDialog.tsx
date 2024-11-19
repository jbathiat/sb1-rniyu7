import React, { useState } from 'react';
import { Share2, Download, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';
import { SharingSettings } from '../../types';
import { useAnalytics } from '../../hooks/useAnalytics';

interface ShareDialogProps {
  imageUrl: string;
  settings: SharingSettings;
  onClose: () => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ imageUrl, settings, onClose }) => {
  const [showQR, setShowQR] = useState(false);
  const { trackShare, trackQRDownload } = useAnalytics();
  const shareUrl = window.location.origin + '/share/' + encodeURIComponent(imageUrl);
  const title = settings.social.defaultMessage;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: settings.social.defaultMessage,
          url: shareUrl
        });
        trackShare('native');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleQRDownload = (format: 'png' | 'svg') => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      if (format === 'png') {
        link.href = canvas.toDataURL('image/png');
        link.download = 'qr-code.png';
      } else {
        const svg = document.querySelector('svg');
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          link.href = URL.createObjectURL(svgBlob);
          link.download = 'qr-code.svg';
        }
      }
      link.click();
      trackQRDownload(format);
    }
  };

  const getSocialButtonSize = () => {
    switch (settings.social.buttonSize) {
      case 'small': return 32;
      case 'large': return 48;
      default: return 40;
    }
  };

  const buttonSize = getSocialButtonSize();
  const buttonClass = settings.social.buttonStyle === 'round' ? 'rounded-full' : 'rounded-lg';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Share Photo</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Native Share Button */}
        {navigator.share && (
          <button
            onClick={handleNativeShare}
            className="w-full mb-6 flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Share2 size={20} />
            Share
          </button>
        )}

        {/* Social Share Buttons */}
        {settings.social.platforms && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            {settings.social.platforms.facebook && (
              <FacebookShareButton url={shareUrl} quote={title} className={buttonClass}>
                <FacebookIcon size={buttonSize} round={settings.social.buttonStyle === 'round'} />
              </FacebookShareButton>
            )}
            {settings.social.platforms.twitter && (
              <TwitterShareButton url={shareUrl} title={title} className={buttonClass}>
                <TwitterIcon size={buttonSize} round={settings.social.buttonStyle === 'round'} />
              </TwitterShareButton>
            )}
            {settings.social.platforms.linkedin && (
              <LinkedinShareButton url={shareUrl} title={title} className={buttonClass}>
                <LinkedinIcon size={buttonSize} round={settings.social.buttonStyle === 'round'} />
              </LinkedinShareButton>
            )}
            {settings.social.platforms.whatsapp && (
              <WhatsappShareButton url={shareUrl} title={title} className={buttonClass}>
                <WhatsappIcon size={buttonSize} round={settings.social.buttonStyle === 'round'} />
              </WhatsappShareButton>
            )}
          </div>
        )}

        {/* QR Code Section */}
        {settings.enableQRCode && (
          <div className="border-t pt-6">
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full mb-4 flex items-center justify-center gap-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              {showQR ? 'Hide' : 'Show'} QR Code
            </button>

            {showQR && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <QRCodeSVG
                    value={shareUrl}
                    size={settings.qrCode.size}
                    fgColor={settings.qrCode.foregroundColor}
                    bgColor={settings.qrCode.backgroundColor}
                    level="H"
                    includeMargin={settings.qrCode.includeMargin}
                    imageSettings={settings.qrCode.logoUrl ? {
                      src: settings.qrCode.logoUrl,
                      height: 24,
                      width: 24,
                      excavate: true
                    } : undefined}
                  />
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleQRDownload('png')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <Download size={20} />
                    PNG
                  </button>
                  <button
                    onClick={() => handleQRDownload('svg')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Download size={20} />
                    SVG
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareDialog;