# Adopt Event-Driven Architecture with In-Memory Event Bus and Socket.IO for Real-Time Collaboration: Broadcasted Element Versions

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Activation

This ADR is ALWAYS ACTIVE for all real-time collaboration features and event-driven communication patterns within the application.

## Context

- The application requires real-time collaborative editing capabilities where multiple users can interact with shared canvas elements simultaneously
- Event-driven architecture is needed to decouple event producers from consumers and enable reactive updates across distributed components
- In-memory caching layers (Map-based storage) are used to track broadcasted element versions, last event payloads, and collaborator state to optimize network traffic and prevent redundant updates
- Socket.IO provides bidirectional event-based communication between clients and servers for room-based collaboration with events like 'join-room', 'client-broadcast', 'new-user', and 'room-user-change'
- The pattern emerged across 3 files with 91.30% confidence, indicating a consistent architectural approach to managing real-time state synchronization

## Problem Statement

How do we efficiently manage real-time collaborative state synchronization across multiple clients while minimizing network overhead, preventing race conditions, and maintaining a clean separation between event handling logic and business logic in a distributed canvas editing application?

## Decision

1. MUST: Broadcasted element versions MUST be tracked in memory (e.g., this.broadcastedElementVersions.get(element.id)) to prevent redundant network transmissions of unchanged elements

## Policy Block

- MUST Broadcasted element versions MUST be tracked in memory (e.g., this.broadcastedElementVersions.get(element.id)) to prevent redundant network transmissions of unchanged elements

In scope:
- Real-time collaborative canvas editing features
- Socket.IO-based client-server communication
- In-memory event bus implementations using Map and Set data structures
- Room-based collaboration with multi-user state synchronization
- Event replay mechanisms for late-joining subscribers

Out of scope:
- Long-term persistent storage of collaboration history
- Database-backed event sourcing or CQRS patterns
- Non-real-time batch processing or asynchronous job queues
- HTTP REST API endpoints for non-collaborative features
- File system-based event logs or audit trails

Exceptions:
- EXC-001: Initial room synchronization requires fetching complete scene state from persistent storage (Firebase) rather than relying solely on in-memory cache
- EXC-002: Volatile events (high-frequency mouse movements) may bypass version tracking to reduce memory overhead

## Rationale

- Socket.IO provides proven bidirectional event-based communication with automatic reconnection, room management, and fallback transports, as evidenced by extensive usage across Portal.tsx and Collab.tsx
- Map-based caching (this.emitters, this.broadcastedElementVersions, this.lastPayload, this.collaborators) provides O(1) lookup performance and memory-efficient state tracking for real-time collaboration scenarios
- Event-driven architecture decouples producers from consumers, enabling the AppEventBus pattern to manage application-wide events without tight coupling between components
- Version tracking prevents unnecessary network traffic by comparing cached element versions before broadcasting, critical for performance in multi-user canvas editing with potentially thousands of elements

## Consequences

Positive:
- Reduced network overhead through intelligent caching and version tracking of broadcasted elements
- Clean separation of concerns with event-driven boundaries enabling independent evolution of event producers and consumers
- Efficient O(1) state lookups for collaborator information and event emitters using Map-based data structures
- Late-joining subscribers can receive last known state through cached payloads, improving user experience
- Socket.IO's built-in room management simplifies multi-user session handling and targeted event broadcasting

Negative:
- In-memory caching increases memory footprint proportional to number of active rooms, collaborators, and cached element versions
- State is lost on server restart unless backed by persistent storage, requiring careful consideration of recovery mechanisms
- Debugging event-driven flows can be more complex due to asynchronous, decoupled nature of event handlers
- Potential for memory leaks if event listeners are not properly cleaned up with .off() when components unmount
- Map-based caching does not provide built-in expiration or eviction policies, requiring manual memory management

## Alternatives

- Use WebRTC DataChannels for peer-to-peer communication without centralized server coordination (rejected)
  Rejected because: WebRTC requires complex signaling infrastructure, NAT traversal, and does not provide the centralized room management and state reconciliation needed for multi-user canvas collaboration
  When valid: Consider for scenarios requiring ultra-low latency direct peer communication with fewer than 5-10 participants
