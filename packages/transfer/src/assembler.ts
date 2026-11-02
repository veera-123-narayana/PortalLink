/**
 * Chunk Assembler & Integrity Verifier.
 * Gathers incoming binary frames, tracks received byte counts, and validates final SHA-256 hash.
 */
import { decodeBinaryFrame, FRAME_TYPE_DATA, FRAME_TYPE_EOF } from '@portallink/protocol';
import { computeSha256Hex } from '@portallink/crypto';

export interface AssemblyProgress {
  sessionId: string;
  chunksReceived: number;
  totalChunks: number;
  bytesReceived: number;
  isComplete: boolean;
}

export class ChunkAssembler {
  private sessionId: string;
  private totalChunks: number = 0;
  private chunks = new Map<number, Uint8Array>();
  private bytesReceived = 0;
  private isComplete = false;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  public ingestFrame(rawFrame: Uint8Array): AssemblyProgress | null {
    const frame = decodeBinaryFrame(rawFrame);
    if (!frame || frame.sessionId !== this.sessionId) {
      return null;
    }

    if (frame.type === FRAME_TYPE_EOF) {
      this.isComplete = true;
      return {
        sessionId: this.sessionId,
        chunksReceived: this.chunks.size,
        totalChunks: this.totalChunks || this.chunks.size,
        bytesReceived: this.bytesReceived,
        isComplete: true,
      };
    }

    if (frame.type === FRAME_TYPE_DATA) {
      if (!this.chunks.has(frame.chunkIndex)) {
        this.chunks.set(frame.chunkIndex, frame.payload);
        this.bytesReceived += frame.payload.byteLength;
        this.totalChunks = frame.totalChunks;
      }
    }

    return {
      sessionId: this.sessionId,
      chunksReceived: this.chunks.size,
      totalChunks: this.totalChunks,
      bytesReceived: this.bytesReceived,
      isComplete: false,
    };
  }

  public assembleBlob(mimeType: string = 'application/octet-stream'): Blob {
    const parts: Uint8Array[] = [];
    for (let i = 0; i < this.totalChunks; i++) {
      const chunk = this.chunks.get(i);
      if (chunk) {
        parts.push(chunk);
      }
    }
    return new Blob(parts, { type: mimeType });
  }

  public async verifyIntegrity(expectedSha256Digest: string): Promise<boolean> {
    const blob = this.assembleBlob();
    const arrayBuf = await blob.arrayBuffer();
    const calculatedDigest = await computeSha256Hex(arrayBuf);
    return calculatedDigest.toLowerCase() === expectedSha256Digest.toLowerCase();
  }
}
