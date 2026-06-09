# Adopt Event-Driven Architecture with In-Memory Event Bus and Socket.IO for Real-Time Collaboration: Socket Event Handlers

These rules are ALWAYS ACTIVE for all real-time collaboration features and event-driven communication patterns within the application, particularly Socket.IO-based client-server communication and in-memory event bus implementations.

### Rules

- **R-SOCKET-001** MUST: Socket event handlers MUST be registered using .on() pattern (e.g., `this.socket.on('init-room', callback)`) and properly cleaned up with .off() when no longer needed.
- **R-SOCKET-002** MUST: Map-based caching patterns (emitters, broadcastedElementVersions, lastPayload, collaborators) MUST be used for state management in collaboration features.
- **R-SOCKET-003** MUST: Event listener cleanup logic MUST be implemented in component unmount/destroy lifecycle hooks to call socket.off() and clear Map entries.
- **R-SOCKET-004** SHOULD: Use TypeScript interfaces to define AppEventPayloadMap and AppEventBehaviorMap contracts for type-safe event handling.
- **R-SOCKET-005** SHOULD: Wrap Socket.IO event handlers with error boundaries and logging (console.error, console.warn) to aid debugging.
- **R-SOCKET-006** SHOULD: Use throttling (lodash.throttle) for high-frequency events like mouse movements to prevent network saturation.
- **R-SOCKET-007** MAY: Consider using WeakMap for caching when appropriate to enable automatic garbage collection of unused entries.

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
- No unbounded cache growth is detected in memory profiling
- TypeScript type checking passes for AppEventPayloadMap and contract interfaces

<enforcement>
Claude Code MUST NOT skip or defer verification. CI pipeline MUST fail if Socket.IO event handlers are detected without corresponding cleanup patterns. Code review MUST block merge if Map-based caching is not used for new collaboration features. Runtime warnings MUST be logged when cache sizes exceed configured thresholds.
</enforcement>