- Use HTTP polling or Server-Sent Events (SSE) for real-time updates (rejected)
  Rejected because: Polling introduces unnecessary latency and server load, while SSE only supports unidirectional server-to-client communication, insufficient for bidirectional collaboration events
  When valid: Consider SSE for read-only real-time dashboards or notification feeds where clients do not need to send events
- Use Redis or external cache for distributed state management instead of in-memory Maps (deferred)
  Rejected because: Current evidence shows in-memory caching meets performance requirements for single-server deployments; Redis adds operational complexity
  When valid: Adopt when horizontal scaling across multiple server instances is required, or when state persistence across restarts becomes critical

## Risks

- Memory exhaustion from unbounded growth of cached element versions and event payloads in long-running sessions
  Mitigation: Implement periodic cleanup of stale cache entries, set maximum cache sizes with LRU eviction, and monitor memory usage metrics in production
  Owner: Backend engineering team
- Event listener memory leaks if socket.off() cleanup is not properly implemented in component lifecycle
  Mitigation: Enforce cleanup patterns in code reviews, add linting rules to detect missing cleanup, and implement automated memory leak detection in CI
  Owner: Frontend engineering team
- Race conditions in concurrent updates to shared Map-based caches from multiple event handlers
  Mitigation: Document thread-safety assumptions, use atomic update patterns where needed, and add integration tests covering concurrent collaboration scenarios
  Owner: Engineering team

## Implementation Notes

- Use TypeScript interfaces to define AppEventPayloadMap and AppEventBehaviorMap contracts for type-safe event handling
- Implement cleanup logic in component unmount/destroy lifecycle hooks to call socket.off() and clear Map entries
- Consider using WeakMap for caching when appropriate to enable automatic garbage collection of unused entries
- Wrap Socket.IO event handlers with error boundaries and logging (console.error, console.warn) to aid debugging
- Use throttling (lodash.throttle) for high-frequency events like mouse movements to prevent network saturation
- Implement monitoring for Map sizes (this.emitters.size, this.broadcastedElementVersions.size) to detect memory growth patterns

## Continuation Context


Verify commands:
- grep -r 'socket\.on(' --include='*.ts' --include='*.tsx' | wc -l
- grep -r '\.emitters\.get\|\.emitters\.set\|\.broadcastedElementVersions\|\.lastPayload' --include='*.ts' --include='*.tsx'
- grep -r 'socket\.off(' --include='*.ts' --include='*.tsx' | wc -l
- npm test -- --grep 'event.*collaboration|socket.*event' 2>/dev/null || echo 'Run collaboration event tests'

Accept when:
- Socket.IO event handlers (.on) are present in collaboration-related files and have corresponding cleanup (.off) calls
- Map-based caching patterns (emitters, broadcastedElementVersions, lastPayload, collaborators) are consistently used for state management
- Public API contracts (AppEventBus, Portal, CollabAPI) are exported and documented for event-driven boundaries
- Integration tests verify concurrent collaboration scenarios and event replay for late-joining subscribers

## Enforcement

- Verified by: Code review checklist verifying Socket.IO usage patterns and cleanup logic
- Verified by: Automated grep-based verification in CI pipeline checking for event handler registration and cleanup
- Verified by: TypeScript type checking ensuring AppEventPayloadMap and contract interfaces are properly implemented
- Verified by: Memory profiling in staging environment to detect unbounded cache growth
- Violation handling: CI pipeline fails if Socket.IO event handlers are detected without corresponding cleanup patterns
- Violation handling: Code review blocks merge if Map-based caching is not used for new collaboration features
- Violation handling: Runtime warnings logged when cache sizes exceed configured thresholds
- Violation handling: Post-incident review required if memory leaks are detected in production
- Exception process: Submit exception request to technical lead with justification for alternative approach
- Exception process: Document exception in ADR amendments section with rationale and scope
- Exception process: Require performance benchmarks demonstrating alternative approach meets latency and memory requirements
- Exception process: Schedule review of exception after 6 months to evaluate if it should become permanent or be refactored