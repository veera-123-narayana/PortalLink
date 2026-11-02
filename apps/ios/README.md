# PortalLink Native iOS Client
**Status:** PARTIALLY IMPLEMENTED (Architecture & Native Binding Specifications)  
**Bundle ID:** `com.portallink.ios`  
**Minimum Target:** iOS 15.0+  
**Language:** Swift 5.9+ / SwiftUI  

---

## 1. Native Architectural Components
- `MultipeerDiscoveryProvider.swift`: Uses `MultipeerConnectivity` (`MCNearbyServiceAdvertiser` and `MCNearbyServiceBrowser`) with service type `portallink-share`.
- `NetworkFrameworkTransport.swift`: Modern Apple `Network.framework` (`NWListener` and `NWConnection`) for TLS-secured LAN socket streaming.
- `SecurityScopedFileManager.swift`: App sandbox compliant document handling with `UIDocumentPickerViewController`.

## 2. Shared Protocol Compliance
The iOS application implements the `@portallink/protocol` binary frame format (`BinaryFrame`) and cryptographic PIN authorization model, enabling instant, cross-platform interoperability with Web, Android, and Desktop PortalLink instances.
