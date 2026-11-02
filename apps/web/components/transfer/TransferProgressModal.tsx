'use client';

import React from 'react';
import { TransferSession } from '@portallink/core';
import { Play, Pause, X, CheckCircle, ShieldCheck, Activity } from 'lucide-react';

interface TransferProgressModalProps {
  session: TransferSession;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const TransferProgressModal: React.FC<TransferProgressModalProps> = ({
  session,
  onPause,
  onResume,
  onCancel,
}) => {
  const { metrics, status, activeTransport, files } = session;
  const progressPercent = metrics.totalBytes > 0
    ? Math.min(100, Math.round((metrics.bytesTransferred / metrics.totalBytes) * 100))
    : 0;

  const velocityFormatted = `${formatBytes(metrics.currentVelocityBytesPerSec)}/s`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="portal-glass relative w-full max-w-lg rounded-2xl p-6 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-slate-100">
                {status === 'completed'
                  ? 'Transfer Complete'
                  : status === 'paused'
                  ? 'Transfer Paused'
                  : 'Streaming Payload'}
              </h3>
              <p className="text-xs font-mono text-cyan-400">
                Transport: {activeTransport.replace(/_/g, ' ').toUpperCase()}
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Real Bytes Transferred */}
        <div className="my-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
            <span>
              {formatBytes(metrics.bytesTransferred)} / {formatBytes(metrics.totalBytes)}
            </span>
            <span className="font-bold text-cyan-400">{progressPercent}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 transition-all duration-300 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
            <span>Velocity: <span className="text-slate-200 font-semibold">{velocityFormatted}</span></span>
            <span>Chunks: {metrics.chunksTransferred} / {metrics.totalChunks}</span>
          </div>
        </div>

        {/* Files in Session */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 max-h-32 overflow-y-auto mb-6">
          <p className="text-[11px] font-mono uppercase text-slate-500 tracking-wider mb-1.5">
            Manifest ({files.length})
          </p>
          {files.map((f) => (
            <div key={f.id} className="flex items-center justify-between text-xs py-1 text-slate-300">
              <span className="truncate max-w-xs">{f.name}</span>
              <span className="font-mono text-slate-400 shrink-0 ml-2">{formatBytes(f.sizeBytes)}</span>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            {status === 'transferring' ? (
              <button
                onClick={onPause}
                className="flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            ) : status === 'paused' ? (
              <button
                onClick={onResume}
                className="flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition"
              >
                <Play className="w-4 h-4" />
                <span>Resume</span>
              </button>
            ) : null}

            <button
              onClick={onCancel}
              className="text-xs text-rose-400 hover:text-rose-300 px-3 py-2 rounded-xl hover:bg-rose-950/30 transition"
            >
              Cancel Transfer
            </button>
          </div>

          <div className="flex items-center space-x-1 text-[11px] font-mono text-emerald-400">
            {status === 'completed' ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                <span>SHA-256 Verified</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Streaming SHA-256</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
