# Adopt Event-Driven Service Boundaries with Versioned Cache Synchronization: Storage Services Support

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The codebase implements real-time collaborative features requiring synchronization of element state across multiple clients connected via WebSocket
- Services maintain versioned caches (broadcastedElementVersions) to track element synchronization state and prevent redundant broadcasts
- Event-driven boundaries are established through socket.on/socket.emit patterns for room management (init-room, join-room, new-user, room-user-change)
- Local data persistence layer uses multiple storage backends (IndexedDB via idb-keyval, localStorage) with quota management and error handling
- Public API contracts are exposed through Portal, LocalData, and library adapter classes that define service boundaries

## Problem Statement

Services need clear boundaries for managing real-time collaborative state synchronization while handling concurrent updates, storage quota constraints, and multi-client coordination without creating tight coupling between components or causing data inconsistencies.

## Decision

1. SHOULD: Storage services SHOULD support multiple backend adapters (IndexedDB, localStorage) with migration paths between them

## Policy Block

- SHOULD Storage services SHOULD support multiple backend adapters (IndexedDB, localStorage) with migration paths between them

In scope:
- Real-time collaborative synchronization services using WebSocket communication
- Data persistence layers managing local storage and IndexedDB
- Cache management for versioned element tracking
- Public API boundaries exposed through Portal and LocalData contracts

Out of scope:
- Internal component communication within a single service boundary
- Synchronous API calls for non-collaborative features
- Third-party library integrations that don't cross service boundaries
- UI rendering logic that doesn't involve cross-service state management

Exceptions:
- EX-001: Initial room synchronization requires full scene broadcast (syncAll=true) to new users
- EX-002: Storage quota exceeded scenarios require fallback to in-memory only operation

## Rationale

- Event-driven boundaries decouple services and enable asynchronous, scalable communication patterns essential for real-time collaboration
- Version-tracked caching prevents unnecessary network traffic and ensures consistency by only broadcasting changed elements
- Multiple storage backend support with quota management provides resilience against browser storage limitations and enables graceful degradation
- Explicit public contracts (Portal, LocalData) create clear API boundaries that can evolve independently while maintaining backward compatibility

## Consequences

Positive:
- Services can scale independently and handle concurrent operations without blocking
- Version tracking reduces network overhead by eliminating redundant element broadcasts
- Clear API contracts enable independent testing and evolution of service implementations
- Storage quota management prevents catastrophic failures when browser limits are reached

Negative:
- Event-driven architecture increases complexity in debugging and tracing request flows
- Version cache management adds memory overhead and requires careful synchronization logic
- Multiple storage backends increase maintenance burden and testing surface area
- Asynchronous boundaries make it harder to reason about ordering and consistency guarantees

## Alternatives

- Use synchronous REST API calls for all service-to-service communication (rejected)
  Rejected because: Synchronous calls would block the UI and prevent real-time collaborative features that require immediate bidirectional updates
  When valid: For non-collaborative, request-response operations where real-time updates are not required
- Broadcast all element state on every change without version tracking (rejected)
  Rejected because: Would create excessive network traffic and poor performance as scenes grow larger with many elements
  When valid: For very small scenes with minimal elements where bandwidth is not a concern
- Use single storage backend (IndexedDB only) without fallback (rejected)
  Rejected because: Would fail completely when quota is exceeded rather than degrading gracefully, and wouldn't support migration from legacy localStorage
  When valid: For new applications without legacy data and with guaranteed storage availability

## Risks

- Version cache inconsistency could cause elements to become out of sync between clients
  Mitigation: Implement periodic full-sync reconciliation and validate version numbers on both send and receive
  Owner: Engineering team
- Storage quota exceeded state may not be detected until write failure occurs
  Mitigation: Proactively monitor storage usage via appJotaiStore atom and warn users before quota is reached
  Owner: Engineering team
- Event-driven architecture may create race conditions in concurrent update scenarios
  Mitigation: Use throttling for broadcasts and implement conflict resolution strategies based on element versions
  Owner: Engineering team

## Implementation Notes

- Use broadcastedElementVersions.get/set pattern to track which element versions have been synchronized
- Implement socket event handlers (init-room, join-room, new-user, room-user-change) to manage room lifecycle
- Leverage appJotaiStore for managing storage quota state (localStorageQuotaExceededAtom) and coordinate fallback behavior
- Expose service functionality through public contract classes (Portal, LocalData) and keep internal implementation details private
- Use lodash.throttle or similar for _broadcastSocketData to control concurrency and prevent event flooding

## Continuation Context


Verify commands:
- grep -r 'socket\.on\|socket\.emit' --include='*.tsx' --include='*.ts' | grep -E '(init-room|join-room|new-user|room-user-change)' || echo 'No event-driven boundaries found'
- grep -r 'broadcastedElementVersions\.get\|broadcastedElementVersions\.set' --include='*.tsx' --include='*.ts' || echo 'No version cache found'
- grep -r 'export.*class.*(Portal|LocalData)' --include='*.tsx' --include='*.ts' || echo 'No public API contracts found'
- grep -r 'localStorageQuotaExceededAtom' --include='*.tsx' --include='*.ts' || echo 'No quota management found'

Accept when:
- Event-driven socket handlers are present for room lifecycle management (init-room, join-room, new-user, room-user-change)
- Version cache (broadcastedElementVersions) is used to track synchronization state with get/set operations
- Public API contracts (Portal, LocalData classes) are exported and encapsulate service boundaries
- Storage quota management (localStorageQuotaExceededAtom) is implemented with graceful degradation

## Enforcement

- Verified by: Automated grep-based verification in CI pipeline checking for event-driven patterns and version cache usage
- Verified by: Code review checklist ensuring new services expose public contracts and implement quota management
- Verified by: Integration tests validating event handler registration and version synchronization behavior
- Violation handling: CI pipeline fails if service boundaries bypass event-driven patterns without documented exception
- Violation handling: Code review blocks PRs that introduce direct service coupling or missing version tracking
- Violation handling: Architecture review required for any new service boundary that doesn't follow the established patterns
- Exception process: Submit exception request documenting why event-driven pattern is not suitable for the specific use case
- Exception process: Architecture team reviews exception request and assesses impact on system consistency and scalability
- Exception process: Approved exceptions must be documented in code comments with EX-XXX reference and added to ADR policy exceptions