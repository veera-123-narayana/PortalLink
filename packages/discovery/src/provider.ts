/**
 * Common Discovery Provider Interface.
 * All providers (Web Presence, LAN, Android Nearby, iOS Multipeer) implement this contract.
 */
import { DeviceModel } from '@portallink/core';

export type DeviceDiscoveryCallback = (device: DeviceModel) => void;
export type DeviceLostCallback = (deviceId: string) => void;

export interface DiscoveryProvider {
  readonly id: string;
  readonly name: string;
  readonly isSupported: boolean;

  start(
    selfDevice: DeviceModel,
    onDeviceDiscovered: DeviceDiscoveryCallback,
    onDeviceLost: DeviceLostCallback
  ): Promise<void>;

  stop(): Promise<void>;
  broadcastPresence(selfDevice: DeviceModel): Promise<void>;
}
