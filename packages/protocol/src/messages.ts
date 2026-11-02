/**
 * Protocol Message Envelopes for Signaling, Discovery, and Transfer Control.
 */
import { DeviceModel, FileCapsule, TransportType } from '@portallink/core';

export type ProtocolMessageType =
  | 'PRESENCE_BEACON'
  | 'PRESENCE_LEAVE'
  | 'TRANSFER_OFFER'
  | 'TRANSFER_ACCEPT'
  | 'TRANSFER_REJECT'
  | 'AUTHORIZE_REQUEST'
  | 'AUTHORIZE_RESPONSE'
  | 'SDP_OFFER'
  | 'SDP_ANSWER'
  | 'ICE_CANDIDATE'
  | 'TRANSFER_CHUNK_ACK'
  | 'TRANSFER_COMPLETE'
  | 'TRANSFER_CANCEL'
  | 'ERROR_NOTIFICATION';

export interface BaseProtocolMessage {
  protocolVersion: '1.0';
  type: ProtocolMessageType;
  messageId: string;
  senderDeviceId: string;
  targetDeviceId?: string; // Optional for broadcast presence
  timestamp: number;
}

export interface PresenceBeaconMessage extends BaseProtocolMessage {
  type: 'PRESENCE_BEACON';
  device: DeviceModel;
}

export interface PresenceLeaveMessage extends BaseProtocolMessage {
  type: 'PRESENCE_LEAVE';
}

export interface TransferOfferMessage extends BaseProtocolMessage {
  type: 'TRANSFER_OFFER';
  sessionId: string;
  files: FileCapsule[];
  supportedTransports: TransportType[];
  requiresPin: boolean;
  totalSizeBytes: number;
}

export interface TransferAcceptMessage extends BaseProtocolMessage {
  type: 'TRANSFER_ACCEPT';
  sessionId: string;
  chosenTransport: TransportType;
}

export interface TransferRejectMessage extends BaseProtocolMessage {
  type: 'TRANSFER_REJECT';
  sessionId: string;
  reason: 'user_declined' | 'unsupported_format' | 'storage_insufficient' | 'timeout';
}

export interface SdpMessage extends BaseProtocolMessage {
  type: 'SDP_OFFER' | 'SDP_ANSWER';
  sessionId: string;
  sdp: RTCSessionDescriptionInit;
}

export interface IceCandidateMessage extends BaseProtocolMessage {
  type: 'ICE_CANDIDATE';
  sessionId: string;
  candidate: RTCIceCandidateInit;
}

export interface ChunkAckMessage extends BaseProtocolMessage {
  type: 'TRANSFER_CHUNK_ACK';
  sessionId: string;
  chunkIndex: number;
  acknowledgedBytes: number;
}

export interface TransferCompleteMessage extends BaseProtocolMessage {
  type: 'TRANSFER_COMPLETE';
  sessionId: string;
  finalSha256Digest: string;
  totalBytesAcknowledged: number;
}

export interface TransferCancelMessage extends BaseProtocolMessage {
  type: 'TRANSFER_CANCEL';
  sessionId: string;
  reason: string;
}

export type ProtocolMessage =
  | PresenceBeaconMessage
  | PresenceLeaveMessage
  | TransferOfferMessage
  | TransferAcceptMessage
  | TransferRejectMessage
  | SdpMessage
  | IceCandidateMessage
  | ChunkAckMessage
  | TransferCompleteMessage
  | TransferCancelMessage;
