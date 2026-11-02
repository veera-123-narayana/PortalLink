/**
 * PortalLink Instant — Gesture-Based Authorization Protocol.
 * Converts 2D continuous strokes into 16 quantized directional vectors.
 * Employs cryptographic challenge-response without leaking raw coordinates.
 */
import { computeSha256Hex } from '@portallink/crypto';

export interface Point2D {
  x: number;
  y: number;
  timestamp: number;
}

const VECTOR_COUNT = 16;
const SIMILARITY_THRESHOLD = 0.82; // 82% angular match tolerance

/**
 * Resamples stroke points into equidistant points and calculates cardinal direction vectors.
 * Returns an array of 16 quantized direction values (0 to 7: 8 cardinal compass directions).
 */
export function quantizeGesture(points: Point2D[]): number[] {
  if (points.length < 2) {
    return new Array(VECTOR_COUNT).fill(0);
  }

  // 1. Calculate cumulative stroke lengths
  const lengths: number[] = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    lengths.push(lengths[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }

  const totalLength = lengths[lengths.length - 1];
  if (totalLength === 0) {
    return new Array(VECTOR_COUNT).fill(0);
  }

  // 2. Resample into VECTOR_COUNT + 1 equidistant vertices
  const step = totalLength / VECTOR_COUNT;
  const resampled: { x: number; y: number }[] = [points[0]];

  let currentDist = step;
  let segIndex = 0;

  for (let i = 1; i <= VECTOR_COUNT; i++) {
    while (segIndex < points.length - 1 && lengths[segIndex + 1] < currentDist) {
      segIndex++;
    }

    if (segIndex >= points.length - 1) {
      resampled.push(points[points.length - 1]);
    } else {
      const segStart = lengths[segIndex];
      const segEnd = lengths[segIndex + 1];
      const t = (currentDist - segStart) / (segEnd - segStart || 1);
      resampled.push({
        x: points[segIndex].x + t * (points[segIndex + 1].x - points[segIndex].x),
        y: points[segIndex].y + t * (points[segIndex + 1].y - points[segIndex].y),
      });
    }
    currentDist += step;
  }

  // 3. Compute angles and quantize into 8 discrete sectors (0-7)
  const quantized: number[] = [];
  for (let i = 0; i < VECTOR_COUNT; i++) {
    const dx = resampled[i + 1].x - resampled[i].x;
    const dy = resampled[i + 1].y - resampled[i].y;
    let angleRad = Math.atan2(dy, dx);
    if (angleRad < 0) angleRad += 2 * Math.PI;

    // 8 sectors: 0 = East, 2 = South, 4 = West, 6 = North
    const sector = Math.round((angleRad / (2 * Math.PI)) * 8) % 8;
    quantized.push(sector);
  }

  return quantized;
}

/**
 * Calculates similarity coefficient between two quantized gesture vectors.
 */
export function calculateGestureSimilarity(seqA: number[], seqB: number[]): number {
  if (seqA.length !== VECTOR_COUNT || seqB.length !== VECTOR_COUNT) {
    return 0;
  }

  let totalDiff = 0;
  for (let i = 0; i < VECTOR_COUNT; i++) {
    const diff = Math.abs(seqA[i] - seqB[i]);
    // Circular sector difference (e.g., sector 0 and 7 have difference of 1)
    const circularDiff = Math.min(diff, 8 - diff);
    totalDiff += circularDiff;
  }

  // Max difference per segment is 4 (180 deg opposite)
  const maxPossibleDiff = VECTOR_COUNT * 4;
  return 1 - totalDiff / maxPossibleDiff;
}

/**
 * Computes a salted gesture challenge response hash.
 */
export async function computeGestureProof(
  quantizedSequence: number[],
  sessionChallenge: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${quantizedSequence.join(',')}:${sessionChallenge}`);
  return computeSha256Hex(data);
}

export function isGestureMatch(seqA: number[], seqB: number[]): boolean {
  return calculateGestureSimilarity(seqA, seqB) >= SIMILARITY_THRESHOLD;
}
