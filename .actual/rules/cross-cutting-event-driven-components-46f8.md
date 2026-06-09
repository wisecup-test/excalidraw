# Adopt Event-Driven Architecture with In-Memory Event Bus and Socket.IO for Real-Time Collaboration: Event Driven Components

These rules are ALWAYS ACTIVE for all real-time collaboration features and event-driven communication patterns within the application, including Socket.IO-based client-server communication, in-memory event bus implementations, room-based collaboration, and event replay mechanisms.

### Rules

- **R-EVDR-001** SHOULD: Event-driven components SHOULD expose public contracts (e.g., AppEventBus, AppEventPayloadMap, Portal, CollabAPI) to define clear boundaries between services.

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

<enforcement>
Claude Code MUST NOT skip or defer verification. Code review MUST check for Socket.IO usage patterns and cleanup logic. CI pipeline MUST fail if event handlers are detected without corresponding cleanup patterns. Runtime warnings MUST be logged when cache sizes exceed configured thresholds.
</enforcement>