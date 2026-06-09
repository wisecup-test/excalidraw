# Adopt Event-Driven Architecture with In-Memory Event Bus and Socket.IO for Real-Time Collaboration: Collaborator State Maintained

These rules are ALWAYS ACTIVE for all real-time collaboration features and event-driven communication patterns within the application, particularly in files implementing Socket.IO-based client-server communication, in-memory event bus patterns, and room-based multi-user state synchronization.

### Rules

- **R-COLLAB-001** SHOULD: Collaborator state SHOULD be maintained in Map-based structures (e.g., `this.collaborators.get(socketId)`) to enable O(1) lookup and updates.
- **R-COLLAB-002** MUST: Implement cleanup logic in component unmount/destroy lifecycle hooks to call `socket.off()` and clear Map entries to prevent memory leaks.
- **R-COLLAB-003** SHOULD: Use TypeScript interfaces to define `AppEventPayloadMap` and `AppEventBehaviorMap` contracts for type-safe event handling.
- **R-COLLAB-004** SHOULD: Wrap Socket.IO event handlers with error boundaries and logging (console.error, console.warn) to aid debugging.
- **R-COLLAB-005** SHOULD: Use throttling (lodash.throttle) for high-frequency events like mouse movements to prevent network saturation.
- **R-COLLAB-006** SHOULD: Implement monitoring for Map sizes (this.emitters.size, this.broadcastedElementVersions.size) to detect memory growth patterns.
- **R-COLLAB-007** MAY: Consider using WeakMap for caching when appropriate to enable automatic garbage collection of unused entries.
- **R-COLLAB-008** SHOULD: Implement periodic cleanup of stale cache entries and set maximum cache sizes with LRU eviction to prevent memory exhaustion.

### Verify

```bash
# Count Socket.IO event handler registrations
grep -r 'socket\.on(' --include='*.ts' --include='*.tsx' | wc -l

# Verify Map-based caching patterns are used for state management
grep -r '\.emitters\.get\|\.emitters\.set\|\.broadcastedElementVersions\|\.lastPayload' --include='*.ts' --include='*.tsx'

# Count Socket.IO event handler cleanup calls
grep -r 'socket\.off(' --include='*.ts' --include='*.tsx' | wc -l

# Run collaboration event tests
npm test -- --grep 'event.*collaboration|socket.*event' 2>/dev/null || echo 'Run collaboration event tests'
```

**Accept when:**
- Socket.IO event handlers (.on) are present in collaboration-related files and have corresponding cleanup (.off) calls
- Map-based caching patterns (emitters, broadcastedElementVersions, lastPayload, collaborators) are consistently used for state management
- Public API contracts (AppEventBus, Portal, CollabAPI) are exported and documented for event-driven boundaries
- Integration tests verify concurrent collaboration scenarios and event replay for late-joining subscribers
- TypeScript type checking ensures AppEventPayloadMap and contract interfaces are properly implemented
- Memory profiling in staging environment shows no unbounded cache growth

<enforcement>
Claude Code MUST NOT skip or defer verification. All rules in this file are mandatory for real-time collaboration features. Code review MUST block merge if Socket.IO event handlers are detected without corresponding cleanup patterns. CI pipeline MUST fail if Map-based caching is not used for new collaboration features. Runtime warnings MUST be logged when cache sizes exceed configured thresholds.
</enforcement>