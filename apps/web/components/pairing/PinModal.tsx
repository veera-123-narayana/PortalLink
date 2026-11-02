'use client';

import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldAlert, Copy, Check, X } from 'lucide-react';

interface PinModalProps {
  mode: 'display' | 'entry';
  pinValue?: string;
  targetDeviceName: string;
  onConfirmPin?: (enteredPin: string) => void;
  onCancel: () => void;
  error?: string;
}

export const PinModal: React.FC<PinModalProps> = ({
  mode,
  pinValue = '',
  targetDeviceName,
  onConfirmPin,
  onCancel,
  error,
}) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    if (pinValue && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(pinValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim().length === 6 && onConfirmPin) {
      onConfirmPin(enteredPin.trim());
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="portal-glass relative w-full max-w-md rounded-2xl p-6 border border-white/10 shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-slate-100">
              {mode === 'display' ? 'Transfer Authorization PIN' : 'Enter Transfer PIN'}
            </h3>
            <p className="text-xs text-slate-400">
              Target: <span className="text-cyan-300 font-medium">{targetDeviceName}</span>
            </p>
          </div>
        </div>

        {mode === 'display' ? (
          <div className="flex flex-col items-center my-6">
            <p className="text-xs text-slate-400 text-center mb-3">
              Share this 6-digit one-time authorization code with the receiver:
            </p>

            <div className="flex items-center space-x-2 my-2">
              <div className="px-6 py-3 rounded-xl bg-slate-900 border border-cyan-500/40 shadow-[0_0_20px_-3px_rgba(14,165,233,0.3)]">
                <span className="font-mono text-3xl font-bold tracking-[0.25em] text-cyan-300">
                  {pinValue}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition"
                title="Copy PIN"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center space-x-1.5 mt-4 text-xs font-mono text-slate-400">
              <span>Code expires in:</span>
              <span className="text-cyan-400 font-semibold">{timeFormatted}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col items-center my-6">
            <p className="text-xs text-slate-400 text-center mb-4">
              Enter the 6-digit PIN displayed on the sender&apos;s screen:
            </p>

            <input
              type="text"
              maxLength={6}
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              autoFocus
              className="w-48 text-center font-mono text-2xl font-bold tracking-[0.3em] px-4 py-3 rounded-xl bg-slate-900 border border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-white placeholder-slate-600 mb-3"
            />

            {error && (
              <div className="flex items-center space-x-1.5 text-xs text-rose-400 bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-800/30 mb-3">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={enteredPin.length !== 6}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-semibold text-sm transition shadow-lg shadow-cyan-500/25"
            >
              Verify &amp; Authorize Transfer
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Zero-Knowledge Authorization</span>
          <span>Max 3 Attempts</span>
        </div>
      </div>
    </div>
  );
};
