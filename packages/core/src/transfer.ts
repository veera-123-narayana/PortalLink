/**
 * Transfer Session, File Capsule, and Chunk State Definitions.
 */
import { TransportType } from './device';

export type TransferStatus =
  | 'queued'
  | 'offered'
  | 'authorizing'
  | 'connecting'
  | 'transferring'
  | 'paused'
  | 'resuming'
  | 'verifying'
  | 'completed'
  | 'cancelled'
  | 'failed';

export type AuthorizationMethod =
  | 'six_digit_pin'
  | 'qr_invitation'
  | 'gesture_match'
  | 'trusted_auto';

export interface FileCapsule {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  lastModified: number;
  sha256Digest?: string;
  thumbnailDataUrl?: string;
}

export interface TransferMetrics {
  bytesTransferred: number;
  totalBytes: number;
  currentVelocityBytesPerSec: number;
  estimatedSecondsRemaining: number;
  chunksTransferred: number;
  totalChunks: number;
}

export interface TransferSession {
  sessionId: string;
  senderDeviceId: string;
  receiverDeviceId: string;
  files: FileCapsule[];
  status: TransferStatus;
  authorizationMethod: AuthorizationMethod;
  activeTransport: TransportType;
  requiresPin: boolean;
  pinTtlSecondsRemaining?: number;
  metrics: TransferMetrics;
  createdAt: number;
  updatedAt: number;
  errorMessage?: string;
}
