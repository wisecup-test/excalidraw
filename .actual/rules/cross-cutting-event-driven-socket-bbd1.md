# Adopt Async Event-Driven Concurrency with Cache Layer for Public API Integration: Event Driven Socket

These rules are ALWAYS ACTIVE for all socket-based event handlers in collaboration components, IndexedDB operations using idb-keyval, localStorage operations with quota management, and public API contracts exposing LocalData, Portal, TTDIndexedDBAdapter, and LibraryIndexedDBAdapter.

### Rules

- **R-SOCKET-001** MUST: Event-driven socket communications MUST use registered event handlers (socket.on) with corresponding emit operations for bidirectional communication.
- **R-SOCKET-002** MUST: All socket event handlers MUST have corresponding cleanup (socket.off) in component unmount or cleanup functions to prevent memory leaks.
- **R-SOCKET-003** MUST: All idb-keyval operations MUST include error handling with console.warn or console.error logging.
- **R-SOCKET-004** MUST: Cache layer implementations MUST use version tracking Maps (broadcastedElementVersions) for element synchronization.
- **R-SOCKET-005** MUST: Public API contracts (Portal, LocalData, TTDIndexedDBAdapter) MUST expose async methods with proper concurrency control.
- **R-SOCKET-006** SHOULD: High-frequency broadcast operations (_broadcastSocketData) SHOULD be throttled using lodash.throttle to prevent network flooding.
- **R-SOCKET-007** SHOULD: Distinguish between volatile (WS_EVENTS.SERVER_VOLATILE) and persistent (WS_EVENTS.SERVER) broadcasts based on data criticality.
- **R-SOCKET-008** SHOULD: Implement sequential processing queues for critical state updates and use version numbers to detect conflicts.
- **R-SOCKET-009** SHOULD: Leverage appJotaiStore for state management of quota exceeded conditions and other cache-related state.

### Verify

```bash
# Count socket event handler registrations
grep -r 'socket\.on\|socket\.emit' --include='*.tsx' --include='*.ts' | grep -v 'socket\.off' | wc -l

# Verify cache version tracking implementation
grep -r 'broadcastedElementVersions\.get\|broadcastedElementVersions\.set' --include='*.tsx' --include='*.ts'

# Check idb-keyval error handling
grep -r 'idb-keyval' --include='*.ts' --include='*.tsx' -A 5 | grep -E 'console\.(warn|error)'

# Verify async storage operations in public APIs
grep -r 'async.*save.*\|async.*load.*' --include='*.ts' --include='*.tsx' | grep -E 'LocalData|TTDStorage|Portal'
```

**Accept when:**
- All socket event handlers have corresponding cleanup (socket.off) in component unmount or cleanup functions
- All idb-keyval operations include error handling with console.warn or console.error logging
- Cache layer implementations use version tracking Maps for element synchronization
- Public API contracts (Portal, LocalData, TTDIndexedDBAdapter) expose async methods with proper concurrency control
- High-frequency broadcast operations are throttled to prevent network flooding
- Storage quota exceeded conditions are monitored via appJotaiStore with user notifications

<enforcement>
Claude Code MUST NOT skip or defer verification. All rules in this file are mandatory for code review approval. Violations detected by verify commands MUST block merge. Exception requests require technical lead approval with documented justification and impact analysis.
</enforcement>