'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  PortalState,
  DeviceModel,
  FileCapsule,
  TransferSession,
  VisibilityMode,
} from '@portallink/core';
import { generateSecureUuid, generateSecurePin } from '@portallink/crypto';
import { createQrInvitation } from '@portallink/pairing';
import { spatialAudio } from '@portallink/ui';

import { SpatialPortal } from '../components/portal/SpatialPortal';
import { DeviceUniverse } from '../components/universe/DeviceUniverse';
import { FileCapsuleMatrix } from '../components/capsule/FileCapsuleMatrix';
import { PinModal } from '../components/pairing/PinModal';
import { QrModal } from '../components/pairing/QrModal';
import { GesturePanel } from '../components/instant/GesturePanel';
import { TransferProgressModal } from '../components/transfer/TransferProgressModal';
import { PortalRoomsModal } from '../components/rooms/PortalRoomsModal';
import { DiagnosticsDrawer } from '../components/diagnostics/DiagnosticsDrawer';

import {
  Send,
  Eye,
  QrCode,
  Sparkles,
  Users,
  Activity,
  Layers,
} from 'lucide-react';

export default function PortalLinkHome() {
  // Self Device Initialization
  const [selfDevice, setSelfDevice] = useState<DeviceModel | null>(null);
  const [visibility, setVisibility] = useState<VisibilityMode>('everyone');
  const [currentRoomId, setCurrentRoomId] = useState<string | undefined>(undefined);

  // Discovery State
  const [discoveredDevices, setDiscoveredDevices] = useState<DeviceModel[]>([]);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);

  // Portal & Transfer State
  const [portalState, setPortalState] = useState<PortalState>('IDLE');
  const [ingestedFiles, setIngestedFiles] = useState<FileCapsule[]>([]);
  const [activeSession, setActiveSession] = useState<TransferSession | null>(null);

  // Modals & Panels
  const [showPinModal, setShowPinModal] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [showGestureModal, setShowGestureModal] = useState(false);
  const [showRoomsModal, setShowRoomsModal] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Initialize Client Identity on Mount
  useEffect(() => {
    const clientId = generateSecureUuid();
    const isMobile = typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);

    const client: DeviceModel = {
      id: clientId,
      displayName: isMobile ? 'Mobile Portal' : 'Primary Workstation',
      category: isMobile ? 'phone' : 'laptop',
      platform: isMobile ? 'android' : 'windows',
      availability: 'available',
      visibility: 'everyone',
      capabilities: {
        supportsWebRTC: true,
        supportsLANSockets: false,
        supportsNearbyP2P: false,
        supportsFileSystemStream: typeof window !== 'undefined' && 'showSaveFilePicker' in window,
        supportsScreenShare: typeof window !== 'undefined' && 'getDisplayMedia' in navigator.mediaDevices,
        maxChunkSize: 64 * 1024,
      },
      supportedTransports: ['webrtc_datachannel', 'relay_fallback'],
      isTrusted: true,
      lastSeenTimestamp: Date.now(),
      telemetry: {
        rttLatencyMs: 18,
      },
    };

    setSelfDevice(client);
  }, []);

  // Update Portal State based on conditions
  useEffect(() => {
    if (activeSession && activeSession.status === 'transferring') {
      setPortalState('TRANSFERRING');
    } else if (activeSession && activeSession.status === 'completed') {
      setPortalState('COMPLETED');
    } else if (activeSession && activeSession.status === 'paused') {
      setPortalState('PAUSED');
    } else if (selectedDeviceIds.length > 0 && ingestedFiles.length > 0) {
      setPortalState('DEVICE_TARGETING');
    } else if (ingestedFiles.length > 0) {
      setPortalState('FILE_RECEIVED');
    } else if (discoveredDevices.length > 0) {
      setPortalState('DEVICE_AVAILABLE');
    } else {
      setPortalState('IDLE');
    }
  }, [discoveredDevices, selectedDeviceIds, ingestedFiles, activeSession]);

  // Handle Drag / Drop Ingestion
  const handleFilesDropped = (files: File[]) => {
    const capsules: FileCapsule[] = files.map((file) => ({
      id: generateSecureUuid(),
      name: file.name,
      sizeBytes: file.size,
      mimeType: file.type || 'application/octet-stream',
      lastModified: file.lastModified,
    }));

    setIngestedFiles((prev) => [...prev, ...capsules]);
  };

  const handleRemoveFile = (fileId: string) => {
    setIngestedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleClearFiles = () => {
    setIngestedFiles([]);
  };

  const handleSelectDevice = (deviceId: string, isMulti: boolean) => {
    if (isMulti) {
      setSelectedDeviceIds((prev) =>
        prev.includes(deviceId) ? prev.filter((id) => id !== deviceId) : [...prev, deviceId]
      );
    } else {
      setSelectedDeviceIds((prev) => (prev.includes(deviceId) ? [] : [deviceId]));
    }
  };

  // Target device lookup
  const targetDevice = useMemo(() => {
    if (selectedDeviceIds.length === 1) {
      return discoveredDevices.find((d) => d.id === selectedDeviceIds[0]);
    }
    return undefined;
  }, [discoveredDevices, selectedDeviceIds]);

  // Initiate Transfer Flow
  const handleInitiateTransfer = () => {
    if (!selfDevice || selectedDeviceIds.length === 0 || ingestedFiles.length === 0) return;

    const sessionId = generateSecureUuid();
    const { pin } = generateSecurePin();
    setCurrentPin(pin);

    const totalBytes = ingestedFiles.reduce((acc, f) => acc + f.sizeBytes, 0);

    const session: TransferSession = {
      sessionId,
      senderDeviceId: selfDevice.id,
      receiverDeviceId: selectedDeviceIds[0],
      files: ingestedFiles,
      status: 'authorizing',
      authorizationMethod: 'six_digit_pin',
      activeTransport: 'webrtc_datachannel',
      requiresPin: true,
      pinTtlSecondsRemaining: 300,
      metrics: {
        bytesTransferred: 0,
        totalBytes,
        currentVelocityBytesPerSec: 0,
        estimatedSecondsRemaining: 0,
        chunksTransferred: 0,
        totalChunks: Math.ceil(totalBytes / (64 * 1024)),
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setActiveSession(session);
    setShowPinModal(true);
  };

  // Mock Streaming Velocity after PIN authorization
  const handleAuthorizePinSuccess = () => {
    setShowPinModal(false);
    if (!activeSession) return;

    setActiveSession((prev) => (prev ? { ...prev, status: 'transferring' } : null));

    // Simulated progress stream based on true bytes
    const total = activeSession.metrics.totalBytes;
    let transferred = 0;
    const interval = setInterval(() => {
      transferred += Math.min(total - transferred, 128 * 1024); // 128KB chunks
      const velocity = 2.4 * 1024 * 1024; // 2.4 MB/s

      setActiveSession((prev) => {
        if (!prev) return null;
        const isDone = transferred >= total;
        if (isDone) {
          clearInterval(interval);
          spatialAudio.playTransferComplete();
          return {
            ...prev,
            status: 'completed',
            metrics: {
              ...prev.metrics,
              bytesTransferred: total,
              chunksTransferred: prev.metrics.totalChunks,
              currentVelocityBytesPerSec: 0,
            },
          };
        }
        return {
          ...prev,
          metrics: {
            ...prev.metrics,
            bytesTransferred: transferred,
            chunksTransferred: Math.ceil(transferred / (64 * 1024)),
            currentVelocityBytesPerSec: velocity,
          },
        };
      });
    }, 150);
  };

  const handleOpenQr = () => {
    if (!selfDevice) return;
    const sessionId = generateSecureUuid();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://portallink.app';
    const { qrUrl } = createQrInvitation(origin, sessionId, selfDevice.id);
    setQrUrl(qrUrl);
    setShowQrModal(true);
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-between p-4 sm:p-6 max-w-7xl mx-auto overflow-hidden">
      {/* Dynamic Ambient Background Light Fields */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/10 via-violet-600/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Top System Header */}
      <header className="relative z-10 flex items-center justify-between py-3 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-white tracking-tight flex items-center space-x-2">
              <span>PORTALLINK</span>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                SPATIAL v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Drop. Connect. Share.
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center space-x-2">
          {/* Room Pill */}
          <button
            onClick={() => setShowRoomsModal(true)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition ${
              currentRoomId
                ? 'bg-violet-950/60 border-violet-500/40 text-violet-300'
                : 'bg-slate-900/60 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-violet-400" />
            <span>{currentRoomId ? `Room: ${currentRoomId}` : 'Rooms'}</span>
          </button>

          {/* Visibility Mode Selector */}
          <button
            onClick={() => {
              const modes: VisibilityMode[] = ['everyone', 'trusted_only', 'room_only', 'invisible'];
              const nextIndex = (modes.indexOf(visibility) + 1) % modes.length;
              setVisibility(modes[nextIndex]);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition"
            title="Toggle Visibility Mode"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="capitalize">{visibility.replace('_', ' ')}</span>
          </button>

          {/* QR Share */}
          <button
            onClick={handleOpenQr}
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition"
            title="Session QR Code"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Gesture / Instant */}
          <button
            onClick={() => setShowGestureModal(true)}
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition"
            title="PortalLink Instant Gesture"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
          </button>

          {/* System Diagnostics */}
          <button
            onClick={() => setShowDiagnostics(true)}
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition"
            title="System Diagnostics & Telemetry"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </header>

      {/* Main Spatial Stage */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center py-6 sm:py-10 space-y-6">
        {/* Living Central Spatial Portal */}
        <SpatialPortal
          state={portalState}
          onFilesDropped={handleFilesDropped}
          targetDeviceName={targetDevice?.displayName}
          transferProgress0To1={
            activeSession && activeSession.metrics.totalBytes > 0
              ? activeSession.metrics.bytesTransferred / activeSession.metrics.totalBytes
              : 0
          }
        />

        {/* Ingested File Capsules */}
        <FileCapsuleMatrix
          files={ingestedFiles}
          onRemoveFile={handleRemoveFile}
          onClearFiles={handleClearFiles}
          onAddMore={() => {
            const el = document.querySelector('input[type="file"]') as HTMLInputElement;
            el?.click();
          }}
        />

        {/* Transfer Action Dispatcher */}
        {ingestedFiles.length > 0 && selectedDeviceIds.length > 0 && (
          <div className="flex items-center space-x-3 animate-bounce">
            <button
              onClick={handleInitiateTransfer}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/25 transition transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Transfer to {targetDevice?.displayName || `${selectedDeviceIds.length} Devices`}</span>
            </button>
          </div>
        )}

        {/* Discovered Device Universe */}
        <DeviceUniverse
          devices={discoveredDevices}
          selectedDeviceIds={selectedDeviceIds}
          onSelectDevice={handleSelectDevice}
          className="mt-4"
        />
      </section>

      {/* Bottom Status Ribbon */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between py-3 border-t border-white/5 text-xs text-slate-400 font-mono space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Device ID: <code className="text-slate-300">{selfDevice?.id.slice(0, 8)}...</code></span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Active Transport: <span className="text-cyan-400 font-semibold">WebRTC Direct P2P</span></span>
          <span className="text-slate-600">|</span>
          <span>Security: <span className="text-emerald-400 font-semibold">DTLS 1.3 / CSPRNG</span></span>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      {showPinModal && (
        <PinModal
          mode="display"
          pinValue={currentPin}
          targetDeviceName={targetDevice?.displayName || 'Target Device'}
          onConfirmPin={handleAuthorizePinSuccess}
          onCancel={() => setShowPinModal(false)}
        />
      )}

      {showQrModal && (
        <QrModal
          qrUrl={qrUrl}
          sessionId={activeSession?.sessionId || 'default'}
          onClose={() => setShowQrModal(false)}
        />
      )}

      {showGestureModal && (
        <GesturePanel
          onGestureComplete={(seq, proof) => {
            setShowGestureModal(false);
            spatialAudio.playTransferComplete();
          }}
          onClose={() => setShowGestureModal(false)}
        />
      )}

      {showRoomsModal && (
        <PortalRoomsModal
          currentRoomId={currentRoomId}
          onJoinRoom={(roomId) => {
            setCurrentRoomId(roomId);
            setShowRoomsModal(false);
          }}
          onLeaveRoom={() => {
            setCurrentRoomId(undefined);
            setShowRoomsModal(false);
          }}
          onClose={() => setShowRoomsModal(false)}
        />
      )}

      {showDiagnostics && (
        <DiagnosticsDrawer
          isOpen={showDiagnostics}
          selfDeviceId={selfDevice?.id || 'Unknown'}
          connectedPeersCount={discoveredDevices.length}
          onClose={() => setShowDiagnostics(false)}
        />
      )}

      {activeSession && (activeSession.status === 'transferring' || activeSession.status === 'paused' || activeSession.status === 'completed') && (
        <TransferProgressModal
          session={activeSession}
          onPause={() => setActiveSession((prev) => (prev ? { ...prev, status: 'paused' } : null))}
          onResume={() => setActiveSession((prev) => (prev ? { ...prev, status: 'transferring' } : null))}
          onCancel={() => setActiveSession(null)}
        />
      )}
    </main>
  );
}
