# Adopt Event-Driven Architecture with Custom Event Bus for Public API Integration: Cache Layers Implemented

These rules are ALWAYS ACTIVE for all event-driven communication within Excalidraw collaboration features (Portal, Collab, AppEventBus), public API contracts exported from @excalidraw/excalidraw packages, WebSocket-based real-time synchronization, cache layers for event replay and element versioning, and encrypted bidirectional communication between collaboration clients.

### Rules

- **R-CACHE-001** MUST: Cache layers MUST be implemented using Map data structures to track emitters (this.emitters.get/set), last payloads (this.lastPayload.get/set), and broadcasted element versions (this.broadcastedElementVersions.get/set).
- **R-CACHE-002** MUST: All WebSocket event handlers in collaboration components use AppEventBus.getEmitter().on() or socket.on() with proper cleanup, with no direct socket manipulation bypassing abstractions.
- **R-CACHE-003** MUST: Public API contracts (AppEventBus, Emitter, CollabAPI, Portal) are exported from @excalidraw/excalidraw packages and used by at least 3 distinct modules.
- **R-CACHE-004** MUST: Cache layer Map structures (emitters, lastPayload, broadcastedElementVersions) are accessed through getter methods in at least 80% of usage sites.
- **R-CACHE-005** MUST: Test coverage for event-driven components (appEventBus, emitter, Portal, Collab) exceeds 80% for branches, functions, and lines.
- **R-CACHE-006** SHOULD: When creating new event types, always extend AppEventPayloadMap with typed payload interfaces before implementing handlers to ensure compile-time safety.
- **R-CACHE-007** SHOULD: Use this.getEmitter(name).on(callback) pattern from AppEventBus rather than direct socket.on() to benefit from replay-on-subscribe and caching features.
- **R-CACHE-008** SHOULD: Implement socket cleanup in React useEffect cleanup functions: return () => { socket.off('event-name', handler); } to prevent memory leaks.
- **R-CACHE-009** SHOULD: For performance-critical broadcasts, use WS_EVENTS.SERVER_VOLATILE to skip server-side persistence and reduce latency at the cost of delivery guarantees.
- **R-CACHE-010** SHOULD: Leverage Jotai atoms (collabAPIAtom, isCollaboratingAtom) for reactive UI updates based on collaboration state changes rather than manual state propagation.
- **R-CACHE-011** SHOULD: When adding cache layers, document eviction policies and maximum size limits to prevent unbounded memory growth in production.

### Verify

```bash
# Verify all socket usage goes through event bus abstractions
grep -r 'socket\.on\|socket\.emit' --include='*.ts' --include='*.tsx' excalidraw-app/collab/ packages/common/src/ | grep -v 'this.getEmitter\|AppEventBus' || echo 'All socket usage goes through event bus abstractions'

# Count public API exports
grep -r 'export.*AppEventBus\|export.*Emitter\|export.*CollabAPI\|export.*Portal' --include='*.ts' packages/common/src/ packages/excalidraw/ | wc -l

# Count cache layer Map accesses
grep -r 'this\.emitters\.get\|this\.lastPayload\.get\|this\.broadcastedElementVersions\.get' --include='*.ts' --include='*.tsx' packages/common/src/ excalidraw-app/collab/ | wc -l

# Run test coverage for event-driven components
npm test -- --testPathPattern='(appEventBus|emitter|Portal|Collab)' --coverage --coverageThreshold='{"branches":80,"functions":80,"lines":80}'
```

**Accept when:**
- All WebSocket event handlers in collaboration components use AppEventBus.getEmitter().on() or socket.on() with proper cleanup, with no direct socket manipulation bypassing abstractions
- Public API contracts (AppEventBus, Emitter, CollabAPI, Portal) are exported from @excalidraw/excalidraw packages and used by at least 3 distinct modules
- Cache layer Map structures (emitters, lastPayload, broadcastedElementVersions) are accessed through getter methods in at least 80% of usage sites
- Test coverage for event-driven components (appEventBus, emitter, Portal, Collab) exceeds 80% for branches, functions, and lines

<enforcement>
Claude Code MUST NOT skip or defer verification. CI build fails if direct socket manipulation is detected outside approved abstraction layers. Pull requests introducing new event types without AppEventPayloadMap extensions are automatically flagged for architecture review. Runtime warnings logged in development mode when event handlers are registered without corresponding cleanup. Quarterly architecture audits identify components violating event-driven boundaries and create remediation tickets.
</enforcement>