# Adopt Jotai Store Pattern for Service-Level State Management: State Mutations Service

These rules are ALWAYS ACTIVE for all service definitions, cache layer implementations, event-driven socket communication handlers, local data persistence operations, and collaboration state management code.

### Rules

- **R-JOTAI-001** SHOULD: State mutations in service boundaries SHOULD be atomic operations using the store's set() method.

### Verify

```bash
# Verify appJotaiStore usage patterns in service definitions
grep -r 'appJotaiStore\.get\|appJotaiStore\.set' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify Map-based caching for element versioning
grep -r 'new Map()' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -E '(broadcastedElementVersions|cache|Cache)'

# Verify socket event patterns
grep -r 'socket\.on\|socket\.emit' --include='*.ts' --include='*.tsx' excalidraw-app/
```

**Accept when:**
- All service definitions use appJotaiStore.get/set for shared state atom access
- Cache layers use Map-based storage for element versioning and local optimization
- Event-driven boundaries consistently use socket.on/emit patterns for communication

<enforcement>
Claude Code MUST NOT skip or defer verification. All service-level state mutations must follow the Jotai store pattern with atomic operations via store.set().
</enforcement>