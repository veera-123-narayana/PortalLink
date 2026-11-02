# PORTALLINK — COMPREHENSIVE FEATURE STATUS MATRIX
**Version:** 1.0.0-PROD  
**Last Updated:** Phase 0 (Architecture & Repository Setup)  
**Status Taxonomy:**
- `IMPLEMENTED`: Completely built, integrated, type-safe, and functionally operational.
- `PARTIALLY IMPLEMENTED`: Architectural foundation or core logic in progress.
- `NOT IMPLEMENTED`: Scheduled in implementation roadmap.
- `BLOCKED BY PLATFORM`: Hardware or browser security sandbox prevents direct native execution; graceful fallback provided.
- `NEEDS TESTING`: Implementation written, awaiting formal test suite validation.

---

## 1. Feature Matrix by Subsystem

### 1.1 Core Spatial UI & Visual System
| Feature ID | Feature Name | Status | Notes / Limitations |
|---|---|---|---|
| `UI-01` | Living Spatial Portal (14 Visual States) | NOT IMPLEMENTED | Scheduled for Phase 1. Complete SVG ring geometry and particle models defined. |
| `UI-02` | Spatial Device Universe (Radar Canvas) | NOT IMPLEMENTED | Dynamic orbit positioning based on real verified presence. |
| `UI-03` | Obsidian & Bioluminescent Design Tokens | IMPLEMENTED | Specified in `docs/DESIGN_SYSTEM.md`. Tokens ready for CSS injection. |
| `UI-04` | Responsive Mobile Spatial Experience | NOT IMPLEMENTED | Custom mobile touch view with bottom gesture drawer. |
| `UI-05` | High-Contrast & Reduced-Motion Mode | NOT IMPLEMENTED | CSS `@media (prefers-reduced-motion)` hooks planned for Phase 1. |

### 1.2 Device Discovery & Presence
| Feature ID | Feature Name | Status | Notes / Limitations |
|---|---|---|---|
| `DISC-01` | Ephemeral Web Presence Provider | NOT IMPLEMENTED | Scheduled for Phase 2. WebSocket signaling with 45s TTL. |
| `DISC-02` | Zero-Fabrication Rule Enforcement | IMPLEMENTED | Hardcoded/mock device generation strictly prohibited across all code. |
| `DISC-03` | Local LAN Discovery (mDNS / Subnet) | PARTIALLY IMPLEMENTED | Browser sandboxing restricts raw UDP; LAN discovery requires Node/native bridge. |
| `DISC-04` | Silent Nearby Hardware Scanning | BLOCKED BY PLATFORM | Web browsers cannot scan arbitrary BLE/Wi-Fi devices without user intent. |
| `DISC-05` | Real Telemetry (Battery & Latency) | PARTIALLY IMPLEMENTED | Latency measured via WebRTC RTT; battery read only where Battery API exposed. |

### 1.3 File Ingestion & Capsule Pipeline
| Feature ID | Feature Name | Status | Notes / Limitations |
|---|---|---|---|
| `FILE-01` | Non-blocking Drag & Drop Ingestion | NOT IMPLEMENTED | Scheduled for Phase 3. Full multi-file and folder traversal. |
| `FILE-02` | File Capsule Metadata Inspection | NOT IMPLEMENTED | Computes size, MIME type, file count, and thumbnail generation. |
| `FILE-03` | Memory-Bounded Streaming Slicer | NOT IMPLEMENTED | 64KB - 1MB chunk slicing without full RAM caching. |
| `FILE-04` | True Byte Progress & Velocity Calculation | NOT IMPLEMENTED | Velocity computed strictly from receiver ACK messages. |

