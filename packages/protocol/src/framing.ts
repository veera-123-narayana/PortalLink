/**
 * Binary Chunk Framing Protocol for high-throughput DataChannel / LAN streaming.
 * 
 * Frame Format:
 * [Magic (2B: 0x50, 0x4C)] -> "PL"
 * [Frame Type (1B: 0x01 Chunk, 0x02 EOF)]
 * [Session ID Length (1B)]
 * [Session ID (UTF-8, max 64B)]
 * [Chunk Index (4B uint32 BE)]
 * [Total Chunks (4B uint32 BE)]
 * [Payload Length (4B uint32 BE)]
 * [Payload Bytes (N bytes)]
 */

export const FRAME_MAGIC_1 = 0x50; // 'P'
export const FRAME_MAGIC_2 = 0x4c; // 'L'
export const FRAME_TYPE_DATA = 0x01;
export const FRAME_TYPE_EOF = 0x02;

export interface BinaryFrame {
  type: number;
  sessionId: string;
  chunkIndex: number;
  totalChunks: number;
  payload: Uint8Array;
}

export function encodeBinaryFrame(frame: BinaryFrame): Uint8Array {
  const encoder = new TextEncoder();
  const sessionBytes = encoder.encode(frame.sessionId);
  const sessionLen = sessionBytes.length;

  const headerSize = 2 + 1 + 1 + sessionLen + 4 + 4 + 4;
  const totalSize = headerSize + frame.payload.byteLength;
  const buffer = new Uint8Array(totalSize);
  const view = new DataView(buffer.buffer);

  let offset = 0;
  buffer[offset++] = FRAME_MAGIC_1;
  buffer[offset++] = FRAME_MAGIC_2;
  buffer[offset++] = frame.type;
  buffer[offset++] = sessionLen;

  buffer.set(sessionBytes, offset);
  offset += sessionLen;

  view.setUint32(offset, frame.chunkIndex, false);
  offset += 4;
  view.setUint32(offset, frame.totalChunks, false);
  offset += 4;
  view.setUint32(offset, frame.payload.byteLength, false);
  offset += 4;

  buffer.set(frame.payload, offset);
  return buffer;
}

export function decodeBinaryFrame(data: Uint8Array): BinaryFrame | null {
  if (data.byteLength < 16) {
    return null;
  }

  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  if (data[0] !== FRAME_MAGIC_1 || data[1] !== FRAME_MAGIC_2) {
    return null;
  }

  let offset = 2;
  const type = data[offset++];
  const sessionLen = data[offset++];

  if (data.byteLength < offset + sessionLen + 12) {
    return null;
  }

  const decoder = new TextDecoder();
  const sessionId = decoder.decode(data.subarray(offset, offset + sessionLen));
  offset += sessionLen;

  const chunkIndex = view.getUint32(offset, false);
  offset += 4;
  const totalChunks = view.getUint32(offset, false);
  offset += 4;
  const payloadLen = view.getUint32(offset, false);
  offset += 4;

  const payload = data.subarray(offset, offset + payloadLen);

  return {
    type,
    sessionId,
    chunkIndex,
    totalChunks,
    payload,
  };
}
