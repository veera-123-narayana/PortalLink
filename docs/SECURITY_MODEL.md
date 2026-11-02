# PORTALLINK — SECURITY MODEL & THREAT ANALYSIS
**Version:** 1.0.0-PROD  
**Author:** Principal Security Engineer  
**Classification:** Security Architecture & Cryptographic Specification  

---

## 1. Security Philosophy & Principles

PortalLink adopts a **Zero-Trust Transfer Philosophy**. Discovery of a device does not grant permission to transmit files. Authorization is strictly session-bound, ephemeral, and explicit. File payloads are never stored on third-party servers, and signaling servers operate under a zero-knowledge paradigm regarding payload contents.

### Core Axioms:
1. **No Insecure Randomness:** `Math.random()` is banned from any security, session, token, or PIN generation logic. Only `crypto.getRandomValues()` or `crypto.subtle` are permitted.
2. **Transfer-Specific Authorization:** Authorizing a file transfer does NOT permanently pair devices. Authorization is granted for one discrete transfer session and immediately expires upon completion, rejection, or timeout.
3. **Explicit Receiver Consent:** No device will ever automatically accept and write an incoming payload to disk without meeting explicit authorization policies configured by the user.
4. **End-to-End Confidentiality & Integrity:** Data channels utilize DTLS 1.3 encryption, and file payloads are protected with SHA-256 chunk-level verification to prevent in-flight tampering or transmission corruption.

---

## 2. Cryptographic Architecture

### 2.1 One-Time Transfer PIN Generation
Transfer PINs are 6-digit numeric codes generated on the sender device to authorize a pending transfer session.

```typescript
export function generateSecurePin(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  // Unbiased 6-digit modulo generation (100000 - 999999)
  const pin = 100000 + (array[0] % 900000);
  return pin.toString();
}
```

- **Session Expiration:** Default 300 seconds (5 minutes).
- **Attempt Limiting:** Maximum 3 consecutive incorrect PIN attempts before the session is irreversibly invalidated and revoked.
- **Rate Limiting:** Exponential backoff enforced on verification requests (1s, 2s, 4s).
- **Binding:** The PIN is mathematically bound to `session_id` and receiver public key via HMAC-SHA256:
  $$\text{AuthToken} = \text{HMAC-SHA256}(\text{PIN}, \text{SessionID} \parallel \text{ReceiverNonce})$$

### 2.2 Ephemeral Session Keys & WebRTC DTLS-SRTP
- WebRTC DataChannels automatically negotiate ephemeral **DTLS 1.3** handshakes using `ECDSA` (Curve P-256) or `Ed25519` keys generated in-memory on the client.
- Payloads streaming across DataChannels are encrypted at the transport layer with `AES-GCM-256` or `ChaCha20-Poly1305`.
- Intermediate signaling servers only observe encrypted SDP offers/answers and ICE candidates; they never possess the DTLS private keys and cannot decrypt DataChannel packets.

### 2.3 Data Integrity & Streaming Checksums
To guarantee that neither malicious network corruption nor silent buffer truncations compromise files:
1. **Per-Chunk Hash:** Sender computes SHA-256 digest on every binary chunk:
   $$\text{ChunkDigest} = \text{SHA-256}(\text{ChunkIndex} \parallel \text{PayloadBytes})$$
2. **Whole-File Digest:** Sender computes the global SHA-256 hash of the complete source payload.
3. **Final Verification:** Upon receiving all chunks, the receiver validates the cumulative hash against the sender's manifest before flushing to persistent storage.

---

## 3. QR Sharing Security Specification

1. **Short-Lived Invocation URLs:** QR codes encode an ephemeral invitation URL:
   `https://portallink.app/join#s=<session_id>&k=<high_entropy_secret>`
2. **Hash Fragment Isolation:** The session key fragment `k` is stored strictly in the URL hash fragment (`#`), ensuring it is never transmitted to the web server in HTTP request headers or logged in server access logs.
3. **Single-Use Invalidation:** Scanning and resolving the session token invalidates the QR code for subsequent scans.

---

## 4. PortalLink Instant: Gesture Challenge-Response

PortalLink Instant allows two nearby devices to authorize transfers by drawing matching gestures.

1. **Vector Quantization:** Touch/mouse paths are transformed into a normalized sequence of $N=16$ direction vectors (8 cardinal directions: $0..7$).
2. **Zero Raw Path Leakage:** Raw spatial pixel coordinates are never transmitted. The sequence is salted with an ephemeral session challenge and hashed:
   $$\text{GestureProof} = \text{SHA-256}(\text{QuantizedVectorSequence} \parallel \text{SessionChallenge})$$
3. **Tolerance Matching:** Devices calculate directional similarity with an angular tolerance threshold ($\le 15^\circ$ error margin) without compromising cryptographic entropy.

---

## 5. Threat Model & Mitigation Matrix (STRIDE)

| Threat Category | Specific Attack Vector | PortalLink Architectural Mitigation |
|---|---|---|
| **Spoofing** | Attacker impersonates a trusted receiver | Session-bound 6-digit CSPRNG PIN or out-of-band QR token required before transfer initiation. |
| **Tampering** | Man-in-the-Middle modifies binary file chunks | DTLS 1.3 transport encryption + SHA-256 per-chunk and whole-file cryptographic verification. |
| **Repudiation** | Receiver claims file was corrupted or altered | Cryptographic completion receipt with matching SHA-256 hash exchanged before session close. |
| **Information Disclosure** | Eavesdropper reads sensitive file data | P2P direct streaming. No file content ever transits or is stored on signaling servers. |
| **Denial of Service** | Malicious client floods target with huge file offers | Explicit authorization gate + user prompt required before payload transmission begins. |
| **Elevation of Privilege** | Path traversal attempt in file manifest (e.g. `../../etc/passwd`) | Strict client-side sanitization of filenames. OS paths stripped to alphanumeric basenames. |

---

## 6. Privacy & Telemetry Standards

- **Zero Content Logging:** Application logs NEVER record file content, file payloads, or plaintext PINs.
- **Ephemeral Presence:** Device records in discovery registry automatically expire after 45 seconds of silence (TTL).
- **Visibility Modes:** Users can switch to `Invisible`, `Trusted Only`, or `Room Only` at any time with immediate local and presence revocation.