### 1.4 Security, Pairing & Authorization
| Feature ID | Feature Name | Status | Notes / Limitations |
|---|---|---|---|
| `SEC-01` | 6-Digit CSPRNG PIN Protocol | NOT IMPLEMENTED | `crypto.getRandomValues()` with 3-attempt lockout and 300s TTL (Phase 4). |
| `SEC-02` | Session-Bound Ephemeral QR Codes | NOT IMPLEMENTED | Hash fragment key isolation (`#token=...`) (Phase 6). |
| `SEC-03` | PortalLink Instant (Gesture Matching) | NOT IMPLEMENTED | 16-point vector quantization challenge-response (Phase 10). |
| `SEC-04` | Physical Touch-to-Share Detection | BLOCKED BY PLATFORM | Browsers cannot detect physical phone bumping; fallback to PIN/QR/Gesture. |
| `SEC-05` | Zero-Trust Authorization Gate | NOT IMPLEMENTED | Receiver approval dialog required before any chunk streaming. |

### 1.5 Intelligent Transport Engine (ITE) & Transfer
| Feature ID | Feature Name | Status | Notes / Limitations |
|---|---|---|---|
| `TRAN-01` | WebRTC DataChannel Streaming | NOT IMPLEMENTED | DTLS 1.3 / SCTP P2P streaming over public internet (Phase 5). |
| `TRAN-02` | Direct LAN Socket Transport | NOT IMPLEMENTED | Direct HTTP/2 / WebSocket streaming when on verified same subnet (Phase 7). |
| `TRAN-03` | Automatic Transport Fallback | NOT IMPLEMENTED | Dynamic degradation from LAN -> WebRTC -> Relay. |
| `TRAN-04` | SHA-256 Per-Chunk & File Verification | NOT IMPLEMENTED | WebCrypto streaming digest validation (Phase 5). |
| `TRAN-05` | Resumable Transfer Protocol | NOT IMPLEMENTED | Session tracking with `ByteOffset` acknowledgment. |

### 1.6 Collaboration & Advanced Modes
| Feature ID | Feature Name | Status | Notes / Limitations |
|---|---|---|---|
| `COLL-01` | Multi-Device Selective Transfer | NOT IMPLEMENTED | Independent per-device transfer sessions and queues (Phase 11). |
| `COLL-02` | Broadcast Mode with Explicit Consent | NOT IMPLEMENTED | 1-to-N transfer with participant roster review (Phase 11). |
| `COLL-03` | Portal Rooms (Classroom & Event Mode) | NOT IMPLEMENTED | Room QR code, instructor broadcasts, ephemeral rooms (Phase 11). |
| `COLL-04` | Cross-Device Clipboard & URL Handoff | NOT IMPLEMENTED | Explicit permission gate via `navigator.clipboard` (Phase 12). |
| `COLL-05` | Screen / Window Sharing Streaming | NOT IMPLEMENTED | Permission-based WebRTC media stream sharing (Phase 12). |
| `COLL-06` | Developer Diagnostics & Telemetry Dashboard | NOT IMPLEMENTED | Real-time ICE state, bitrates, transport indicators (Phase 12). |

### 1.7 Native Platform Clients
| Feature ID | Feature Name | Status | Notes / Limitations |
|---|---|---|---|
| `NAT-01` | Android Native Nearby Connections | PARTIALLY IMPLEMENTED | Architecture & stubs in `apps/android`; native build requires Android SDK. |
| `NAT-02` | iOS Native MultipeerConnectivity | PARTIALLY IMPLEMENTED | Architecture & stubs in `apps/ios`; native build requires Xcode / macOS. |
| `NAT-03` | Desktop Client (Electron / Tauri) | NOT IMPLEMENTED | Future milestone; web app functions as PWA in interim. |

---

## 2. Platform Blockers & Graceful Degradation Summary

1. **Raw LAN Multicast in Browsers (`DISC-04`):** W3C browser sandbox isolates web apps from local raw sockets. PortalLink provides graceful fallback via Ephemeral Signaling Room / Local Subnet Hashing.
2. **Physical Device Touch Detection (`SEC-04`):** Web platform lacks hardware bump sensors. PortalLink provides PortalLink Instant (Gesture Matching) and QR Code scanning as instant tactile alternatives.
3. **Silent Device Discovery (`DISC-04`):** Web Bluetooth requires explicit user interaction dialogs. PortalLink never pops up unsolicited prompts, using authenticated presence rooms instead.
