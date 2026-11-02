# PORTALLINK — SPATIAL DESIGN SYSTEM SPECIFICATION
**Version:** 1.0.0-PROD  
**Design Reference:** Google Stitch & Spatial Computing Architecture  
**Theme:** Obsidian Space & Dynamic Bioluminescent Fields  

---

## 1. Visual Philosophy & Design Principles

PortalLink abandons flat administrative dashboards, cookie-cutter cards, and plain utility tables in favor of a **living, responsive spatial canvas**. The interface behaves as a coherent spatial environment where interactive objects exert physical presence, light fields emit dynamic reflections, and digital files materialize as tangible capsules.

### 1.1 Fundamental Pillars
1. **Spatial Depth & Hierarchy:** Dark graphite layered planes (`z-index` depth with subtle ambient occlusions and 1px edge reflections) replace arbitrary drop shadows.
2. **Controlled Bioluminescence:** Radiant accents (Electric Cyan, Plasma Violet, Neon Blue) are reserved for active states, energy streams, and critical actions. No excessive glow without functional context.
3. **Organic Micro-Interactions:** Physics-based springs (`stiffness: 300, damping: 25`), smooth magnetic drag snapping, and circular energy pulses communicate system status immediately.
4. **Honest Typography:** Modern, high-legibility geometric sans-serif typefaces (Space Grotesk & Inter) provide crystal-clear data scanning across high-DPI desktop and compact mobile viewports.

---

## 2. Color Architecture & Tokens

The color system is organized into dark obsidian base scales, structural translucent surfaces, and vibrant state-driven bioluminescent accents.

### 2.1 Base Surface Scales (Obsidian & Graphite)
```css
:root {
  /* Absolute Canvas Base */
  --portal-bg-void: #030712;         /* Deepest space background */
  --portal-bg-canvas: #090d16;       /* Main interactive canvas */
  --portal-bg-elevated: #0f172a;     /* Floating panels & backdrops */
  --portal-bg-surface: #1e293b;      /* Cards, capsules, dialog bodies */
  
  /* Translucent Glassmorphic Surfaces */
  --portal-glass-base: rgba(15, 23, 42, 0.65);
  --portal-glass-hover: rgba(30, 41, 59, 0.75);
  --portal-glass-active: rgba(51, 65, 85, 0.85);
  
  /* Borders & Precision Edges (1px hairline treatments) */
  --portal-border-subtle: rgba(255, 255, 255, 0.08);
  --portal-border-prominent: rgba(255, 255, 255, 0.16);
  --portal-border-glow: rgba(56, 189, 248, 0.35);
}
```

### 2.2 Bioluminescent Accents & Spectral Tokens
```css
:root {
  /* Primary Portal Energy (Cyan to Electric Blue) */
  --portal-cyan-400: #38bdf8;
  --portal-cyan-500: #0ea5e9;
  --portal-blue-500: #3b82f6;
  --portal-blue-600: #2563eb;
  
  /* Spatial & Gesture Core (Violet to Plasma Magenta) */
  --portal-violet-400: #a78bfa;
  --portal-violet-500: #8b5cf6;
  --portal-magenta-500: #d946ef;
  
  /* Operational Telemetry States */
  --portal-success: #10b981;        /* Transfer completed / Verified */
  --portal-warning: #f59e0b;        /* Low battery / High latency */
  --portal-error: #ef4444;          /* Authorization failed / Checksum error */
  --portal-offline: #64748b;        /* Disconnected / Sleeping */
}
```

---

## 3. Typography Hierarchy

| Style Role | Font Family | Size | Weight | Line Height | Tracking | Application |
|---|---|---|---|---|---|---|
| **Display Spatial** | Space Grotesk / Inter | 44px (2.75rem) | 700 Bold | 1.1 | -0.03em | Primary Portal hero headings & state callouts |
| **Section Title** | Space Grotesk / Inter | 24px (1.5rem) | 600 SemiBold | 1.25 | -0.02em | Room titles, Device universe badges, Modal headers |
| **Capsule Header** | Inter | 16px (1.0rem) | 600 SemiBold | 1.4 | -0.01em | File capsule names, Target device names |
| **Body Metric** | Inter | 14px (0.875rem) | 400 Regular | 1.5 | 0.0em | Transfer stats, explanations, capability chips |
| **Mono Telemetry** | JetBrains Mono / Fira Code | 13px (0.8125rem) | 500 Medium | 1.4 | 0.02em | 6-digit PIN, SHA-256 hashes, bitrates, latency |

---

## 4. Central Spatial Portal Design Specification

The Portal is the focal point of PortalLink, visually anchoring device presence and transfer velocity.

