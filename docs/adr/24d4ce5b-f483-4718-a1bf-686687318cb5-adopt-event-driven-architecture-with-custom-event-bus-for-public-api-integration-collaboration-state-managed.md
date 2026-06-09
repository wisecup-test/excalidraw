# Adopt Event-Driven Architecture with Custom Event Bus for Public API Integration: Collaboration State Managed

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Activation

This ADR is always active for all public API integration patterns and event-driven communication within the Excalidraw application ecosystem.

## Context

- The Excalidraw application requires real-time collaboration features where multiple users interact with shared drawing canvases through WebSocket connections
- Public API contracts need to be exposed through @excalidraw/excalidraw packages while maintaining clean boundaries between internal implementation and external consumers
- Event-driven communication patterns are necessary to decouple components like Portal, Collab, and AppEventBus, enabling asynchronous message passing for room management, user presence, and scene synchronization
- The architecture must support both volatile and persistent event broadcasting with encryption for secure collaboration across distributed clients
- Cache layers are required to track emitted events, last payloads, and broadcasted element versions to optimize network traffic and prevent redundant updates

## Problem Statement

How should the application structure its public API integration and event-driven communication to support real-time collaboration features while maintaining clean architectural boundaries, type safety, and extensibility for external consumers? The system must handle WebSocket-based bidirectional communication, event emission/subscription patterns, and state synchronization across multiple clients without tight coupling between components.

## Decision

1. SHOULD: Collaboration state SHOULD be managed through Jotai atoms (collabAPIAtom, isCollaboratingAtom, isOfflineAtom) with appJotaiStore.get/set operations

## Policy Block

- SHOULD Collaboration state SHOULD be managed through Jotai atoms (collabAPIAtom, isCollaboratingAtom, isOfflineAtom) with appJotaiStore.get/set operations

In scope:
- All event-driven communication within Excalidraw collaboration features (Portal, Collab, AppEventBus)
- Public API contracts exported from @excalidraw/excalidraw packages
- WebSocket-based real-time synchronization of drawing elements, user presence, and viewport state
- Cache layers for event replay, element versioning, and payload tracking
- Encrypted bidirectional communication between collaboration clients

Out of scope:
- Internal component state management not exposed through public APIs
- HTTP-based REST API endpoints (this ADR covers WebSocket event patterns only)
- File storage and binary asset handling (covered by separate data layer patterns)
- Authentication and authorization mechanisms (security concerns are separate)
- UI rendering and React component lifecycle (presentation layer concerns)

Exceptions:
- EXC-001: Legacy socket.emit() calls may bypass AppEventBus for backward compatibility with existing WebSocket server implementations
- EXC-002: Direct Map access may be used in performance-critical paths where getter overhead is measured and documented as a bottleneck

## Rationale

- The pattern appears in 4 files with 91.40% confidence, demonstrating consistent adoption across collaboration-critical components (appEventBus.ts, emitter.ts, Portal.tsx, Collab.tsx)
- Event-driven architecture decouples producers and consumers, enabling the Portal to broadcast scene updates without knowing which Collab instances are listening, improving maintainability and testability
- Custom AppEventBus and Emitter abstractions provide type-safe event contracts through TypeScript generics, preventing runtime errors from mismatched event payloads
- Cache layers (Map-based storage for emitters, payloads, and versions) optimize network traffic by preventing redundant broadcasts and enabling efficient state reconciliation
- The pattern aligns with established libraries (@excalidraw/excalidraw, @excalidraw/excalidraw/types, @excalidraw/element) and integrates with modern state management (Jotai atoms) for reactive collaboration state

## Consequences

Positive:
- Loose coupling between collaboration components enables independent testing, deployment, and evolution of Portal, Collab, and AppEventBus modules
- Type-safe event contracts through AppEventPayloadMap and typed Emitter interfaces catch integration errors at compile time rather than runtime
- Cache layers reduce network bandwidth by tracking broadcasted versions and preventing duplicate transmissions of unchanged elements
- Replay-on-subscribe pattern (emittedOnce tracking) ensures late-joining clients receive missed events without complex state synchronization logic
- Clear public API boundaries through @excalidraw/excalidraw exports enable third-party integrations and plugin development

Negative:
- Increased architectural complexity with multiple abstraction layers (AppEventBus → Emitter → socket.on/emit) may confuse developers unfamiliar with event-driven patterns
- Cache layer memory overhead from Map structures tracking emitters, payloads, and versions could grow unbounded in long-running sessions without eviction policies
- Debugging asynchronous event flows across multiple handlers is more challenging than synchronous function calls, requiring better observability tooling
- Performance overhead from encryption/decryption on every client-broadcast event may impact latency in high-frequency update scenarios

## Alternatives

- Direct WebSocket API usage without AppEventBus/Emitter abstractions (rejected)
  Rejected because: Lacks type safety for event payloads, creates tight coupling between components, and makes testing difficult without dependency injection of socket instances
  When valid: Valid only for simple proof-of-concept implementations with single event types and no need for replay or caching
