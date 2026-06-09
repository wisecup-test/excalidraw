# Adopt Jotai Store Pattern for Service-Level State Management: Event Driven Boundaries

These rules are ALWAYS ACTIVE for all service definitions, cache layer implementations, event-driven socket communication handlers, local data persistence operations, and collaboration state management code.

### Rules

- **R-JOTAI-001** MUST: Event-driven boundaries MUST use socket.on() for event subscription and socket.emit() for event publication.
- **R-JOTAI-002** MUST: All service definitions accessing shared application state MUST use appJotaiStore.get(atom) and appJotaiStore.set(atom, value) for state access and mutation.
- **R-JOTAI-003** MUST: Service-local caches requiring fast lookups MUST use Map-based storage (new Map()) instead of store atoms when reactivity and cross-service visibility are not required.
- **R-JOTAI-004** SHOULD: Cache size limits and LRU eviction policies SHOULD be implemented for long-lived Map structures like broadcastedElementVersions to prevent memory leaks.
- **R-JOTAI-005** SHOULD: When implementing new services, developers SHOULD identify which state needs to be shared (use store atoms) versus service-local (use Map or class properties).

### Verify

```bash
# Verify appJotaiStore usage in service definitions
grep -r 'appJotaiStore\.get\|appJotaiStore\.set' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify Map-based cache implementations
grep -r 'new Map()' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -E '(broadcastedElementVersions|cache|Cache)'

# Verify socket event patterns
grep -r 'socket\.on\|socket\.emit' --include='*.ts' --include='*.tsx' excalidraw-app/
```

**Accept when:**
- All service definitions use appJotaiStore.get/set for shared state atom access
- Cache layers use Map-based storage for element versioning and local optimization
- Event-driven boundaries consistently use socket.on/emit patterns for communication
- No direct state mutations occur outside the store pattern in service definitions
- Map-based caches include documented cleanup or size-limiting strategies

<enforcement>
Claude Code MUST NOT skip or defer verification. All three grep commands MUST be executed and their results reviewed before accepting changes to service definitions, cache implementations, or event-driven boundaries.
</enforcement>