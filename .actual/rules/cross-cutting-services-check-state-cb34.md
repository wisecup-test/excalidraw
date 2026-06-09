# Adopt Jotai Store Pattern for Service-Level State Management: Services Check State

These rules are ALWAYS ACTIVE for all service definitions, cache layer implementations, event-driven socket communication handlers, local data persistence operations, and collaboration state management code.

### Rules

- **R-JOTAI-001** SHOULD: Services SHOULD check state atoms before performing operations that may fail due to quota or capacity constraints.
- **R-JOTAI-002** MUST: All shared state access in service definitions MUST use appJotaiStore.get(atom) and appJotaiStore.set(atom, value) patterns.
- **R-JOTAI-003** SHOULD: Service-local caches SHOULD use Map-based storage for fast lookups rather than store atoms when reactivity and cross-service visibility are not required.
- **R-JOTAI-004** MUST: Event-driven boundaries MUST consistently use socket.on(eventName, handler) and socket.emit(eventName, data) patterns for communication.
- **R-JOTAI-005** SHOULD: New service implementations SHOULD identify which state needs to be shared (use store atoms) versus service-local (use Map or class properties).

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
- No direct state mutations occur outside the store pattern in service code
- New services document their state management approach (shared vs local)

<enforcement>
Claude Code MUST NOT skip or defer verification. All service files must be checked for compliance with the Jotai store pattern before approval.
</enforcement>