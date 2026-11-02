'use client';

import React, { useState, useRef, DragEvent } from 'react';
import { PortalState, PORTAL_STATE_METRICS } from '@portallink/core';
import { spatialAudio } from '@portallink/ui';

interface SpatialPortalProps {
  state: PortalState;
  onFilesDropped: (files: File[]) => void;
  targetDeviceName?: string;
  transferProgress0To1?: number;
  className?: string;
}

export const SpatialPortal: React.FC<SpatialPortalProps> = ({
  state,
  onFilesDropped,
  targetDeviceName,
  transferProgress0To1 = 0,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const metrics = PORTAL_STATE_METRICS[state];

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      spatialAudio.playPortalDrop();
      onFilesDropped(Array.from(e.dataTransfer.files));
    }
  };

  const handleManualSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      spatialAudio.playPortalDrop();
      onFilesDropped(Array.from(e.target.files));
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleManualSelect}
      />

      {/* Outer Glow Halo */}
      <div
        className="absolute w-96 h-96 rounded-full transition-all duration-700 pointer-events-none blur-3xl opacity-40"
        style={{
          background: `radial-gradient(circle, ${metrics.bioluminescenceColor} 0%, transparent 70%)`,
          transform: isDragOver ? 'scale(1.3)' : 'scale(1)',
        }}
      />

      {/* SVG Multi-Ring Spatial System */}
      <div
        className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center cursor-pointer group"
        onClick={() => fileInputRef.current?.click()}
        title="Drop files or click to ingest into portal"
      >
        <svg
          className="w-full h-full transform transition-transform duration-500"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ring 3: Outer Resonant Pulse Ring */}
          <circle
            cx="200"
            cy="200"
            r="180"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            className="animate-spin-slow origin-center"
          />

          {/* Ring 2: Intermediate Navigation Ring */}
          <circle
            cx="200"
            cy="200"
            r="135"
            stroke={metrics.bioluminescenceColor}
            strokeWidth="2.5"
            strokeDasharray="14 16"
            strokeOpacity={isDragOver ? 0.9 : 0.6}
            className="animate-spin-reverse-slow origin-center"
            style={{
              filter: `drop-shadow(0 0 8px ${metrics.bioluminescenceColor})`,
            }}
          />

          {/* Transfer Progress Arc (when TRANSFERRING) */}
          {state === 'TRANSFERRING' && (
            <circle
              cx="200"
              cy="200"
              r="135"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray={`${transferProgress0To1 * 848} 848`}
              strokeLinecap="round"
              className="origin-center -rotate-90 transition-all duration-300"
            />
          )}

          {/* Ring 1: Inner Compression Ring */}
          <circle
            cx="200"
            cy="200"
            r="90"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="origin-center"
            style={{
              transform: isDragOver ? 'scale(0.85)' : 'scale(1)',
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />

          {/* Dynamic Core Glow */}
          <defs>
            <radialGradient id="portalCoreGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="35%" stopColor={metrics.bioluminescenceColor} stopOpacity="0.8" />
              <stop offset="80%" stopColor="#0f172a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#030712" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Central Energy Core */}
          <circle
            cx="200"
            cy="200"
            r={isDragOver ? '65' : '55'}
            fill="url(#portalCoreGradient)"
            className="animate-pulse-glow origin-center transition-all duration-300"
            style={{
              filter: `drop-shadow(0 0 20px ${metrics.bioluminescenceColor})`,
            }}
          />
        </svg>

        {/* Central Spatial Status Indicator */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
          <div className="text-xs font-mono font-medium tracking-widest uppercase text-slate-300 drop-shadow">
            {state.replace(/_/g, ' ')}
          </div>
          {targetDeviceName && (
            <div className="mt-1 text-sm font-display font-semibold text-cyan-300 drop-shadow">
              Target: {targetDeviceName}
            </div>
          )}
          {state === 'TRANSFERRING' && (
            <div className="mt-1 font-mono text-lg font-bold text-white">
              {Math.round(transferProgress0To1 * 100)}%
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Guidance */}
      <div className="mt-4 flex flex-col items-center text-center">
        <p className="text-sm font-medium text-slate-300">
          {isDragOver ? (
            <span className="text-cyan-400 font-semibold">Release to Ingest Files</span>
          ) : (
            <span>
              Drop files here or <span className="text-cyan-400 underline underline-offset-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>browse</span>
            </span>
          )}
        </p>
        <span className="mt-1 text-xs text-slate-500 font-mono">
          End-to-End Encrypted Peer-to-Peer Transfer
        </span>
      </div>
    </div>
  );
};
