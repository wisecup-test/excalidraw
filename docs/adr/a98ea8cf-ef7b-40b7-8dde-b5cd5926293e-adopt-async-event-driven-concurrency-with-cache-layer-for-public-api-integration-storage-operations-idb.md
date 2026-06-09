# Adopt Async Event-Driven Concurrency with Cache Layer for Public API Integration: Storage Operations Idb

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The application integrates with external public APIs from @excalidraw/excalidraw, @excalidraw/element, and idb-keyval libraries, requiring coordination between multiple asynchronous operations
- Real-time collaboration features require socket-based event-driven communication patterns with events like 'init-room', 'join-room', 'new-user', and 'room-user-change'
- Local data persistence and synchronization necessitate cache layer management using IndexedDB (via idb-keyval) and localStorage with version tracking through broadcastedElementVersions
- The system must handle volatile and non-volatile data broadcasts across distributed clients while maintaining element version consistency
- Storage quota limitations require graceful degradation with quota exceeded detection via localStorageQuotaExceededAtom state management

## Problem Statement

Public API integration patterns across the codebase lack standardized concurrency handling and cache layer management, leading to potential race conditions, inconsistent state synchronization, and unpredictable behavior when coordinating between socket events, local storage operations, and IndexedDB persistence. Without explicit concurrency models and caching strategies, the system risks data loss, version conflicts, and poor user experience during collaborative sessions.

## Decision

1. MUST: Storage operations using idb-keyval MUST implement error handling with console.warn or console.error logging for failure scenarios

## Policy Block

- MUST Storage operations using idb-keyval MUST implement error handling with console.warn or console.error logging for failure scenarios

In scope:
- All socket-based event handlers in Portal.tsx and similar collaboration components
- IndexedDB operations using idb-keyval library (set, get operations)
- localStorage operations with quota management via appJotaiStore
- Public API contracts exposing LocalData, Portal, TTDIndexedDBAdapter, and LibraryIndexedDBAdapter
- Version tracking and cache synchronization for collaborative elements

Out of scope:
- Synchronous, non-cached API operations that do not involve state persistence
- Internal utility functions that do not interact with external APIs
- Pure computation functions without I/O or side effects
- Static configuration and constant definitions

Exceptions:
- EX-001: Legacy code paths that predate the concurrency model adoption and are scheduled for refactoring
- EX-002: Performance-critical hot paths where synchronous cache access is proven necessary through profiling

## Rationale

- Pattern detected across 3 files with 91.07% confidence indicates consistent architectural approach to handling async operations and caching in public API integrations
- Event-driven socket communication (socket.on/emit) provides decoupled, scalable architecture for real-time collaboration features required by the Excalidraw application
- Cache layer with version tracking (broadcastedElementVersions Map) prevents unnecessary network traffic and resolves conflicts in distributed collaborative editing scenarios
- Explicit error handling and quota management ensures graceful degradation when storage limits are reached, improving user experience and system reliability

## Consequences

Positive:
- Consistent concurrency patterns across public API integrations reduce cognitive load and improve code maintainability
- Version-tracked cache layer minimizes redundant data synchronization and improves real-time collaboration performance
- Explicit error handling and quota management prevents data loss and provides clear failure modes
- Event-driven architecture enables loose coupling between components and supports horizontal scaling of collaboration features

Negative:
- Increased complexity in component initialization due to async lifecycle management and event handler registration
- Memory overhead from maintaining version tracking Maps and cache structures for all synchronized elements
- Potential for event handler memory leaks if socket cleanup is not properly implemented on component unmount
- Debugging challenges with async race conditions and event ordering in distributed scenarios

## Alternatives

- Synchronous API calls with blocking operations and no cache layer (rejected)
  Rejected because: Blocking operations would freeze UI during network requests and eliminate real-time collaboration capabilities essential to the application
  When valid: Only valid for simple, non-collaborative applications with infrequent API interactions
- Reactive streams (RxJS) for all async operations with observable-based state management (rejected)
  Rejected because: Would require significant refactoring of existing codebase and introduce additional library dependency without clear performance benefits over current async/await patterns
  When valid: Valid for greenfield projects with complex event stream transformations and operators
- Web Workers for all storage operations to offload main thread (deferred)
  Rejected because: Adds architectural complexity and serialization overhead; current performance is acceptable but may be reconsidered if profiling reveals main thread bottlenecks
  When valid: Valid if storage operations are proven to block rendering or user interactions through performance profiling

## Risks

- Race conditions between socket events and local cache updates leading to inconsistent state
  Mitigation: Implement sequential processing queues for critical state updates and use version numbers to detect conflicts
  Owner: Engineering team - collaboration feature owners
- Memory leaks from unregistered socket event handlers when components unmount
  Mitigation: Enforce cleanup patterns in component lifecycle hooks and implement automated testing for event handler registration/deregistration
  Owner: Engineering team - frontend infrastructure
- Storage quota exceeded errors causing silent data loss if not properly handled
  Mitigation: Implement comprehensive quota monitoring with localStorageQuotaExceededAtom and provide user notifications when approaching limits
  Owner: Engineering team - data persistence owners

## Implementation Notes

- Use idb-keyval library for IndexedDB operations with consistent error handling patterns (console.warn/console.error)
- Implement cache version tracking using Map structures (broadcastedElementVersions.get/set) for all synchronized elements
- Register socket event handlers using socket.on() pattern with corresponding cleanup in component unmount lifecycle
- Leverage appJotaiStore for state management of quota exceeded conditions and other cache-related state
- Apply lodash.throttle to high-frequency broadcast operations (_broadcastSocketData) to prevent network flooding
- Distinguish between volatile (WS_EVENTS.SERVER_VOLATILE) and persistent (WS_EVENTS.SERVER) broadcasts based on data criticality

## Continuation Context


Verify commands:
- grep -r 'socket\.on\|socket\.emit' --include='*.tsx' --include='*.ts' | grep -v 'socket\.off' | wc -l
- grep -r 'broadcastedElementVersions\.get\|broadcastedElementVersions\.set' --include='*.tsx' --include='*.ts'
- grep -r 'idb-keyval' --include='*.ts' --include='*.tsx' -A 5 | grep -E 'console\.(warn|error)'
- grep -r 'async.*save.*\|async.*load.*' --include='*.ts' --include='*.tsx' | grep -E 'LocalData|TTDStorage|Portal'

Accept when:
- All socket event handlers have corresponding cleanup (socket.off) in component unmount or cleanup functions
- All idb-keyval operations include error handling with console.warn or console.error logging
- Cache layer implementations use version tracking Maps for element synchronization
- Public API contracts (Portal, LocalData, TTDIndexedDBAdapter) expose async methods with proper concurrency control

## Enforcement

- Verified by: Code review checklist requiring verification of async patterns and cache layer implementation
- Verified by: ESLint rules enforcing error handling on idb-keyval operations
- Verified by: Integration tests validating socket event handler registration and cleanup
- Verified by: Automated grep-based verification commands in CI pipeline checking for pattern compliance
- Violation handling: CI pipeline fails if verify commands detect missing error handling or cleanup patterns
- Violation handling: Code review blocks merge if async operations lack proper concurrency control
- Violation handling: Runtime monitoring alerts on unhandled storage quota exceeded conditions
- Violation handling: Quarterly architecture review identifies components violating concurrency patterns for refactoring
- Exception process: Submit exception request to technical lead with justification and impact analysis
- Exception process: Document exception in code with TECH-DEBT comment and tracking ticket reference
- Exception process: Include exception in architecture decision log with time-bound remediation plan
- Exception process: Review all active exceptions during quarterly architecture review for closure or extension