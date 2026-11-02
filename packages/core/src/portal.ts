/**
 * The 14 Authoritative States of the Central Spatial Portal.
 * Every state maps directly to verified system operations.
 */
export type PortalState =
  | 'IDLE'
  | 'DISCOVERING'
  | 'DEVICE_AVAILABLE'
  | 'DRAGGING'
  | 'FILE_RECEIVED'
  | 'FILE_ANALYSIS'
  | 'DEVICE_TARGETING'
  | 'AUTHORIZATION_REQUIRED'
  | 'CONNECTING'
  | 'TRANSFERRING'
  | 'PAUSED'
  | 'COMPLETED'
  | 'FAILED'
  | 'OFFLINE';

export interface PortalMetrics {
  activeRingRotationSpeed: number; // in deg/s
  corePulseIntensity: number;       // 0.0 - 1.0
  bioluminescenceColor: string;     // Hex or CSS var
  particleFlowRate: number;         // particles/sec
}

export const PORTAL_STATE_METRICS: Record<PortalState, PortalMetrics> = {
  IDLE: {
    activeRingRotationSpeed: 15,
    corePulseIntensity: 0.25,
    bioluminescenceColor: 'rgba(14, 165, 233, 0.4)',
    particleFlowRate: 12,
  },
  DISCOVERING: {
    activeRingRotationSpeed: 45,
    corePulseIntensity: 0.6,
    bioluminescenceColor: '#38bdf8',
    particleFlowRate: 35,
  },
  DEVICE_AVAILABLE: {
    activeRingRotationSpeed: 25,
    corePulseIntensity: 0.5,
    bioluminescenceColor: '#3b82f6',
    particleFlowRate: 25,
  },
  DRAGGING: {
    activeRingRotationSpeed: 60,
    corePulseIntensity: 0.85,
    bioluminescenceColor: '#8b5cf6',
    particleFlowRate: 50,
  },
  FILE_RECEIVED: {
    activeRingRotationSpeed: 30,
    corePulseIntensity: 0.9,
    bioluminescenceColor: '#10b981',
    particleFlowRate: 40,
  },
  FILE_ANALYSIS: {
    activeRingRotationSpeed: 90,
    corePulseIntensity: 0.75,
    bioluminescenceColor: '#f59e0b',
    particleFlowRate: 60,
  },
  DEVICE_TARGETING: {
    activeRingRotationSpeed: 40,
    corePulseIntensity: 0.8,
    bioluminescenceColor: '#0ea5e9',
    particleFlowRate: 45,
  },
  AUTHORIZATION_REQUIRED: {
    activeRingRotationSpeed: 20,
    corePulseIntensity: 0.7,
    bioluminescenceColor: '#d946ef',
    particleFlowRate: 30,
  },
  CONNECTING: {
    activeRingRotationSpeed: 75,
    corePulseIntensity: 0.85,
    bioluminescenceColor: '#6366f1',
    particleFlowRate: 65,
  },
  TRANSFERRING: {
    activeRingRotationSpeed: 120,
    corePulseIntensity: 1.0,
    bioluminescenceColor: '#a855f7',
    particleFlowRate: 100,
  },
  PAUSED: {
    activeRingRotationSpeed: 0,
    corePulseIntensity: 0.15,
    bioluminescenceColor: '#64748b',
    particleFlowRate: 5,
  },
  COMPLETED: {
    activeRingRotationSpeed: 20,
    corePulseIntensity: 0.95,
    bioluminescenceColor: '#10b981',
    particleFlowRate: 70,
  },
  FAILED: {
    activeRingRotationSpeed: 5,
    corePulseIntensity: 0.4,
    bioluminescenceColor: '#ef4444',
    particleFlowRate: 10,
  },
  OFFLINE: {
    activeRingRotationSpeed: 0,
    corePulseIntensity: 0.05,
    bioluminescenceColor: '#334155',
    particleFlowRate: 0,
  },
};
