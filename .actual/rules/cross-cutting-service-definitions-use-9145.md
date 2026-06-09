# Adopt Jotai Store Pattern for Service-Level State Management: Service Definitions Use

These rules are ALWAYS ACTIVE for all service definitions, cache layer implementations, event-driven socket communication handlers, and local data persistence operations that access shared application state.

### Rules

- **R-JOTAI-001** MUST: Service definitions MUST use appJotaiStore.get() and appJotaiStore.set() for accessing and mutating shared state atoms.
- **R-JOTAI-002** MUST: Service-local caches MUST use Map-based storage (new Map()) for element versioning and optimization that does not require reactivity or cross-service visibility.
- **R-JOTAI-003** MUST: Event-driven boundaries MUST use socket.on(eventName, handler) and socket.emit(eventName, data) patterns for communication.
- **R-JOTAI-004** SHOULD: Service implementations SHOULD identify which state needs to be shared (use store atoms) vs service-local (use Map or class properties) during design.

### Verify

```bash
# Check for appJotaiStore usage in service definitions
grep -r 'appJotaiStore\.get\|appJotaiStore\.set' --include='*.ts' --include='*.tsx' excalidraw-app/

# Check for Map-based cache implementations
grep -r 'new Map()' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -E '(broadcastedElementVersions|cache|Cache)'

# Check for socket event patterns
grep -r 'socket\.on\|socket\.emit' --include='*.ts' --include='*.tsx' excalidraw-app/
```

**Accept when:**
- All service definitions use appJotaiStore.get/set for shared state atom access
- Cache layers use Map-based storage for element versioning and local optimization
- Event-driven boundaries consistently use socket.on/emit patterns for communication
- No direct state mutations occur outside the store pattern in service definitions

<enforcement>
Claude Code MUST NOT skip or defer verification. All service definitions must be audited for compliance with R-JOTAI-001 through R-JOTAI-004 before code review approval.
</enforcement>