- Third-party event bus libraries (EventEmitter3, mitt, or RxJS Observables) (rejected)
  Rejected because: Generic libraries lack domain-specific features like emittedOnce tracking, last payload caching, and integration with Excalidraw's encryption layer
  When valid: Could be reconsidered if custom AppEventBus maintenance burden becomes unsustainable and features can be replicated with library extensions
- Redux or MobX for centralized state management with action dispatching (rejected)
  Rejected because: State management libraries optimize for local state synchronization, not distributed event broadcasting across WebSocket connections; would require significant adapter code
  When valid: Valid for local UI state management but not a replacement for event-driven collaboration patterns

## Risks

- Memory leaks from unbounded Map growth in cache layers (emitters, lastPayload, broadcastedElementVersions) during long collaboration sessions
  Mitigation: Implement LRU eviction policies or periodic cleanup for inactive emitters and old element versions; add memory monitoring to detect growth patterns
  Owner: Platform Engineering Team
- Event handler registration leaks if socket.on() listeners are not properly cleaned up when components unmount or reconnect
  Mitigation: Enforce socket.off() calls in component cleanup lifecycle; add linting rules to detect missing cleanup; implement automatic handler deregistration on socket disconnect
  Owner: Frontend Architecture Team
- Type safety erosion if event payload contracts (AppEventPayloadMap) drift from actual runtime data structures
  Mitigation: Add runtime validation using Zod or io-ts to verify event payloads match TypeScript types; implement integration tests that exercise all event types
  Owner: Quality Engineering Team

## Implementation Notes

- When creating new event types, always extend AppEventPayloadMap with typed payload interfaces before implementing handlers to ensure compile-time safety
- Use this.getEmitter(name).on(callback) pattern from AppEventBus rather than direct socket.on() to benefit from replay-on-subscribe and caching features
- Implement socket cleanup in React useEffect cleanup functions: return () => { socket.off('event-name', handler); } to prevent memory leaks
- For performance-critical broadcasts, use WS_EVENTS.SERVER_VOLATILE to skip server-side persistence and reduce latency at the cost of delivery guarantees
- Leverage Jotai atoms (collabAPIAtom, isCollaboratingAtom) for reactive UI updates based on collaboration state changes rather than manual state propagation
- When adding cache layers, document eviction policies and maximum size limits to prevent unbounded memory growth in production

## Continuation Context


Verify commands:
- grep -r 'socket\.on\|socket\.emit' --include='*.ts' --include='*.tsx' excalidraw-app/collab/ packages/common/src/ | grep -v 'this.getEmitter\|AppEventBus' || echo 'All socket usage goes through event bus abstractions'
- grep -r 'export.*AppEventBus\|export.*Emitter\|export.*CollabAPI\|export.*Portal' --include='*.ts' packages/common/src/ packages/excalidraw/ | wc -l
- grep -r 'this\.emitters\.get\|this\.lastPayload\.get\|this\.broadcastedElementVersions\.get' --include='*.ts' --include='*.tsx' packages/common/src/ excalidraw-app/collab/ | wc -l
- npm test -- --testPathPattern='(appEventBus|emitter|Portal|Collab)' --coverage --coverageThreshold='{"branches":80,"functions":80,"lines":80}'

Accept when:
- All WebSocket event handlers in collaboration components use AppEventBus.getEmitter().on() or socket.on() with proper cleanup, with no direct socket manipulation bypassing abstractions
- Public API contracts (AppEventBus, Emitter, CollabAPI, Portal) are exported from @excalidraw/excalidraw packages and used by at least 3 distinct modules
- Cache layer Map structures (emitters, lastPayload, broadcastedElementVersions) are accessed through getter methods in at least 80% of usage sites
- Test coverage for event-driven components (appEventBus, emitter, Portal, Collab) exceeds 80% for branches, functions, and lines

## Enforcement

- Verified by: Automated CI pipeline runs grep-based pattern detection to ensure socket usage goes through AppEventBus abstractions
- Verified by: TypeScript compiler enforces type safety for event payload contracts through AppEventPayloadMap interfaces
- Verified by: Code review checklist includes verification of socket.off() cleanup in component unmount lifecycle
- Verified by: Integration test suite validates all WS_SUBTYPES event handlers with encrypted payload round-trips
- Violation handling: CI build fails if direct socket manipulation is detected outside approved abstraction layers
- Violation handling: Pull requests introducing new event types without AppEventPayloadMap extensions are automatically flagged for architecture review
- Violation handling: Runtime warnings logged in development mode when event handlers are registered without corresponding cleanup
- Violation handling: Quarterly architecture audits identify components violating event-driven boundaries and create remediation tickets
- Exception process: Submit exception request to architecture team with performance profiling data or legacy compatibility justification
- Exception process: Document approved exceptions in code comments with ADR reference and expiration date for temporary exceptions
- Exception process: Track all active exceptions in architecture decision log with quarterly review for removal or renewal