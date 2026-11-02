# PortalLink Native Android Client
**Status:** PARTIALLY IMPLEMENTED (Architecture & Native Binding Specifications)  
**Package:** `com.portallink.android`  
**Minimum SDK:** Android 10 (API Level 29)  
**Target SDK:** Android 14 (API Level 34)  

---

## 1. Native Architectural Components
- `NearbyDiscoveryProvider.kt`: Google Play Services `Nearby.getConnectionsClient(context)`. Uses `Strategy.P2P_STAR` and `Strategy.P2P_CLUSTER`.
- `WifiDirectTransport.kt`: `android.net.wifi.p2p.WifiP2pManager` for high-throughput zero-internet transfers.
- `PortalTransferService.kt`: Ongoing `ForegroundService` with low-priority notification ensuring background resilience against OS Doze mode.
- `StorageAccessFrameworkHelper.kt`: Android Scoped Storage integration with `MediaStore` and `DocumentsContract`.

## 2. Shared Protocol Compliance
The Android application implements the `@portallink/protocol` wire specification over binary byte channels and WebSockets, ensuring seamless peer-to-peer transfers with Web, iOS, and Desktop clients.
