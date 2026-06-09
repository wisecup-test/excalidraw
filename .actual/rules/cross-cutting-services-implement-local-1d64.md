# Adopt Jotai Store Pattern for Service-Level State Management: Services Implement Local

These rules are ALWAYS ACTIVE for all service definitions, cache layer implementations, event-driven socket communication handlers, local data persistence operations, and collaboration state management code.

### Rules

- **R-JOTAI-001** MUST: Use `appJotaiStore.get(atom)` and `appJotaiStore.set(atom, value)` for all shared state atom access in service definitions.
- **R-JOTAI-002** MAY: Services MAY implement local caching using Map structures for performance optimization of frequently accessed data.
- **R-JOTAI-003** MUST: Establish socket event handlers using `socket.on(eventName, handler)` and emit events using `socket.emit(eventName, data)` for event-driven boundaries.
- **R-JOTAI-004** SHOULD: When implementing new services, identify which state needs to be shared (use store atoms) vs service-local (use Map or class properties).
- **R-JOTAI-005** MUST NOT: Access or mutate shared state directly outside the `appJotaiStore` pattern in service definitions.
- **R-JOTAI-006** SHOULD: Implement cache size limits and LRU eviction policies for long-lived Map structures like `broadcastedElementVersions` to prevent memory leaks.

### Verify

```bash
# Verify appJotaiStore usage in service definitions
grep -r 'appJotaiStore\.get\|appJotaiStore\.set' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify Map-based caching for element versioning
grep -r 'new Map()' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -E '(broadcastedElementVersions|cache|Cache)'

# Verify socket event patterns
grep -r 'socket\.on\|socket\.emit' --include='*.ts' --include='*.tsx' excalidraw-app/
```

**Accept when:**
- All service definitions use `appJotaiStore.get/set` for shared state atom access
- Cache layers use Map-based storage for element versioning and local optimization
- Event-driven boundaries consistently use `socket.on/emit` patterns for communication
- No direct state mutations occur outside the store pattern in service files
- Map-based caches include documented cleanup or size limit strategies

<enforcement>
Claude Code MUST NOT skip or defer verification. All service definitions MUST be checked for compliance with R-JOTAI-001 through R-JOTAI-006 before accepting changes to service-level state management.
</enforcement>