/**
 * Transport Layer Types & Abstraction Interfaces.
 */
import { TransportType } from '@portallink/core';
import { BinaryFrame } from '@portallink/protocol';

export type TransportState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'failed';

export interface TransportMetrics {
  currentRttMs: number;
  effectiveBandwidthMbps: number;
  bytesSent: number;
  bytesReceived: number;
  packetsDropped: number;
}

export interface TransportChannel {
  readonly type: TransportType;
  readonly state: TransportState;
  readonly metrics: TransportMetrics;

  connect(targetDeviceId: string, sessionId: string): Promise<void>;
  sendBinary(frame: BinaryFrame): Promise<void>;
  disconnect(): Promise<void>;

  onData(handler: (data: Uint8Array) => void): void;
  onStateChange(handler: (state: TransportState) => void): void;
  onError(handler: (err: Error) => void): void;
}
