# Adopt Event-Driven Service Boundaries with Versioned Cache Synchronization: Storage Services Support

These rules are ALWAYS ACTIVE for all files implementing real-time collaborative synchronization services, data persistence layers, cache management, and public API boundaries exposed through Portal and LocalData contracts.

### Rules

- **R-STORAGE-001** SHOULD: Storage services SHOULD support multiple backend adapters (IndexedDB, localStorage) with migration paths between them.

### Verify

```bash
# Verify event-driven socket handlers are present for room lifecycle management
grep -r 'socket\.on\|socket\.emit' --include='*.tsx' --include='*.ts' | grep -E '(init-room|join-room|new-user|room-user-change)' || echo 'No event-driven boundaries found'

# Verify version cache is used to track synchronization state
grep -r 'broadcastedElementVersions\.get\|broadcastedElementVersions\.set' --include='*.tsx' --include='*.ts' || echo 'No version cache found'

# Verify public API contracts are exported
grep -r 'export.*class.*(Portal|LocalData)' --include='*.tsx' --include='*.ts' || echo 'No public API contracts found'

# Verify storage quota management is implemented
grep -r 'localStorageQuotaExceededAtom' --include='*.tsx' --include='*.ts' || echo 'No quota management found'
```

**Accept when:**
- Event-driven socket handlers are present for room lifecycle management (init-room, join-room, new-user, room-user-change)
- Version cache (broadcastedElementVersions) is used to track synchronization state with get/set operations
- Public API contracts (Portal, LocalData classes) are exported and encapsulate service boundaries
- Storage quota management (localStorageQuotaExceededAtom) is implemented with graceful degradation

<enforcement>
Claude Code MUST NOT skip or defer verification. All four verification conditions must pass before accepting changes to storage services, cache management, or public API boundaries.
</enforcement>