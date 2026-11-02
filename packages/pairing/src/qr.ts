/**
 * Session-Bound QR Code Payload Generator & Parser.
 * Places secret token strictly in the URL hash fragment to prevent HTTP server logging.
 */
import { generateSecureUuid } from '@portallink/crypto';

export interface QrInvitationPayload {
  sessionId: string;
  senderDeviceId: string;
  tokenSecret: string;
  expiresAt: number;
}

const DEFAULT_QR_TTL_MS = 300 * 1000; // 5 minutes

export function createQrInvitation(
  baseUrl: string,
  sessionId: string,
  senderDeviceId: string,
  ttlMs: number = DEFAULT_QR_TTL_MS
): { qrUrl: string; invitation: QrInvitationPayload } {
  const tokenSecret = generateSecureUuid();
  const expiresAt = Date.now() + ttlMs;

  const invitation: QrInvitationPayload = {
    sessionId,
    senderDeviceId,
    tokenSecret,
    expiresAt,
  };

  // Secret is placed in hash fragment (#)
  const hashParams = new URLSearchParams({
    s: sessionId,
    from: senderDeviceId,
    k: tokenSecret,
    exp: expiresAt.toString(),
  });

  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const qrUrl = `${cleanBase}/join#${hashParams.toString()}`;

  return { qrUrl, invitation };
}

export function parseQrInvitation(urlOrHash: string): QrInvitationPayload | null {
  try {
    let hash = '';
    if (urlOrHash.includes('#')) {
      hash = urlOrHash.split('#')[1];
    } else {
      hash = urlOrHash;
    }

    const params = new URLSearchParams(hash);
    const sessionId = params.get('s');
    const senderDeviceId = params.get('from');
    const tokenSecret = params.get('k');
    const expStr = params.get('exp');

    if (!sessionId || !senderDeviceId || !tokenSecret || !expStr) {
      return null;
    }

    const expiresAt = parseInt(expStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return null; // Expired
    }

    return {
      sessionId,
      senderDeviceId,
      tokenSecret,
      expiresAt,
    };
  } catch {
    return null;
  }
}
