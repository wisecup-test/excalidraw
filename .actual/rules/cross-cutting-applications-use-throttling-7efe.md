# Adopt Event-Driven Architecture with In-Memory Event Bus and Socket.IO for Real-Time Collaboration: Applications Use Throttling

These rules are ALWAYS ACTIVE for all real-time collaboration features and event-driven communication patterns within the application, particularly Socket.IO-based client-server communication, in-memory event bus implementations, and room-based multi-user state synchronization.

### Rules

- **R-COLLAB-001** MAY: Applications MAY use throttling (e.g., lodash.throttle) on high-frequency event broadcasts to reduce network congestion.

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
- Throttling is applied to high-frequency events like mouse movements to prevent network saturation

<enforcement>
Claude Code MUST NOT skip or defer verification. All Socket.IO event handlers must have corresponding cleanup patterns, and Map-based caching must be consistently applied across collaboration features.
</enforcement>