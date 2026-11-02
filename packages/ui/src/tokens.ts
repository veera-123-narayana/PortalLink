/**
 * Authoritative Spatial Design Tokens for PortalLink.
 * Matches Stitch and Spatial Computing design specifications.
 */

export const PORTAL_THEME = {
  colors: {
    bgVoid: '#030712',
    bgCanvas: '#090d16',
    bgElevated: '#0f172a',
    bgSurface: '#1e293b',
    glassBase: 'rgba(15, 23, 42, 0.65)',
    glassHover: 'rgba(30, 41, 59, 0.75)',
    borderSubtle: 'rgba(255, 255, 255, 0.08)',
    borderProminent: 'rgba(255, 255, 255, 0.16)',
    borderGlow: 'rgba(56, 189, 248, 0.35)',
    cyan400: '#38bdf8',
    cyan500: '#0ea5e9',
    blue500: '#3b82f6',
    violet400: '#a78bfa',
    violet500: '#8b5cf6',
    magenta500: '#d946ef',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    offline: '#64748b',
  },
  typography: {
    display: "'Space Grotesk', system-ui, -apple-system, sans-serif",
    body: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  springs: {
    snappy: { stiffness: 400, damping: 28 },
    fluid: { stiffness: 260, damping: 20 },
    subtle: { stiffness: 120, damping: 14 },
  },
} as const;
