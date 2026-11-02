/**
 * Web Presence Discovery Provider.
 * Connects to the ephemeral signaling / presence gateway.
 */
import { DeviceModel } from '@portallink/core';
import { PresenceBeaconMessage } from '@portallink/protocol';
import { DiscoveryProvider, DeviceDiscoveryCallback, DeviceLostCallback } from './provider';

export class WebPresenceProvider implements DiscoveryProvider {
  public readonly id = 'web_presence_provider';
  public readonly name = 'Web Presence Provider';
  public readonly isSupported = typeof window !== 'undefined';

  private ws: WebSocket | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private selfDevice: DeviceModel | null = null;
  private onDiscovered: DeviceDiscoveryCallback | null = null;
  private onLost: DeviceLostCallback | null = null;
  private signalingUrl: string;

  constructor(signalingUrl: string = 'ws://localhost:9001') {
    this.signalingUrl = signalingUrl;
  }

  public async start(
    selfDevice: DeviceModel,
    onDeviceDiscovered: DeviceDiscoveryCallback,
    onDeviceLost: DeviceLostCallback
  ): Promise<void> {
    this.selfDevice = selfDevice;
    this.onDiscovered = onDeviceDiscovered;
    this.onLost = onDeviceLost;

    this.connect();
  }

  private connect(): void {
    if (!this.isSupported || !this.selfDevice) return;

    try {
      this.ws = new WebSocket(this.signalingUrl);

      this.ws.onopen = () => {
        this.broadcastPresence(this.selfDevice!);
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'PRESENCE_BEACON' && msg.device) {
            if (this.onDiscovered) {
              this.onDiscovered(msg.device);
            }
          } else if (msg.type === 'PRESENCE_LEAVE' && msg.senderDeviceId) {
            if (this.onLost) {
              this.onLost(msg.senderDeviceId);
            }
          }
        } catch {
          // Ignore malformed payloads
        }
      };

      this.ws.onclose = () => {
        this.stopHeartbeat();
        // Exponential backoff reconnect
        setTimeout(() => this.connect(), 5000);
      };
    } catch (err) {
      console.warn('[WebPresenceProvider] WebSocket connection error:', err);
    }
  }

  public async stop(): Promise<void> {
    this.stopHeartbeat();
    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN && this.selfDevice) {
        this.ws.send(
          JSON.stringify({
            protocolVersion: '1.0',
            type: 'PRESENCE_LEAVE',
            messageId: 'leave_' + Date.now(),
            senderDeviceId: this.selfDevice.id,
            timestamp: Date.now(),
          })
        );
      }
      this.ws.close();
      this.ws = null;
    }
  }

  public async broadcastPresence(selfDevice: DeviceModel): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg: PresenceBeaconMessage = {
        protocolVersion: '1.0',
        type: 'PRESENCE_BEACON',
        messageId: 'presence_' + Date.now(),
        senderDeviceId: selfDevice.id,
        timestamp: Date.now(),
        device: selfDevice,
      };
      this.ws.send(JSON.stringify(msg));
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.selfDevice) {
        this.broadcastPresence(this.selfDevice);
      }
    }, 15000); // 15s heartbeat
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}
