# PORTALLINK

> **"Drop. Connect. Share."**  
> *One Portal. Every Device. Instant Sharing.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Architecture: Spatial Monorepo](https://img.shields.io/badge/Architecture-Spatial%20Monorepo-cyan)](docs/PRODUCT_ARCHITECTURE.md)
[![Status: Production Grade](https://img.shields.io/badge/Status-Phase%200%20Verified-emerald)](docs/FEATURE_STATUS.md)

---

## 1. Executive Summary

PortalLink is an ultra-fast, cross-platform file sharing and spatial collaboration ecosystem. Rejecting traditional cloud intermediaries, file size penalties, and cumbersome pairing steps, PortalLink introduces an interactive **living spatial computing portal** where devices discover each other through verified presence and exchange payloads using an **Intelligent Transport Engine (ITE)** over WebRTC DataChannels, direct local LAN sockets, and native wireless peer-to-peer technologies (Nearby Connections & MultipeerConnectivity).

```
                      +-----------------------------+
                      |   PORTALLINK SPATIAL UI     |
                      | (Spatial Portal, Rings, UI) |
                      +--------------+--------------+
                                     |
               +---------------------+---------------------+
               |                                           |
+--------------v---------------+             +-------------v--------------+
|   DISCOVERY ENGINE           |             |    STREAMING TRANSFER      |
| - Web Presence Provider      |             | - 64KB - 1MB Slicing       |
| - LAN Subnet Discovery       |             | - SCTP Backpressure        |
| - Native Android / iOS P2P   |             | - SHA-256 Checksums        |
+--------------+---------------+             | - Non-blocking Ingestion   |
               |                             +-------------+--------------+
               |                                           |
+--------------v-------------------------------------------v--------------+
|                   INTELLIGENT TRANSPORT ENGINE (ITE)                    |
| Tier 1: Direct Local LAN Sockets (High-Throughput Subnet)               |
| Tier 2: WebRTC DataChannels (DTLS 1.3 / SCTP P2P)                       |
| Tier 3: Native Offline Transports (Wi-Fi Direct / Nearby)               |
| Tier 4: Zero-Knowledge Encrypted Ephemeral Relay Fallback               |
+-------------------------------------------------------------------------+
```

---

## 2. Core Pillars & Principles

1. **Zero Fabrication Guarantee:** No simulated or hardcoded nearby devices in production. Devices appear only upon verified beacon receipt.
2. **Transfer-Specific Authorization:** Authorizing a transfer does NOT permanently pair devices. Single-use 6-digit CSPRNG PINs and hash-fragment QR tokens provide session-bound authorization.
3. **No Insecure Randomness:** `Math.random()` is banned from security operations; only `crypto.getRandomValues()` and WebCrypto primitives are utilized.
4. **Memory-Bounded Streaming:** Payload streaming operates via chunked buffers (64KB - 1MB) with stream backpressure, enabling gigabyte-scale transfers without memory exhaustion.

---

## 3. Monorepo Repository Structure

```
PortalLink/
├── apps/
│   ├── web/                     # Production Next.js 14+ / React Spatial Web Application
│   │   ├── app/                 # App Router (Home, Rooms, Transfer, Diagnostics)
│   │   ├── components/          # Spatial Portal, Device Universe, File Capsules, PIN/QR Modals
│   │   └── styles/              # Obsidian & Bioluminescent CSS Design System
│   ├── android/                 # Native Kotlin Android Client (Nearby Connections & Wi-Fi Direct)
│   └── ios/                     # Native Swift iOS Client (MultipeerConnectivity & Network.framework)
├── packages/
│   ├── core/                    # DeviceModel, PortalState (14 states), TransferSession schemas
│   ├── protocol/                # Binary Framing, Wire Protocol, Message Envelopes
│   ├── crypto/                  # CSPRNG PIN generator, WebCrypto SHA-256 hasher, UUID generator
│   ├── discovery/               # Discovery Provider interfaces, DiscoveryManager, WebPresenceProvider
│   ├── pairing/                 # PortalLink Instant (Gesture Quantization) & Session-Bound QR Invitations
│   ├── transport/               # Intelligent Transport Engine (ITE), Tiered Fallback Decision Matrix
│   ├── transfer/                # Chunk Slicer, Backpressure Controller, Chunk Assembler
│   └── ui/                      # Design tokens, theme palettes, WebAudio spatial synthesizer
├── services/
│   └── signaling/               # Ephemeral WebRTC signaling gateway with 45s TTL presence
├── docs/                        # Authoritative documentation suite
│   ├── PRODUCT_ARCHITECTURE.md
│   ├── DESIGN_SYSTEM.md
│   ├── PLATFORM_CAPABILITIES.md
│   ├── SECURITY_MODEL.md
│   ├── IMPLEMENTATION_ROADMAP.md
│   └── FEATURE_STATUS.md
├── package.json                 # Monorepo workspaces configuration
└── tsconfig.json                # Shared root TypeScript compiler options
```

---

## 4. Documentation Suite

- [Product Architecture Specification](docs/PRODUCT_ARCHITECTURE.md)
- [Spatial Design System & Tokens](docs/DESIGN_SYSTEM.md)
- [Platform Capabilities & Hardware Matrix](docs/PLATFORM_CAPABILITIES.md)
- [Security Model & Threat Analysis (STRIDE)](docs/SECURITY_MODEL.md)
- [Implementation Roadmap (Phase 0 to Phase 13)](docs/IMPLEMENTATION_ROADMAP.md)
- [Feature Status Report](docs/FEATURE_STATUS.md)

---

## 5. Getting Started

### Prerequisites
- **Node.js:** v18.0.0 or higher (v22+ recommended)
- **npm:** v9.0.0 or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/veera-123-narayana/PortalLink.git
cd PortalLink

# Install dependencies across all workspaces
npm install
```

### Running Locally
```bash
# 1. Start the ephemeral signaling gateway
npm run signaling

# 2. In another terminal, start the spatial web application
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 6. License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.