'use client';

import React from 'react';
import { DeviceModel, DeviceCategory, PlatformType } from '@portallink/core';
import { Smartphone, Tablet, Laptop, Monitor, Server, Radio, ShieldCheck } from 'lucide-react';

interface DeviceUniverseProps {
  devices: DeviceModel[];
  selectedDeviceIds: string[];
  onSelectDevice: (deviceId: string, isMulti: boolean) => void;
  className?: string;
}

const getCategoryIcon = (category: DeviceCategory) => {
  switch (category) {
    case 'phone':
      return <Smartphone className="w-5 h-5 text-cyan-400" />;
    case 'tablet':
      return <Tablet className="w-5 h-5 text-violet-400" />;
    case 'laptop':
      return <Laptop className="w-5 h-5 text-blue-400" />;
    case 'desktop':
      return <Monitor className="w-5 h-5 text-emerald-400" />;
    case 'server':
      return <Server className="w-5 h-5 text-amber-400" />;
    default:
      return <Laptop className="w-5 h-5 text-slate-400" />;
  }
};

const getPlatformBadge = (platform: PlatformType) => {
  switch (platform) {
    case 'android':
      return 'AND';
    case 'ios':
      return 'iOS';
    case 'windows':
      return 'WIN';
    case 'macos':
      return 'MAC';
    case 'linux':
      return 'LNX';
    case 'web':
    default:
      return 'WEB';
  }
};

export const DeviceUniverse: React.FC<DeviceUniverseProps> = ({
  devices,
  selectedDeviceIds,
  onSelectDevice,
  className = '',
}) => {
  if (devices.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center portal-glass-subtle rounded-2xl border border-white/5 max-w-md mx-auto ${className}`}>
        <div className="w-12 h-12 rounded-full bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center mb-3">
          <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
        </div>
        <h3 className="font-display text-base font-semibold text-slate-200">
          Listening for Participating Devices
        </h3>
        <p className="mt-1 text-xs text-slate-400 leading-relaxed">
          Open PortalLink on another phone, laptop, or tablet on your network or share a Room Code to begin instant spatial transfer.
        </p>
        <span className="mt-3 text-[11px] font-mono text-cyan-400/80 bg-cyan-950/50 px-2.5 py-1 rounded-full border border-cyan-800/30">
          Zero-Fabrication Mode: Real Presence Only
        </span>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <h4 className="text-xs font-mono font-medium tracking-wider text-slate-300 uppercase">
            Discovered Devices ({devices.length})
          </h4>
        </div>
        <span className="text-[11px] text-slate-400">
          Click to select target receiver
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {devices.map((device) => {
          const isSelected = selectedDeviceIds.includes(device.id);

          return (
            <div
              key={device.id}
              onClick={(e) => onSelectDevice(device.id, e.shiftKey || e.metaKey || e.ctrlKey)}
              className={`portal-glass relative p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_-3px_rgba(14,165,233,0.4)]'
                  : 'border-white/10 hover:border-white/20 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-900/80 border border-white/10 flex items-center justify-center">
                    {getCategoryIcon(device.category)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-display font-medium text-sm text-slate-100 truncate max-w-[130px]">
                        {device.displayName}
                      </span>
                      {device.isTrusted && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="Trusted Device" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">
                        {getPlatformBadge(device.platform)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {device.availability}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Telemetry / Signal Indicator */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-mono text-slate-400">
                      {device.telemetry?.rttLatencyMs ? `${device.telemetry.rttLatencyMs}ms` : 'Ready'}
                    </span>
                  </div>
                  {device.telemetry?.batteryLevel !== undefined && (
                    <span className="text-[9px] font-mono text-slate-500 mt-1">
                      {Math.round(device.telemetry.batteryLevel * 100)}% bat
                    </span>
                  )}
                </div>
              </div>

              {isSelected && (
                <div className="mt-2 pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px] text-cyan-300 font-mono">
                  <span>Target Locked</span>
                  <span className="text-white">Ready for payload</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
