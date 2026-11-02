/**
 * Discovery Manager — Orchestrates discovery providers and manages active devices.
 * Strict zero-fabrication guarantee: devices appear only upon verified beacon receipt.
 */
import { DeviceModel } from '@portallink/core';
import { DiscoveryProvider } from './provider';

const DEFAULT_DEVICE_TTL_MS = 45 * 1000; // 45 seconds eviction window

export class DiscoveryManager {
  private providers: DiscoveryProvider[] = [];
  private activeDevices = new Map<string, DeviceModel>();
  private selfDevice: DeviceModel | null = null;
  private ttlIntervalId: ReturnType<typeof setInterval> | null = null;
  private listeners = new Set<(devices: DeviceModel[]) => void>();

  constructor(providers: DiscoveryProvider[] = []) {
    this.providers = providers.filter((p) => p.isSupported);
  }

  public registerProvider(provider: DiscoveryProvider): void {
    if (provider.isSupported && !this.providers.some((p) => p.id === provider.id)) {
      this.providers.push(provider);
    }
  }

  public async start(selfDevice: DeviceModel): Promise<void> {
    this.selfDevice = selfDevice;
    this.activeDevices.clear();

    for (const provider of this.providers) {
      try {
        await provider.start(
          selfDevice,
          (device) => this.handleDeviceDiscovered(device),
          (deviceId) => this.handleDeviceLost(deviceId)
        );
      } catch (err) {
        console.warn(`[DiscoveryManager] Failed to start provider ${provider.name}:`, err);
      }
    }

    // Periodic eviction of expired devices
    this.ttlIntervalId = setInterval(() => {
      this.evictExpiredDevices();
    }, 5000);
  }

  public async stop(): Promise<void> {
    if (this.ttlIntervalId) {
      clearInterval(this.ttlIntervalId);
      this.ttlIntervalId = null;
    }

    for (const provider of this.providers) {
      try {
        await provider.stop();
      } catch (err) {
        console.warn(`[DiscoveryManager] Error stopping provider ${provider.name}:`, err);
      }
    }

    this.activeDevices.clear();
    this.notifyListeners();
  }

  public subscribe(callback: (devices: DeviceModel[]) => void): () => void {
    this.listeners.add(callback);
    callback(Array.from(this.activeDevices.values()));
    return () => this.listeners.delete(callback);
  }

  public getDevices(): DeviceModel[] {
    return Array.from(this.activeDevices.values());
  }

  public getDeviceById(id: string): DeviceModel | undefined {
    return this.activeDevices.get(id);
  }

  private handleDeviceDiscovered(device: DeviceModel): void {
    if (this.selfDevice && device.id === this.selfDevice.id) {
      return; // Do not display self in discovered universe
    }

    this.activeDevices.set(device.id, {
      ...device,
      lastSeenTimestamp: Date.now(),
    });

    this.notifyListeners();
  }

  private handleDeviceLost(deviceId: string): void {
    if (this.activeDevices.has(deviceId)) {
      this.activeDevices.delete(deviceId);
      this.notifyListeners();
    }
  }

  private evictExpiredDevices(): void {
    const now = Date.now();
    let changed = false;

    for (const [id, device] of this.activeDevices.entries()) {
      if (now - device.lastSeenTimestamp > DEFAULT_DEVICE_TTL_MS) {
        this.activeDevices.delete(id);
        changed = true;
      }
    }

    if (changed) {
      this.notifyListeners();
    }
  }

  private notifyListeners(): void {
    const deviceList = Array.from(this.activeDevices.values());
    for (const listener of this.listeners) {
      try {
        listener(deviceList);
      } catch (err) {
        console.error('[DiscoveryManager] Listener error:', err);
      }
    }
  }
}
