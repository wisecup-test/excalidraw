# Adopt Event-Driven Architecture with In-Memory Event Bus and Socket.IO for Real-Time Collaboration: Event Emitters Cached

These rules are ALWAYS ACTIVE for all real-time collaboration features and event-driven communication patterns within the application, particularly in files implementing Socket.IO-based client-server communication, in-memory event bus implementations using Map and Set data structures, and room-based collaboration with multi-user state synchronization.

### Rules

- **R-EVBUS-001** MUST: Event emitters MUST be cached in Map-based data structures (e.g., `this.emitters.get(name)`, `this.emitters.set(name, emitter)`) to enable efficient event subscription and emission.

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
- TypeScript type checking ensures `AppEventPayloadMap` and contract interfaces are properly implemented

<enforcement>
Claude Code MUST NOT skip or defer verification. Code review MUST block merge if Map-based caching is not used for new collaboration features. CI pipeline MUST fail if Socket.IO event handlers are detected without corresponding cleanup patterns.
</enforcement>