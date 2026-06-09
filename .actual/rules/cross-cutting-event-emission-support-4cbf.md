# Adopt Event-Driven Architecture with Custom Event Bus for Public API Integration: Event Emission Support

These rules are ALWAYS ACTIVE for all event-driven communication within Excalidraw collaboration features (Portal, Collab, AppEventBus), public API contracts exported from @excalidraw/excalidraw packages, WebSocket-based real-time synchronization, cache layers for event replay and element versioning, and encrypted bidirectional communication between collaboration clients.

### Rules

- **R-EDA-001** MUST: Event emission MUST support both volatile and persistent modes, with socket.emit() calls distinguishing between WS_EVENTS.SERVER_VOLATILE and WS_EVENTS.SERVER.
- **R-EDA-002** MUST: All WebSocket event handlers in collaboration components use AppEventBus.getEmitter().on() or socket.on() with proper cleanup, with no direct socket manipulation bypassing abstractions.
- **R-EDA-003** MUST: When creating new event types, always extend AppEventPayloadMap with typed payload interfaces before implementing handlers to ensure compile-time safety.
- **R-EDA-004** MUST: Implement socket cleanup in React useEffect cleanup functions: return () => { socket.off('event-name', handler); } to prevent memory leaks.
- **R-EDA-005** SHOULD: Use this.getEmitter(name).on(callback) pattern from AppEventBus rather than direct socket.on() to benefit from replay-on-subscribe and caching features.
- **R-EDA-006** SHOULD: For performance-critical broadcasts, use WS_EVENTS.SERVER_VOLATILE to skip server-side persistence and reduce latency at the cost of delivery guarantees.
- **R-EDA-007** SHOULD: Leverage Jotai atoms (collabAPIAtom, isCollaboratingAtom) for reactive UI updates based on collaboration state changes rather than manual state propagation.
- **R-EDA-008** SHOULD: When adding cache layers, document eviction policies and maximum size limits to prevent unbounded memory growth in production.
- **R-EDA-009** MAY: Legacy socket.emit() calls may bypass AppEventBus for backward compatibility with existing WebSocket server implementations (EXC-001).
- **R-EDA-010** MAY: Direct Map access may be used in performance-critical paths where getter overhead is measured and documented as a bottleneck (EXC-002).

### Verify

```bash
# Verify all socket usage goes through event bus abstractions
grep -r 'socket\.on\|socket\.emit' --include='*.ts' --include='*.tsx' excalidraw-app/collab/ packages/common/src/ | grep -v 'this.getEmitter\|AppEventBus' || echo 'All socket usage goes through event bus abstractions'

# Count public API exports
grep -r 'export.*AppEventBus\|export.*Emitter\|export.*CollabAPI\|export.*Portal' --include='*.ts' packages/common/src/ packages/excalidraw/ | wc -l

# Count cache layer getter usage
grep -r 'this\.emitters\.get\|this\.lastPayload\.get\|this\.broadcastedElementVersions\.get' --include='*.ts' --include='*.tsx' packages/common/src/ excalidraw-app/collab/ | wc -l

# Run test coverage for event-driven components
npm test -- --testPathPattern='(appEventBus|emitter|Portal|Collab)' --coverage --coverageThreshold='{"branches":80,"functions":80,"lines":80}'
```

**Accept when:**
- All WebSocket event handlers in collaboration components use AppEventBus.getEmitter().on() or socket.on() with proper cleanup, with no direct socket manipulation bypassing abstractions
- Public API contracts (AppEventBus, Emitter, CollabAPI, Portal) are exported from @excalidraw/excalidraw packages and used by at least 3 distinct modules
- Cache layer Map structures (emitters, lastPayload, broadcastedElementVersions) are accessed through getter methods in at least 80% of usage sites
- Test coverage for event-driven components (appEventBus, emitter, Portal, Collab) exceeds 80% for branches, functions, and lines
- All new event types extend AppEventPayloadMap with typed payload interfaces before implementation
- React useEffect cleanup functions properly call socket.off() for all registered handlers

<enforcement>
Claude Code MUST NOT skip or defer verification. All rules in this file are mandatory for event-driven architecture compliance. Violations detected by CI pipeline or code review must be remediated before merge. Exceptions require explicit approval from the architecture team with documented justification and expiration dates.
</enforcement>