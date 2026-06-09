# Adopt Event-Driven Service Boundaries with Versioned Cache Synchronization: Data Persistence Services

These rules are ALWAYS ACTIVE for all data persistence services, real-time collaborative synchronization services, cache management systems, and public API boundary contracts (Portal, LocalData) that manage element state, storage backends, and WebSocket communication.

### Rules

- **R-PERSIST-001** MUST: Data persistence services MUST implement quota management and graceful degradation when storage limits are exceeded (localStorageQuotaExceededAtom).
- **R-PERSIST-002** MUST: Event-driven service boundaries MUST be established through socket.on/socket.emit patterns for room management (init-room, join-room, new-user, room-user-change).
- **R-PERSIST-003** MUST: Services MUST use versioned caches (broadcastedElementVersions) to track element synchronization state and prevent redundant broadcasts.
- **R-PERSIST-004** MUST: Public API contracts MUST be exposed through Portal, LocalData, and library adapter classes that define clear service boundaries.
- **R-PERSIST-005** SHOULD: Version cache management SHOULD use broadcastedElementVersions.get/set pattern to track which element versions have been synchronized.
- **R-PERSIST-006** SHOULD: Socket event handlers SHOULD implement throttling via lodash.throttle or similar for _broadcastSocketData to control concurrency and prevent event flooding.
- **R-PERSIST-007** SHOULD: Storage quota state SHOULD be managed through appJotaiStore atoms (localStorageQuotaExceededAtom) to coordinate fallback behavior.

### Verify

```bash
# Verify event-driven boundaries are present
grep -r 'socket\.on\|socket\.emit' --include='*.tsx' --include='*.ts' | grep -E '(init-room|join-room|new-user|room-user-change)' || echo 'No event-driven boundaries found'

# Verify version cache is implemented
grep -r 'broadcastedElementVersions\.get\|broadcastedElementVersions\.set' --include='*.tsx' --include='*.ts' || echo 'No version cache found'

# Verify public API contracts exist
grep -r 'export.*class.*(Portal|LocalData)' --include='*.tsx' --include='*.ts' || echo 'No public API contracts found'

# Verify quota management is implemented
grep -r 'localStorageQuotaExceededAtom' --include='*.tsx' --include='*.ts' || echo 'No quota management found'
```

**Accept when:**
- Event-driven socket handlers are present for room lifecycle management (init-room, join-room, new-user, room-user-change)
- Version cache (broadcastedElementVersions) is used to track synchronization state with get/set operations
- Public API contracts (Portal, LocalData classes) are exported and encapsulate service boundaries
- Storage quota management (localStorageQuotaExceededAtom) is implemented with graceful degradation
- Initial room synchronization uses full scene broadcast (syncAll=true) for new users (EX-001)
- Storage quota exceeded scenarios implement fallback to in-memory only operation (EX-002)

<enforcement>
Claude Code MUST NOT skip or defer verification. All grep-based verification commands MUST pass before accepting changes to data persistence services. Code review MUST verify event-driven patterns and version cache usage. Architecture review is REQUIRED for any new service boundary that does not follow established patterns. Violations MUST be documented with exception references (EX-XXX) or blocked in CI pipeline.
</enforcement>