# Adopt Event-Driven Architecture with Custom Event Bus for Public API Integration: Implementations Use Lodash

These rules are ALWAYS ACTIVE for all event-driven communication within Excalidraw collaboration features (Portal, Collab, AppEventBus), public API contracts exported from @excalidraw/excalidraw packages, WebSocket-based real-time synchronization, cache layers for event replay and element versioning, and encrypted bidirectional communication between collaboration clients.

### Rules

- **R-EVBUS-001** MAY: Implementations MAY use lodash.throttle for rate-limiting event broadcasts to optimize network performance.

### Verify

```bash
# Verify all WebSocket event handlers use AppEventBus abstractions
grep -r 'socket\.on\|socket\.emit' --include='*.ts' --include='*.tsx' excalidraw-app/collab/ packages/common/src/ | grep -v 'this.getEmitter\|AppEventBus' || echo 'All socket usage goes through event bus abstractions'

# Verify public API contracts are exported
grep -r 'export.*AppEventBus\|export.*Emitter\|export.*CollabAPI\|export.*Portal' --include='*.ts' packages/common/src/ packages/excalidraw/ | wc -l

# Verify cache layer access patterns
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
Claude Code MUST NOT skip or defer verification. All WebSocket event handlers must route through AppEventBus abstractions. Public API contracts must be properly exported and used across multiple modules. Cache layer access must follow getter patterns. Test coverage thresholds must be met before accepting changes.
</enforcement>