```
                    . - ~ ~ ~ - .
                . '    Ring 3     ' .
              /     (Pulse Field)     \
             /    . - ~ ~ ~ - .        \
            /   /    Ring 2     \       \
           |   |  (Target Orbit) |       |
           |   |   . - ~ - .     |       |
           |   |  /  Ring 1 \    |       |
           |   | | (Core)   |    |       |
           |   |  \  CORE   /    |       |
           |   |   ' - ~ - '     |       |
            \   \               /       /
             \    ' - ~ ~ ~ - '        /
              \                       /
                . '                 ' .
                    ' - ~ ~ ~ - '
```

### 4.1 Anatomy of the Portal
1. **Outer Resonant Ring (Ring 3):** 360px diameter. Emits ambient wave ripples during discovery and heartbeat events.
2. **Intermediate Navigation Ring (Ring 2):** 270px diameter. Segmented SVG dash lines that rotate dynamically based on transport speed and target lock.
3. **Central Compression Ring (Ring 1):** 180px diameter. Reactive inner perimeter that scales down on hover and contracts on file drag.
4. **Energy Core:** 110px diameter bioluminescent orb with radial gradients (`#0ea5e9` to `#8b5cf6`), particle spark systems, and gravitational dropzone.

### 4.2 The 14 Visual States of the Portal

| State | Visual Treatment | Animation Velocity | Core Glow Palette |
|---|---|---|---|
| `IDLE` | Breathing glow, slow outer ring rotation | 24s full rotation | Soft Slate & Cyan (`rgba(14,165,233,0.15)`) |
| `DISCOVERING` | Expanding concentric sonar pulses | 2.5s loop pulse | Radiant Cyan (`#38bdf8`) |
| `DEVICE_AVAILABLE` | Orbit indicators illuminate along perimeter | Steady glow | Electric Blue (`#3b82f6`) |
| `DRAGGING` | Rings compress inward; core expands by 15% | Magnetic spring | Deep Violet to Cyan (`#8b5cf6 -> #38bdf8`) |
| `FILE_RECEIVED` | Concentric flash and capsule absorption | 400ms ease-out | Emerald to Blue (`#10b981`) |
| `FILE_ANALYSIS` | Segmented ring spins rapidly calculating SHA-256 | 1.2s rotation | Bright Gold to Amber (`#f59e0b`) |
| `DEVICE_TARGETING` | Directional laser/light bridge extends to receiver | Dynamic beam | Electric Cyan & White laser vector |
| `AUTHORIZATION_REQUIRED` | Core pulsates in lock mode, PIN prompt overlay | 1.8s breath cycle | Amber & Plasma Magenta |
| `CONNECTING` | Rings align in cylindrical vortex perspective | 1.5s spin | Electric Blue & Violet |
| `TRANSFERRING` | High-frequency particle stream traveling from sender to target | Dynamic proportional to bytes/sec | Vivid Plasma Violet & Cyan |
| `PAUSED` | Rings halt rotation; core dims to 30% brightness | Static suspended state | Neutral Slate (`#64748b`) |
| `COMPLETED` | Spectacular outward bloom shockwave & emerald halo | 800ms celebration | Brilliant Emerald (`#10b981`) |
| `FAILED` | Rapid tremor animation & crimson particle disperse | 500ms damping shock | Fiery Crimson (`#ef4444`) |
| `OFFLINE` | Monochromatic desaturated wireframe ring | Static | Muted Charcoal (`#334155`) |

---

## 5. Spatial Device Universe Components

### 5.1 Device Node Geometry
- **Outer Shell:** 64px circular glass capsule with 1px border (`rgba(255,255,255,0.12)`).
- **Device Category Icons:** Custom SVG vectors for Laptop, Desktop, Tablet, Phone, and Server.
- **Platform Badges:** Micro-pills at bottom-right of device node (Windows, macOS, Linux, Android, iOS, Web).
- **Signal / Health Ring:** Concentric 2px outer arc indicating latency / connection health:
  - Green (< 30ms latency / Direct LAN)
  - Blue (30-100ms / WebRTC Direct P2P)
  - Yellow (> 100ms / Relay fallback)

---

## 6. Glassmorphic Surface Specifications

```css
.portal-glass-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.01) 100%
  ), rgba(15, 23, 42, 0.70);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 4px 24px -1px rgba(0, 0, 0, 0.40),
    0 0 1px 1px rgba(255, 255, 255, 0.05) inset;
  border-radius: 20px;
}
```

---

## 7. Motion & Accessibility Standards

- **Reduced Motion (`prefers-reduced-motion`):** Disables high-frequency particles, 3D vortex rotation, and tremor effects; transforms them into subtle opacity transitions.
- **Contrast Ratios:** All textual elements against dark obsidian surfaces satisfy WCAG AAA standards (minimum 7:1 ratio for body text, 4.5:1 for telemetry).
- **Keyboard Spatial Navigation:** Users can cycle through participating devices using `Tab` / `Arrow` keys, view target device details via `Spacebar`, and initiate transfer with `Enter`.
