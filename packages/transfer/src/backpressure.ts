/**
 * SCTP / DataChannel Backpressure Controller.
 * Ensures buffer does not overflow during high-bandwidth streaming.
 */

export const BUFFERED_AMOUNT_LOW_THRESHOLD = 64 * 1024; // 64 KB threshold
export const MAX_BUFFERED_AMOUNT = 512 * 1024;           // 512 KB upper limit

export async function waitForBackpressureDrain(channel: RTCDataChannel): Promise<void> {
  if (channel.bufferedAmount <= BUFFERED_AMOUNT_LOW_THRESHOLD) {
    return;
  }

  return new Promise((resolve) => {
    channel.bufferedAmountLowThreshold = BUFFERED_AMOUNT_LOW_THRESHOLD;
    const onBufferedAmountLow = () => {
      channel.removeEventListener('bufferedamountlow', onBufferedAmountLow);
      resolve();
    };
    channel.addEventListener('bufferedamountlow', onBufferedAmountLow);
  });
}
