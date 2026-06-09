# Adopt Event-Driven Architecture with In-Memory Event Bus and Socket.IO for Real-Time Collaboration: Event Emission Tracking

These rules are ALWAYS ACTIVE for all real-time collaboration features and event-driven communication patterns within the application, particularly Socket.IO-based client-server communication, in-memory event bus implementations using Map and Set data structures, and room-based collaboration with multi-user state synchronization.

### Rules

- **R-EVBUS-001** SHOULD: Event emission tracking SHOULD use Set-based structures (e.g., `this.emittedOnce.add(name)`) to prevent duplicate processing of one-time events.

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
- Socket.IO event handlers (`.on`) are present in collaboration-related files and have corresponding cleanup (`.off`) calls
- Map-based caching patterns (`emitters`, `broadcastedElementVersions`, `lastPayload`, `collaborators`) are consistently used for state management
- Public API contracts (`AppEventBus`, `Portal`, `CollabAPI`) are exported and documented for event-driven boundaries
- Integration tests verify concurrent collaboration scenarios and event replay for late-joining subscribers
- Set-based structures are used for tracking one-time emitted events to prevent duplicate processing

<enforcement>
Claude Code MUST NOT skip or defer verification. Code review MUST check Socket.IO usage patterns and cleanup logic. CI pipeline MUST fail if event handlers are detected without corresponding cleanup patterns. TypeScript type checking MUST verify AppEventPayloadMap and contract interfaces are properly implemented.
</enforcement>