'use client';

import React from 'react';
import { FileCapsule } from '@portallink/core';
import { File, X, Plus, HardDrive } from 'lucide-react';

interface FileCapsuleMatrixProps {
  files: FileCapsule[];
  onRemoveFile: (fileId: string) => void;
  onClearFiles: () => void;
  onAddMore: () => void;
  className?: string;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const FileCapsuleMatrix: React.FC<FileCapsuleMatrixProps> = ({
  files,
  onRemoveFile,
  onClearFiles,
  onAddMore,
  className = '',
}) => {
  if (files.length === 0) return null;

  const totalBytes = files.reduce((acc, f) => acc + f.sizeBytes, 0);

  return (
    <div className={`w-full max-w-2xl mx-auto portal-glass rounded-2xl p-4 border border-white/10 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <HardDrive className="w-4 h-4 text-cyan-400" />
          <h4 className="font-display font-medium text-sm text-slate-100">
            Ingested Payload ({files.length} {files.length === 1 ? 'file' : 'files'})
          </h4>
          <span className="text-xs font-mono text-cyan-400 font-semibold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
            {formatBytes(totalBytes)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onAddMore}
            className="flex items-center space-x-1 text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add More</span>
          </button>
          <button
            onClick={onClearFiles}
            className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 rounded transition"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="mt-3 max-h-48 overflow-y-auto space-y-2 pr-1">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-800/30 flex items-center justify-center shrink-0">
                <File className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-200 truncate max-w-xs sm:max-w-md">
                  {file.name}
                </p>
                <p className="text-[11px] font-mono text-slate-400">
                  {formatBytes(file.sizeBytes)} • {file.mimeType || 'unknown'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onRemoveFile(file.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition shrink-0 ml-2"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
