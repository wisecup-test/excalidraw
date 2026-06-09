# Adopt Event-Driven Architecture with In-Memory Event Bus and Socket.IO for Real-Time Collaboration: Real Time Collaboration

These rules are ALWAYS ACTIVE for all real-time collaboration features and event-driven communication patterns within the application, including collaborative canvas editing, Socket.IO-based client-server communication, in-memory event bus implementations, room-based collaboration, and event replay mechanisms.

### Rules

- **R-RTCOLLAB-001** MUST: All real-time collaboration features MUST use Socket.IO for bidirectional event-based communication between clients and servers.
- **R-RTCOLLAB-002** MUST: Implement cleanup logic in component unmount/destroy lifecycle hooks to call socket.off() and clear Map entries to prevent memory leaks.
- **R-RTCOLLAB-003** MUST: Use Map-based caching (emitters, broadcastedElementVersions, lastPayload, collaborators) for O(1) state tracking in real-time collaboration scenarios.
- **R-RTCOLLAB-004** MUST: Define AppEventPayloadMap and AppEventBehaviorMap contracts using TypeScript interfaces for type-safe event handling.
- **R-RTCOLLAB-005** SHOULD: Implement version tracking to prevent unnecessary network traffic by comparing cached element versions before broadcasting.
- **R-RTCOLLAB-006** SHOULD: Use throttling (lodash.throttle) for high-frequency events like mouse movements to prevent network saturation.
- **R-RTCOLLAB-007** SHOULD: Wrap Socket.IO event handlers with error boundaries and logging (console.error, console.warn) to aid debugging.
- **R-RTCOLLAB-008** SHOULD: Consider using WeakMap for caching when appropriate to enable automatic garbage collection of unused entries.
- **R-RTCOLLAB-009** MAY: Bypass version tracking for volatile events (high-frequency mouse movements) to reduce memory overhead (EXC-002).
- **R-RTCOLLAB-010** MAY: Fetch complete scene state from persistent storage (Firebase) for initial room synchronization rather than relying solely on in-memory cache (EXC-001).

### Verify

```bash
# Count Socket.IO event handler registrations
grep -r 'socket\.on(' --include='*.ts' --include='*.tsx' | wc -l

# Verify Map-based caching patterns are used
grep -r '\.emitters\.get\|\.emitters\.set\|\.broadcastedElementVersions\|\.lastPayload' --include='*.ts' --include='*.tsx'

# Count Socket.IO event handler cleanup calls
grep -r 'socket\.off(' --include='*.ts' --include='*.tsx' | wc -l

# Run collaboration event tests
npm test -- --grep 'event.*collaboration|socket.*event' 2>/dev/null || echo 'Run collaboration event tests'

# Monitor Map cache sizes in implementation
grep -r 'this\.emitters\.size\|this\.broadcastedElementVersions\.size\|this\.collaborators\.size' --include='*.ts' --include='*.tsx'
```

**Accept when:**
- Socket.IO event handlers (.on) are present in collaboration-related files and have corresponding cleanup (.off) calls
- Map-based caching patterns (emitters, broadcastedElementVersions, lastPayload, collaborators) are consistently used for state management
- Public API contracts (AppEventBus, Portal, CollabAPI) are exported and documented for event-driven boundaries
- Integration tests verify concurrent collaboration scenarios and event replay for late-joining subscribers
- TypeScript type checking ensures AppEventPayloadMap and contract interfaces are properly implemented
- Memory profiling in staging environment detects no unbounded cache growth

<enforcement>
Claude Code MUST NOT skip or defer verification. All Socket.IO event handlers MUST have corresponding cleanup patterns. All new collaboration features MUST use Map-based caching. Code review MUST block merges violating these rules. CI pipeline MUST fail if event handlers lack cleanup or if cache sizes exceed thresholds.
</enforcement>