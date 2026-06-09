# Adopt Map-Based Cache Layer for Event Bus and Collaboration State Management: Collaboration Portals Maintain

Status: proposed
Date: 2024-01-09
Deciders: Detection Pipeline (automated)

## Context

- The application implements real-time collaboration features requiring efficient state synchronization across multiple clients connected via WebSocket
- Event-driven architecture with event bus pattern (appEventBus.ts) requires tracking emitter instances and last payload values for replay and state management
- Collaboration portal (Portal.tsx) needs to track broadcasted element versions to prevent redundant network transmissions and optimize bandwidth usage
- Multiple integration points require fast lookup and retrieval of cached state data including emitters, payloads, file metadata, and element versions
- The system uses Map data structures for O(1) lookup performance on frequently accessed cache entries during real-time collaboration sessions

## Problem Statement

Real-time collaborative applications require efficient caching mechanisms to manage event state, element versions, and collaboration metadata. Without a consistent cache layer pattern, the system would suffer from redundant network broadcasts, inefficient state lookups, and inability to replay events for late-joining clients. The challenge is to establish a standard approach for caching integration state that balances memory usage, lookup performance, and state consistency across distributed collaboration sessions.

## Decision

1. MUST: Collaboration portals MUST maintain a cache of broadcasted element versions to prevent redundant transmissions (e.g., this.broadcastedElementVersions.get(element.id), this.broadcastedElementVersions.set(syncableElement.id, syncableElement.version))

## Policy Block

- MUST Collaboration portals MUST maintain a cache of broadcasted element versions to prevent redundant transmissions (e.g., this.broadcastedElementVersions.get(element.id), this.broadcastedElementVersions.set(syncableElement.id, syncableElement.version))

## Rationale

- Pattern detected across 3 files with 91.30% confidence, demonstrating consistent adoption of Map-based caching in event bus (appEventBus.ts), collaboration portal (Portal.tsx), and collaboration orchestration (Collab.tsx) components
- Map data structures provide O(1) lookup and insertion performance critical for real-time collaboration where state queries occur on every user interaction and network event
- Caching broadcasted element versions prevents redundant network transmissions by allowing version comparison before broadcast, reducing bandwidth consumption in multi-user sessions
- Event payload caching enables replay behavior for late-joining subscribers, ensuring consistent state initialization without requiring full scene retransmission

## Consequences

Positive:
- Improved performance through O(1) cache lookups for frequently accessed state data during real-time collaboration
- Reduced network bandwidth usage by preventing redundant element broadcasts when versions haven't changed
- Enhanced user experience for late-joining collaborators through event replay from cached payloads
- Consistent caching pattern across integration components simplifies maintenance and debugging of state management logic

Negative:
- Increased memory footprint as cache grows with number of events, elements, and collaborators in long-running sessions
- Potential for stale cache entries if invalidation logic is not properly implemented during element deletion or user disconnection
- Additional complexity in state management requiring careful coordination between cache updates and network operations
- Risk of memory leaks if cache entries are not properly cleaned up when elements are deleted or users leave collaboration sessions

## Alternatives

- Use plain JavaScript objects with property access instead of Map structures for caching (rejected)
  Rejected because: Plain objects lack efficient key iteration, have prototype pollution risks, and don't provide native size tracking. Map structures offer better performance for frequent insertions/deletions and cleaner API for cache operations.
  When valid: Only valid for small, static cache sizes where object property access patterns are well-defined and prototype pollution is not a concern
- Implement stateless integration without caching, fetching full state on every operation (rejected)
  Rejected because: Stateless approach would cause excessive network traffic and poor performance in real-time collaboration scenarios. Every user action would require full state synchronization, making the system unusable at scale.
  When valid: Only viable for non-real-time integrations with infrequent state access and small payload sizes
- Use external caching service (Redis, Memcached) for distributed cache layer (deferred)
  Rejected because: Adds infrastructure complexity and network latency for cache access. Current in-memory approach is sufficient for single-instance collaboration sessions.
  When valid: Should be reconsidered when implementing multi-server horizontal scaling or persistent collaboration sessions across server restarts

## Risks

- Memory leaks from unbounded cache growth in long-running collaboration sessions with many elements and events
  Mitigation: Implement cache size limits, LRU eviction policies, and cleanup logic triggered on element deletion and user disconnection events. Monitor memory usage in production.
  Owner: Engineering team
- Cache inconsistency between local state and remote state due to race conditions in concurrent updates
  Mitigation: Use atomic cache update operations, implement version-based conflict resolution, and ensure cache updates occur within the same transaction as state changes.
  Owner: Engineering team
- Stale cache entries causing incorrect behavior when elements are deleted or modified by other collaborators
  Mitigation: Implement explicit cache invalidation on delete operations, use version numbers for staleness detection, and periodically reconcile cache with authoritative state.
  Owner: Engineering team

## Implementation Notes

- Initialize Map-based cache structures in component constructors (e.g., this.emitters = new Map(), this.lastPayload = new Map(), this.broadcastedElementVersions = new Map())
- Always check cache existence with .get() before performing expensive operations like network broadcasts or event emissions to avoid redundant work
- Update cache entries atomically using .set() immediately after successful state changes to maintain consistency between cache and actual state
- Implement cleanup logic to remove cache entries when elements are deleted or users disconnect, using .delete() method to prevent memory leaks
- Consider implementing cache size monitoring and LRU eviction for long-running sessions to prevent unbounded memory growth

## Continuation Context


Verify commands:
- grep -r 'this\.[a-zA-Z]*\.get(' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx' | grep -E '(emitters|lastPayload|broadcastedElementVersions|addedFiles)\.get'
- grep -r 'this\.[a-zA-Z]*\.set(' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx' | grep -E '(emitters|lastPayload|broadcastedElementVersions|addedFiles)\.set'
- grep -r 'new Map<' packages/common/src/ excalidraw-app/collab/ --include='*.ts' --include='*.tsx'

Accept when:
- Event bus implementations contain Map-based cache structures for emitters and last payload storage with corresponding .get() and .set() operations
- Collaboration portal components cache broadcasted element versions using Map structures and check cache before broadcasting updates
- All integration components use Map data structures (not plain objects) for cache layer implementation as verified by 'new Map' declarations

## Enforcement

- Verified by: Code review checklist requiring Map-based cache structures for all new event bus and collaboration integration components
- Verified by: Automated grep-based verification in CI pipeline checking for Map usage patterns in integration layer files
- Verified by: Architecture review for new integration patterns ensuring consistency with established cache layer approach
- Violation handling: CI pipeline fails if new integration components use plain objects instead of Map structures for caching
- Violation handling: Code review blocks merge if cache layer implementation deviates from established pattern without architectural justification
- Violation handling: Technical debt tickets created for existing violations to be addressed in future refactoring cycles
- Exception process: Exception requests must be submitted to architecture review board with performance benchmarks justifying alternative approach
- Exception process: Approved exceptions must be documented in code comments explaining rationale and performance characteristics
- Exception process: All exceptions require explicit sign-off from tech lead and must include plan for future alignment with standard pattern