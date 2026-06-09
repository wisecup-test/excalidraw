# Adopt Async Event-Driven Concurrency with Cache Layer for Public API Integration: Volatile Data Broadcasts

These rules are ALWAYS ACTIVE for all socket-based event handlers in collaboration components, IndexedDB operations using idb-keyval, localStorage operations with quota management, and public API contracts exposing LocalData, Portal, TTDIndexedDBAdapter, and LibraryIndexedDBAdapter.

### Rules

- **R-ASYNC-001** SHOULD: Volatile data broadcasts SHOULD be distinguished from persistent broadcasts using explicit event type parameters (WS_EVENTS.SERVER_VOLATILE vs WS_EVENTS.SERVER).
- **R-ASYNC-002** MUST: All socket event handlers MUST have corresponding cleanup (socket.off) in component unmount or cleanup functions.
- **R-ASYNC-003** MUST: All idb-keyval operations MUST include error handling with console.warn or console.error logging.
- **R-ASYNC-004** MUST: Cache layer implementations MUST use version tracking Maps for element synchronization.
- **R-ASYNC-005** MUST: Public API contracts (Portal, LocalData, TTDIndexedDBAdapter) MUST expose async methods with proper concurrency control.
- **R-ASYNC-006** SHOULD: High-frequency broadcast operations SHOULD be throttled using lodash.throttle to prevent network flooding.
- **R-ASYNC-007** MUST: Storage quota exceeded errors MUST be properly handled with localStorageQuotaExceededAtom state management and user notifications.

### Verify

```bash
# Count socket event handlers without cleanup
grep -r 'socket\.on\|socket\.emit' --include='*.tsx' --include='*.ts' | grep -v 'socket\.off' | wc -l

# Verify cache version tracking implementation
grep -r 'broadcastedElementVersions\.get\|broadcastedElementVersions\.set' --include='*.tsx' --include='*.ts'

# Verify idb-keyval error handling
grep -r 'idb-keyval' --include='*.ts' --include='*.tsx' -A 5 | grep -E 'console\.(warn|error)'

# Verify async storage operations in public APIs
grep -r 'async.*save.*\|async.*load.*' --include='*.ts' --include='*.tsx' | grep -E 'LocalData|TTDStorage|Portal'
```

**Accept when:**
- All socket event handlers have corresponding cleanup (socket.off) in component unmount or cleanup functions
- All idb-keyval operations include error handling with console.warn or console.error logging
- Cache layer implementations use version tracking Maps for element synchronization
- Public API contracts (Portal, LocalData, TTDIndexedDBAdapter) expose async methods with proper concurrency control
- Volatile and persistent broadcasts are distinguished using explicit WS_EVENTS parameters
- High-frequency broadcast operations are throttled to prevent network flooding
- Storage quota exceeded conditions are monitored and handled with user notifications

<enforcement>
Claude Code MUST NOT skip or defer verification. All rules in this file are mandatory for code review approval and CI pipeline validation.
</enforcement>