/**
 * Normalized Device Model across Web, Android, iOS, and Desktop platforms.
 */

export type DeviceCategory = 'phone' | 'tablet' | 'laptop' | 'desktop' | 'server' | 'other';

export type PlatformType = 'web' | 'android' | 'ios' | 'windows' | 'macos' | 'linux';

export type TransportType =
  | 'webrtc_datachannel'
  | 'lan_socket'
  | 'android_nearby'
  | 'ios_multipeer'
  | 'relay_fallback';

export type DeviceAvailability =
  | 'available'
  | 'connecting'
  | 'connected'
  | 'busy'
  | 'offline'
  | 'hidden'
  | 'blocked';

export type VisibilityMode =
  | 'everyone'
  | 'trusted_only'
  | 'contacts'
  | 'room_only'
  | 'invisible';

export interface DeviceCapabilities {
  supportsWebRTC: boolean;
  supportsLANSockets: boolean;
  supportsNearbyP2P: boolean;
  supportsFileSystemStream: boolean;
  supportsScreenShare: boolean;
  maxChunkSize: number; // in bytes
}

export interface DeviceTelemetry {
  batteryLevel?: number;   // 0.0 - 1.0 (null if platform unsupported)
  isCharging?: boolean;
  estimatedBandwidthMbps?: number;
  rttLatencyMs?: number;
}

export interface DeviceModel {
  id: string;
  displayName: string;
  category: DeviceCategory;
  platform: PlatformType;
  availability: DeviceAvailability;
  visibility: VisibilityMode;
  capabilities: DeviceCapabilities;
  supportedTransports: TransportType[];
  isTrusted: boolean;
  lastSeenTimestamp: number;
  telemetry?: DeviceTelemetry;
  publicKey?: string; // Hex-encoded public key for session negotiation
}
