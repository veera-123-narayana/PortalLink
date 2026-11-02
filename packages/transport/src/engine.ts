/**
 * Intelligent Transport Engine (ITE).
 * Dynamically selects the optimal transport tier based on network environment,
 * capability intersections, and fallback conditions.
 */
import { DeviceModel, TransportType } from '@portallink/core';
import { TransportChannel } from './types';

export interface TransportEvaluation {
  selectedTransport: TransportType;
  fallbackTransports: TransportType[];
  rationale: string;
}

export class IntelligentTransportEngine {
  /**
   * Evaluates optimal transport hierarchy for a sender -> receiver pairing.
   */
  public evaluateOptimalTransport(
    sender: DeviceModel,
    receiver: DeviceModel
  ): TransportEvaluation {
    const commonTransports = sender.supportedTransports.filter((t) =>
      receiver.supportedTransports.includes(t)
    );

    // Tier 1: Check offline native P2P (if both devices are native Android / iOS)
    if (
      sender.capabilities.supportsNearbyP2P &&
      receiver.capabilities.supportsNearbyP2P &&
      commonTransports.includes('android_nearby')
    ) {
      return {
        selectedTransport: 'android_nearby',
        fallbackTransports: ['lan_socket', 'webrtc_datachannel', 'relay_fallback'],
        rationale: 'High-speed offline Wi-Fi Direct available between native peers.',
      };
    }

    if (
      sender.capabilities.supportsNearbyP2P &&
      receiver.capabilities.supportsNearbyP2P &&
      commonTransports.includes('ios_multipeer')
    ) {
      return {
        selectedTransport: 'ios_multipeer',
        fallbackTransports: ['lan_socket', 'webrtc_datachannel', 'relay_fallback'],
        rationale: 'Apple MultipeerConnectivity available between native Apple peers.',
      };
    }

    // Tier 2: Check Local LAN socket capability
    if (
      sender.capabilities.supportsLANSockets &&
      receiver.capabilities.supportsLANSockets &&
      commonTransports.includes('lan_socket')
    ) {
      return {
        selectedTransport: 'lan_socket',
        fallbackTransports: ['webrtc_datachannel', 'relay_fallback'],
        rationale: 'Direct LAN subnet socket stream preferred for maximum local throughput.',
      };
    }

    // Tier 3: Standard WebRTC P2P DataChannel (Internet & Intranet)
    if (commonTransports.includes('webrtc_datachannel')) {
      return {
        selectedTransport: 'webrtc_datachannel',
        fallbackTransports: ['relay_fallback'],
        rationale: 'WebRTC DataChannel negotiated with DTLS 1.3 encryption across NATs.',
      };
    }

    // Tier 4: Encrypted Zero-Knowledge Relay fallback
    return {
      selectedTransport: 'relay_fallback',
      fallbackTransports: [],
      rationale: 'Direct P2P blocked by restrictive NAT/firewall; routing via encrypted relay.',
    };
  }

  /**
   * Selects next fallback channel if current channel fails.
   */
  public getNextFallback(
    currentTransport: TransportType,
    evaluation: TransportEvaluation
  ): TransportType | null {
    const index = evaluation.fallbackTransports.indexOf(currentTransport);
    if (index >= 0 && index < evaluation.fallbackTransports.length - 1) {
      return evaluation.fallbackTransports[index + 1];
    }
    if (index === -1 && evaluation.fallbackTransports.length > 0) {
      return evaluation.fallbackTransports[0];
    }
    return null;
  }
}
