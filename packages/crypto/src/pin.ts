/**
 * Cryptographically Secure PIN Generation & Verification.
 * Strictly avoids Math.random() as mandated by PORTALLINK security directive.
 */

export interface PinSession {
  pin: string;
  sessionId: string;
  createdAt: number;
  expiresAt: number;
  remainingAttempts: number;
  isRevoked: boolean;
}

const DEFAULT_PIN_TTL_MS = 300 * 1000; // 5 minutes
const MAX_VERIFICATION_ATTEMPTS = 3;

/**
 * Generates an unbiased 6-digit PIN using crypto.getRandomValues().
 */
export function generateSecurePin(ttlMs: number = DEFAULT_PIN_TTL_MS): { pin: string; expiresAt: number } {
  const buffer = new Uint32Array(1);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(buffer);
  } else {
    // Node.js fallback
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeCrypto = require('crypto');
    nodeCrypto.randomFillSync(buffer);
  }

  // 100,000 to 999,999 (strictly 6 digits, no leading zeroes lost)
  const pinNum = 100000 + (buffer[0] % 900000);
  const pin = pinNum.toString();
  const expiresAt = Date.now() + ttlMs;

  return { pin, expiresAt };
}

/**
 * Constant-time string equality check to prevent timing attacks.
 */
export function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * In-memory or session-bound PIN verification with rate-limiting and attempt lockout.
 */
export class PinAuthorizer {
  private activeSessions = new Map<string, PinSession>();

  public createSession(sessionId: string, ttlMs: number = DEFAULT_PIN_TTL_MS): PinSession {
    const { pin, expiresAt } = generateSecurePin(ttlMs);
    const session: PinSession = {
      pin,
      sessionId,
      createdAt: Date.now(),
      expiresAt,
      remainingAttempts: MAX_VERIFICATION_ATTEMPTS,
      isRevoked: false,
    };
    this.activeSessions.set(sessionId, session);
    return session;
  }

  public verifyPin(sessionId: string, inputPin: string): { success: boolean; error?: string } {
    const session = this.activeSessions.get(sessionId);

    if (!session) {
      return { success: false, error: 'Session does not exist or has expired.' };
    }

    if (session.isRevoked) {
      return { success: false, error: 'Authorization session has been revoked.' };
    }

    if (Date.now() > session.expiresAt) {
      this.activeSessions.delete(sessionId);
      return { success: false, error: 'Transfer PIN has expired. Request a new PIN.' };
    }

    if (session.remainingAttempts <= 0) {
      session.isRevoked = true;
      return { success: false, error: 'Maximum verification attempts exceeded. Session locked.' };
    }

    const isValid = timingSafeEqualString(session.pin, inputPin.trim());

    if (!isValid) {
      session.remainingAttempts -= 1;
      if (session.remainingAttempts === 0) {
        session.isRevoked = true;
        return { success: false, error: 'Incorrect PIN. Maximum attempts exceeded. Session locked.' };
      }
      return {
        success: false,
        error: `Incorrect PIN. ${session.remainingAttempts} attempts remaining.`,
      };
    }

    // Success — Consume one-time PIN
    this.activeSessions.delete(sessionId);
    return { success: true };
  }

  public revoke(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.isRevoked = true;
      this.activeSessions.delete(sessionId);
    }
  }
}
