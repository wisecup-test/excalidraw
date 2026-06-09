# Adopt Async Event-Driven Concurrency with Cache Layer for Public API Integration: Cache Layer Implementations

These rules are ALWAYS ACTIVE for all socket-based event handlers in collaboration components, IndexedDB operations using idb-keyval, localStorage operations with quota management, and public API contracts exposing LocalData, Portal, TTDIndexedDBAdapter, and LibraryIndexedDBAdapter.

### Rules

- **R-CACHE-001** MUST: Cache layer implementations MUST maintain version tracking for synchronized elements using Map-based structures (e.g., broadcastedElementVersions.get/set).
- **R-CACHE-002** MUST: All socket event handlers MUST have corresponding cleanup (socket.off) in component unmount or cleanup functions.
- **R-CACHE-003** MUST: All idb-keyval operations MUST include error handling with console.warn or console.error logging.
- **R-CACHE-004** MUST: Public API contracts (Portal, LocalData, TTDIndexedDBAdapter) MUST expose async methods with proper concurrency control.
- **R-CACHE-005** SHOULD: Apply lodash.throttle to high-frequency broadcast operations (_broadcastSocketData) to prevent network flooding.
- **R-CACHE-006** SHOULD: Distinguish between volatile (WS_EVENTS.SERVER_VOLATILE) and persistent (WS_EVENTS.SERVER) broadcasts based on data criticality.
- **R-CACHE-007** SHOULD: Leverage appJotaiStore for state management of quota exceeded conditions and other cache-related state.

### Verify

```bash
# Count socket event handlers without cleanup
grep -r 'socket\.on\|socket\.emit' --include='*.tsx' --include='*.ts' | grep -v 'socket\.off' | wc -l

# Verify version tracking Map usage
grep -r 'broadcastedElementVersions\.get\|broadcastedElementVersions\.set' --include='*.tsx' --include='*.ts'

# Check idb-keyval operations have error handling
grep -r 'idb-keyval' --include='*.ts' --include='*.tsx' -A 5 | grep -E 'console\.(warn|error)'

# Verify async save/load patterns in public APIs
grep -r 'async.*save.*\|async.*load.*' --include='*.ts' --include='*.tsx' | grep -E 'LocalData|TTDStorage|Portal'
```

**Accept when:**
- All socket event handlers have corresponding cleanup (socket.off) in component unmount or cleanup functions
- All idb-keyval operations include error handling with console.warn or console.error logging
- Cache layer implementations use version tracking Maps for element synchronization
- Public API contracts (Portal, LocalData, TTDIndexedDBAdapter) expose async methods with proper concurrency control
- High-frequency broadcast operations are throttled to prevent network flooding
- Volatile and persistent broadcasts are properly distinguished based on data criticality

<enforcement>
Claude Code MUST NOT skip or defer verification. All rules in this file are mandatory for code review approval and CI pipeline validation.
</enforcement>