/**
 * Memory-Bounded Chunk Slicer.
 * Slices large files incrementally into framed binary chunks.
 */
import { encodeBinaryFrame, BinaryFrame, FRAME_TYPE_DATA, FRAME_TYPE_EOF } from '@portallink/protocol';

export const DEFAULT_CHUNK_SIZE_BYTES = 64 * 1024; // 64 KB per chunk

export interface ChunkSliceProgress {
  chunkIndex: number;
  totalChunks: number;
  bytesProcessed: number;
  totalBytes: number;
  frame: Uint8Array;
}

export class ChunkSlicer {
  private file: Blob;
  private sessionId: string;
  private chunkSize: number;
  private totalChunks: number;

  constructor(file: Blob, sessionId: string, chunkSize: number = DEFAULT_CHUNK_SIZE_BYTES) {
    this.file = file;
    this.sessionId = sessionId;
    this.chunkSize = chunkSize;
    this.totalChunks = Math.max(1, Math.ceil(file.size / chunkSize));
  }

  public getTotalChunks(): number {
    return this.totalChunks;
  }

  public async *sliceStream(): AsyncGenerator<ChunkSliceProgress, void, unknown> {
    let offset = 0;
    let bytesProcessed = 0;

    for (let chunkIndex = 0; chunkIndex < this.totalChunks; chunkIndex++) {
      const slice = this.file.slice(offset, offset + this.chunkSize);
      const arrayBuffer = await slice.arrayBuffer();
      const payload = new Uint8Array(arrayBuffer);

      const frame: BinaryFrame = {
        type: FRAME_TYPE_DATA,
        sessionId: this.sessionId,
        chunkIndex,
        totalChunks: this.totalChunks,
        payload,
      };

      const encodedFrame = encodeBinaryFrame(frame);
      offset += this.chunkSize;
      bytesProcessed += payload.byteLength;

      yield {
        chunkIndex,
        totalChunks: this.totalChunks,
        bytesProcessed,
        totalBytes: this.file.size,
        frame: encodedFrame,
      };
    }

    // Yield final EOF frame
    const eofFrame: BinaryFrame = {
      type: FRAME_TYPE_EOF,
      sessionId: this.sessionId,
      chunkIndex: this.totalChunks,
      totalChunks: this.totalChunks,
      payload: new Uint8Array(0),
    };

    yield {
      chunkIndex: this.totalChunks,
      totalChunks: this.totalChunks,
      bytesProcessed,
      totalBytes: this.file.size,
      frame: encodeBinaryFrame(eofFrame),
    };
  }
}
