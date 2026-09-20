'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Check, QrCode, Share2, Download } from 'lucide-react';
import QRCode from 'qrcode';

interface ShareModalProps {
  slug: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ slug, title, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/w/${slug}`;
      setShareUrl(url);

      if (isOpen && canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, url, {
          width: 200,
          margin: 1.5,
          color: {
            dark: '#1c1917',
            light: '#ffffff',
          },
        });
      }
    }
  }, [slug, isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ønskeliste: ${title}`,
          text: `Her er min ønskeliste: ${title}`,
          url: shareUrl,
        });
      } catch {
        // User cancelled or not supported
      }
    }
  };

  const handleDownloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `oenskeliste-qr-${slug}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-modal border border-stone-100">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-stone-100 text-stone-800 rounded-xl">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Del ønskeliste</h2>
              <p className="text-xs text-stone-500">Send linket til familie og venner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 pt-4">
          {/* Copy Link Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">
              Direkte link til listen
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono text-stone-700 select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-3.5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-medium hover:bg-stone-800 transition-colors flex items-center gap-1.5 flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Kopieret!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Kopier</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 flex flex-col items-center text-center space-y-2.5">
            <div className="p-2.5 bg-white rounded-xl border border-stone-200 shadow-xs">
              <canvas ref={canvasRef} className="w-[160px] h-[160px]" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-800">Printbar QR-kode</p>
              <p className="text-[11px] text-stone-500">
                Perfekt til at printe på fysiske invitationer eller bordkort
              </p>
            </div>
            <button
              onClick={handleDownloadQR}
              className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium py-1 px-2.5 rounded-lg hover:bg-stone-200/50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download QR-billede</span>
            </button>
          </div>

          {/* Mobile Native Share button */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Del via WhatsApp, Beskeder eller Mail</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors"
          >
            Færdig
          </button>
        </div>
      </div>
    </div>
  );
}
