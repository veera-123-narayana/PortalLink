'use client';

import React, { useRef, useState, useEffect } from 'react';
import { quantizeGesture, Point2D, computeGestureProof } from '@portallink/pairing';
import { Sparkles, RefreshCw, X, ShieldCheck } from 'lucide-react';

interface GesturePanelProps {
  sessionChallenge?: string;
  onGestureComplete: (quantizedSequence: number[], proofHash: string) => void;
  onClose: () => void;
  className?: string;
}

export const GesturePanel: React.FC<GesturePanelProps> = ({
  sessionChallenge = 'portal_challenge_default',
  onGestureComplete,
  onClose,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point2D[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI canvas scaling
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#0ea5e9';
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const pt: Point2D = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      timestamp: Date.now(),
    };
    setPoints([pt]);

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pt: Point2D = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      timestamp: Date.now(),
    };
    setPoints((prev) => [...prev, pt]);

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }
  };

  const handlePointerUp = async () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (points.length >= 5) {
      setAnalyzing(true);
      const quantized = quantizeGesture(points);
      const proof = await computeGestureProof(quantized, sessionChallenge);
      setAnalyzing(false);
      onGestureComplete(quantized, proof);
    }
  };

  const handleClear = () => {
    setPoints([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className={`portal-glass relative w-full max-w-md rounded-2xl p-6 border border-white/10 shadow-2xl ${className}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-800/40 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-slate-100">
              PortalLink Instant
            </h3>
            <p className="text-xs text-slate-400">
              Draw a shared gesture on both devices to instantly authorize transfer.
            </p>
          </div>
        </div>

        {/* Dynamic Interactive Drawing Canvas */}
        <div className="relative my-4 rounded-xl overflow-hidden bg-slate-950 border border-cyan-500/30 touch-none shadow-inner">
          <canvas
            ref={canvasRef}
            className="w-full h-64 cursor-crosshair"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          />
          {points.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-600">
              <span className="text-xs font-mono">Draw stroke here</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleClear}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear Canvas</span>
          </button>

          <div className="flex items-center space-x-1 text-[11px] font-mono text-cyan-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{analyzing ? 'Quantizing Vectors...' : '16-Sector Vector Auth'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
