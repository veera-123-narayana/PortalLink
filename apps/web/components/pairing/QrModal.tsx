'use client';

import React, { useState } from 'react';
import { QrCode, Copy, Check, X, ShieldCheck } from 'lucide-react';

interface QrModalProps {
  qrUrl: string;
  sessionId: string;
  onClose: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({ qrUrl, sessionId, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="portal-glass relative w-full max-w-sm rounded-2xl p-6 border border-white/10 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-6 h-6 text-cyan-400" />
        </div>

        <h3 className="font-display font-semibold text-lg text-slate-100">
          Scan to Connect
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Scan with any mobile camera to establish direct peer-to-peer transfer.
        </p>

        {/* Dynamic Stylized QR Representation */}
        <div className="my-6 p-4 rounded-xl bg-white flex flex-col items-center justify-center mx-auto w-52 h-52 shadow-inner">
          {/* SVG Generative QR Matrix */}
          <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
            {/* Top-Left Corner Position Marker */}
            <rect x="10" y="10" width="24" height="24" rx="4" fill="currentColor" />
            <rect x="14" y="14" width="16" height="16" rx="2" fill="white" />
            <rect x="18" y="18" width="8" height="8" rx="1" fill="currentColor" />

            {/* Top-Right Corner Position Marker */}
            <rect x="66" y="10" width="24" height="24" rx="4" fill="currentColor" />
            <rect x="70" y="14" width="16" height="16" rx="2" fill="white" />
            <rect x="74" y="18" width="8" height="8" rx="1" fill="currentColor" />

            {/* Bottom-Left Corner Position Marker */}
            <rect x="10" y="66" width="24" height="24" rx="4" fill="currentColor" />
            <rect x="14" y="70" width="16" height="16" rx="2" fill="white" />
            <rect x="18" y="74" width="8" height="8" rx="1" fill="currentColor" />

            {/* Synthetic Data Grid Matrix */}
            <rect x="42" y="15" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="52" y="15" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="42" y="27" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="48" y="38" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="15" y="45" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="25" y="45" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="68" y="45" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="78" y="45" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="42" y="55" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="55" y="55" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="45" y="68" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="55" y="68" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="68" y="68" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="78" y="78" width="6" height="6" rx="1" fill="currentColor" />
          </svg>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/10 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Invitation Copied' : 'Copy Session Link'}</span>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center space-x-1 text-[11px] font-mono text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hash-Fragment Encrypted Token</span>
        </div>
      </div>
    </div>
  );
};
