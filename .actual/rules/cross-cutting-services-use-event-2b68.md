# Adopt Event-Driven Service Boundaries with Versioned Cache Synchronization: Services Use Event

These rules are ALWAYS ACTIVE for all real-time collaborative synchronization services, data persistence layers, cache management systems, and public API boundaries exposed through Portal and LocalData contracts.

### Rules

- **R-SVC-001** MUST: Services MUST use event-driven communication patterns (socket.on/socket.emit) for cross-boundary interactions rather than direct method invocation.

### Verify

```bash
# Check for event-driven socket handlers for room lifecycle management
grep -r 'socket\.on\|socket\.emit' --include='*.tsx' --include='*.ts' | grep -E '(init-room|join-room|new-user|room-user-change)' || echo 'No event-driven boundaries found'

# Check for version cache usage tracking synchronization state
grep -r 'broadcastedElementVersions\.get\|broadcastedElementVersions\.set' --include='*.tsx' --include='*.ts' || echo 'No version cache found'

# Check for public API contracts
grep -r 'export.*class.*(Portal|LocalData)' --include='*.tsx' --include='*.ts' || echo 'No public API contracts found'

# Check for storage quota management
grep -r 'localStorageQuotaExceededAtom' --include='*.tsx' --include='*.ts' || echo 'No quota management found'
```

**Accept when:**
- Event-driven socket handlers are present for room lifecycle management (init-room, join-room, new-user, room-user-change)
- Version cache (broadcastedElementVersions) is used to track synchronization state with get/set operations
- Public API contracts (Portal, LocalData classes) are exported and encapsulate service boundaries
- Storage quota management (localStorageQuotaExceededAtom) is implemented with graceful degradation

<enforcement>
Claude Code MUST NOT skip or defer verification. All four verification conditions must pass before accepting changes to cross-service communication patterns.
</enforcement>