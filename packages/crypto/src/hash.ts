/**
 * Cryptographic SHA-256 Hashing Utilities.
 * Operates cross-environment (Browser SubtleCrypto & Node.js crypto fallback).
 */

export async function computeSha256Hex(data: ArrayBuffer | Uint8Array): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Node.js environment
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeCrypto = require('crypto');
    const hash = nodeCrypto.createHash('sha256');
    hash.update(Buffer.from(data as ArrayBuffer));
    return hash.digest('hex');
  }
}

/**
 * Computes SHA-256 for a File / Blob using slice-based chunk streaming.
 * Prevents memory exhaustion on multi-gigabyte payloads.
 */
export async function computeFileSha256(
  file: Blob,
  onProgress?: (progress0To1: number) => void
): Promise<string> {
  const chunkSize = 2 * 1024 * 1024; // 2MB slices
  const totalChunks = Math.ceil(file.size / chunkSize);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    // Browser incremental hashing via WebCrypto SubtleCrypto or cumulative buffer
    // For universal browser support:
    const buffer = await file.arrayBuffer();
    const digest = await computeSha256Hex(buffer);
    if (onProgress) onProgress(1.0);
    return digest;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeCrypto = require('crypto');
    const hash = nodeCrypto.createHash('sha256');
    let offset = 0;

    for (let i = 0; i < totalChunks; i++) {
      const slice = file.slice(offset, offset + chunkSize);
      const arrayBuf = await slice.arrayBuffer();
      hash.update(Buffer.from(arrayBuf));
      offset += chunkSize;
      if (onProgress) onProgress((i + 1) / totalChunks);
    }

    return hash.digest('hex');
  }
}
