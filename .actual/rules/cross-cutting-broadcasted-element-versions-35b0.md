# Adopt Event-Driven Architecture with In-Memory Event Bus and Socket.IO for Real-Time Collaboration: Broadcasted Element Versions

These rules are ALWAYS ACTIVE for all real-time collaboration features and event-driven communication patterns within the application, particularly in files implementing Socket.IO-based client-server communication, in-memory event bus implementations, and room-based multi-user state synchronization.

### Rules

- **R-COLLAB-001** MUST: Broadcasted element versions MUST be tracked in memory (e.g., `this.broadcastedElementVersions.get(element.id)`) to prevent redundant network transmissions of unchanged elements.
- **R-COLLAB-002** MUST: Socket.IO event handlers registered with `.on()` MUST have corresponding cleanup calls using `.off()` in component lifecycle hooks to prevent memory leaks.
- **R-COLLAB-003** SHOULD: Use Map-based caching (emitters, broadcastedElementVersions, lastPayload, collaborators) for O(1) state lookups in real-time collaboration scenarios.
- **R-COLLAB-004** SHOULD: Implement throttling (e.g., lodash.throttle) for high-frequency events like mouse movements to prevent network saturation.
- **R-COLLAB-005** MAY: Use WeakMap for caching when appropriate to enable automatic garbage collection of unused entries.
- **R-COLLAB-006** SHOULD: Monitor Map sizes (this.emitters.size, this.broadcastedElementVersions.size) to detect unbounded memory growth patterns in long-running sessions.

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
- Socket.IO event handlers (.on) are present in collaboration-related files and have corresponding cleanup (.off) calls
- Map-based caching patterns (emitters, broadcastedElementVersions, lastPayload, collaborators) are consistently used for state management
- Public API contracts (AppEventBus, Portal, CollabAPI) are exported and documented for event-driven boundaries
- Integration tests verify concurrent collaboration scenarios and event replay for late-joining subscribers
- No unbounded growth of cached element versions or event payloads is detected in memory profiling

<enforcement>
Claude Code MUST NOT skip or defer verification. All rules in this file are mandatory for real-time collaboration code paths. Violations detected by grep-based verification or memory profiling MUST block merge. Code review MUST verify Socket.IO cleanup patterns and Map-based caching usage before approval.
</enforcement>