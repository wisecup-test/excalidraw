# Adopt Event-Driven Architecture with In-Memory Event Bus and Socket.IO for Real-Time Collaboration: Last Event Payloads

These rules are ALWAYS ACTIVE for all real-time collaboration features and event-driven communication patterns within the application, including Socket.IO-based client-server communication, in-memory event bus implementations using Map and Set data structures, and room-based collaboration with multi-user state synchronization.

### Rules

- **R-COLLAB-001** MUST: Last event payloads MUST be cached (e.g., `this.lastPayload.get(name)`, `this.lastPayload.set(name, args)`) to support late-joining subscribers with replay-on-subscribe behavior.
- **R-COLLAB-002** MUST: Socket.IO event handlers registered with `.on()` MUST have corresponding cleanup calls with `.off()` in component lifecycle hooks to prevent memory leaks.
- **R-COLLAB-003** MUST: Map-based caching patterns (emitters, broadcastedElementVersions, lastPayload, collaborators) MUST be used for state management in collaboration features.
- **R-COLLAB-004** SHOULD: Implement cleanup logic in component unmount/destroy lifecycle hooks to call `socket.off()` and clear Map entries.
- **R-COLLAB-005** SHOULD: Use TypeScript interfaces to define AppEventPayloadMap and AppEventBehaviorMap contracts for type-safe event handling.
- **R-COLLAB-006** SHOULD: Wrap Socket.IO event handlers with error boundaries and logging (console.error, console.warn) to aid debugging.
- **R-COLLAB-007** SHOULD: Use throttling (lodash.throttle) for high-frequency events like mouse movements to prevent network saturation.
- **R-COLLAB-008** MAY: Consider using WeakMap for caching when appropriate to enable automatic garbage collection of unused entries.

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
```

**Accept when:**
- Socket.IO event handlers (`.on`) are present in collaboration-related files and have corresponding cleanup (`.off`) calls
- Map-based caching patterns (emitters, broadcastedElementVersions, lastPayload, collaborators) are consistently used for state management
- Public API contracts (AppEventBus, Portal, CollabAPI) are exported and documented for event-driven boundaries
- Integration tests verify concurrent collaboration scenarios and event replay for late-joining subscribers
- Cache sizes are monitored and do not exhibit unbounded growth in long-running sessions

<enforcement>
Claude Code MUST NOT skip or defer verification. Code review MUST block merge if Socket.IO event handlers are detected without corresponding cleanup patterns. CI pipeline MUST fail if Map-based caching is not used for new collaboration features. Runtime warnings MUST be logged when cache sizes exceed configured thresholds.
</enforcement>