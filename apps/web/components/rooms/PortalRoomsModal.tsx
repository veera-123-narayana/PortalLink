'use client';

import React, { useState } from 'react';
import { Users, GraduationCap, Calendar, X, Plus, LogIn } from 'lucide-react';

interface PortalRoomsModalProps {
  currentRoomId?: string;
  onJoinRoom: (roomId: string, mode: 'standard' | 'classroom' | 'event') => void;
  onLeaveRoom: () => void;
  onClose: () => void;
}

export const PortalRoomsModal: React.FC<PortalRoomsModalProps> = ({
  currentRoomId,
  onJoinRoom,
  onLeaveRoom,
  onClose,
}) => {
  const [roomIdInput, setRoomIdInput] = useState('');
  const [selectedMode, setSelectedMode] = useState<'standard' | 'classroom' | 'event'>('standard');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomIdInput.trim()) {
      onJoinRoom(roomIdInput.trim().toUpperCase(), selectedMode);
    }
  };

  const handleGenerateRoom = () => {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    onJoinRoom(randomCode, selectedMode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="portal-glass relative w-full max-w-md rounded-2xl p-6 border border-white/10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-800/40 flex items-center justify-center">
            <Users className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-slate-100">
              Portal Rooms
            </h3>
            <p className="text-xs text-slate-400">
              Collaborative multi-device environments with controlled broadcasts.
            </p>
          </div>
        </div>

        {currentRoomId ? (
          <div className="my-6 p-4 rounded-xl bg-violet-950/30 border border-violet-500/30 text-center">
            <span className="text-xs font-mono uppercase tracking-wider text-violet-300">Active Room</span>
            <div className="font-mono text-3xl font-bold tracking-widest text-white my-2">
              {currentRoomId}
            </div>
            <button
              onClick={onLeaveRoom}
              className="mt-2 text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg hover:bg-rose-950/30 transition"
            >
              Leave Room
            </button>
          </div>
        ) : (
          <form onSubmit={handleJoin} className="my-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Room Sharing Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMode('standard')}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    selectedMode === 'standard'
                      ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200'
                      : 'border-white/5 bg-slate-900/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Users className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[11px] font-medium block">Standard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMode('classroom')}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    selectedMode === 'classroom'
                      ? 'border-violet-400 bg-violet-950/40 text-violet-200'
                      : 'border-white/5 bg-slate-900/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[11px] font-medium block">Classroom</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMode('event')}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    selectedMode === 'event'
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                      : 'border-white/5 bg-slate-900/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Calendar className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[11px] font-medium block">Event</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Room Code (6 characters)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  maxLength={8}
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
                  placeholder="e.g. WORK77"
                  className="w-full font-mono uppercase text-sm px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 focus:border-cyan-400 focus:outline-none text-white placeholder-slate-600"
                />
                <button
                  type="submit"
                  disabled={!roomIdInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-semibold text-xs transition flex items-center space-x-1 shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Join</span>
                </button>
              </div>
            </div>

            <div className="pt-2 text-center">
              <span className="text-xs text-slate-500">or</span>
              <button
                type="button"
                onClick={handleGenerateRoom}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-white/10 transition flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Create New Room</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
