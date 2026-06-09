# Adopt Event-Driven Architecture with Custom Event Bus for Public API Integration: Public Contracts Explicitly

These rules are ALWAYS ACTIVE for all public API integration patterns and event-driven communication within the Excalidraw application ecosystem, particularly in collaboration features (Portal, Collab, AppEventBus) and @excalidraw/excalidraw package exports.

### Rules

- **R-EACD-001** MUST: All public API contracts MUST be explicitly exported through typed interfaces (AppEventPayloadMap, AppEventBehavior, AppEventBehaviorMap, AppEventBus, Emitter, Portal, CollabAPI, TCollabClass) from @excalidraw/excalidraw packages.

- **R-EACD-002** MUST: All WebSocket event handlers in collaboration components use AppEventBus.getEmitter().on() or socket.on() with proper cleanup, with no direct socket manipulation bypassing abstractions.

- **R-EACD-003** MUST: Implement socket cleanup in React useEffect cleanup functions: return () => { socket.off('event-name', handler); } to prevent memory leaks.

- **R-EACD-004** MUST: When creating new event types, extend AppEventPayloadMap with typed payload interfaces before implementing handlers to ensure compile-time safety.

- **R-EACD-005** SHOULD: Use this.getEmitter(name).on(callback) pattern from AppEventBus rather than direct socket.on() to benefit from replay-on-subscribe and caching features.

- **R-EACD-006** SHOULD: Leverage Jotai atoms (collabAPIAtom, isCollaboratingAtom) for reactive UI updates based on collaboration state changes rather than manual state propagation.

- **R-EACD-007** SHOULD: For performance-critical broadcasts, use WS_EVENTS.SERVER_VOLATILE to skip server-side persistence and reduce latency at the cost of delivery guarantees.

- **R-EACD-008** SHOULD: Access cache layer Map structures (emitters, lastPayload, broadcastedElementVersions) through getter methods rather than direct Map access in at least 80% of usage sites.

- **R-EACD-009** MAY: Legacy socket.emit() calls may bypass AppEventBus for backward compatibility with existing WebSocket server implementations (EXC-001).

- **R-EACD-010** MAY: Direct Map access may be used in performance-critical paths where getter overhead is measured and documented as a bottleneck (EXC-002).

### Verify

```bash
# Verify all socket usage goes through event bus abstractions
grep -r 'socket\.on\|socket\.emit' --include='*.ts' --include='*.tsx' excalidraw-app/collab/ packages/common/src/ | grep -v 'this.getEmitter\|AppEventBus' || echo 'All socket usage goes through event bus abstractions'

# Count public API contract exports
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
- Socket cleanup is present in component unmount lifecycle for all event handlers

<enforcement>
Claude Code MUST NOT skip or defer verification. All rules in this file are mandatory for collaboration and public API code paths. Violations must be caught during code review and CI pipeline checks before merge.
</enforcement>