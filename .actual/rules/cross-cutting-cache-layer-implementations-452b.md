# Adopt Jotai Store Pattern for Service-Level State Management: Cache Layer Implementations

These rules are ALWAYS ACTIVE for all service definitions, cache layer implementations, event-driven socket communication handlers, and local data persistence operations that access shared application state atoms or manage element versioning.

### Rules

- **R-JOTAI-001** MUST: Cache layer implementations MUST use Map-based storage (e.g., broadcastedElementVersions) for element versioning and retrieval.
- **R-JOTAI-002** MUST: All service definitions MUST use appJotaiStore.get(atom) and appJotaiStore.set(atom, value) for accessing and mutating shared state atoms.
- **R-JOTAI-003** MUST: Service-local caches that require fast lookups but do not need reactivity or cross-service visibility MUST use Map structures (new Map()) rather than store atoms.
- **R-JOTAI-004** MUST: Event-driven boundaries MUST establish socket event handlers using socket.on(eventName, handler) and emit events using socket.emit(eventName, data).
- **R-JOTAI-005** SHOULD: When implementing new services, developers SHOULD identify which state needs to be shared (use store atoms) versus service-local (use Map or class properties).
- **R-JOTAI-006** SHOULD: Map-based caches like broadcastedElementVersions SHOULD implement cache size limits and LRU eviction policies to prevent unbounded growth and memory leaks.

### Verify

```bash
# Verify appJotaiStore usage in service definitions
grep -r 'appJotaiStore\.get\|appJotaiStore\.set' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify Map-based cache implementations for element versioning
grep -r 'new Map()' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -E '(broadcastedElementVersions|cache|Cache)'

# Verify socket event patterns in event-driven boundaries
grep -r 'socket\.on\|socket\.emit' --include='*.ts' --include='*.tsx' excalidraw-app/
```

**Accept when:**
- All service definitions use appJotaiStore.get/set for shared state atom access
- Cache layers use Map-based storage for element versioning and local optimization
- Event-driven boundaries consistently use socket.on/emit patterns for communication
- No direct state mutations occur outside the store pattern in service definitions
- Map-based caches include documented cleanup or eviction strategies

<enforcement>
Claude Code MUST NOT skip or defer verification of these rules. Code review checklist verification of store pattern usage in service definitions is mandatory. Automated grep-based checks in CI pipeline for appJotaiStore usage patterns are mandatory. Architecture review for new service boundaries to ensure pattern compliance is mandatory.
</enforcement>