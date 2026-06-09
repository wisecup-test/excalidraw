# Adopt Async Event-Driven Concurrency with Cache Layer for Public API Integration: Storage Quota Exceeded

These rules are ALWAYS ACTIVE for all socket-based event handlers in collaboration components, IndexedDB operations using idb-keyval, localStorage operations with quota management, and public API contracts exposing LocalData, Portal, TTDIndexedDBAdapter, and LibraryIndexedDBAdapter.

### Rules

- **R-QUOTA-001** MUST: Storage quota exceeded conditions MUST be tracked using state management atoms (localStorageQuotaExceededAtom) and handled gracefully.
- **R-QUOTA-002** MUST: All socket event handlers MUST have corresponding cleanup (socket.off) in component unmount or cleanup functions.
- **R-QUOTA-003** MUST: All idb-keyval operations MUST include error handling with console.warn or console.error logging.
- **R-QUOTA-004** MUST: Cache layer implementations MUST use version tracking Maps for element synchronization.
- **R-QUOTA-005** MUST: Public API contracts (Portal, LocalData, TTDIndexedDBAdapter) MUST expose async methods with proper concurrency control.
- **R-QUOTA-006** SHOULD: Use lodash.throttle on high-frequency broadcast operations (_broadcastSocketData) to prevent network flooding.
- **R-QUOTA-007** SHOULD: Distinguish between volatile (WS_EVENTS.SERVER_VOLATILE) and persistent (WS_EVENTS.SERVER) broadcasts based on data criticality.

### Verify

```bash
# Count socket event handlers without cleanup
grep -r 'socket\.on\|socket\.emit' --include='*.tsx' --include='*.ts' | grep -v 'socket\.off' | wc -l

# Verify cache version tracking implementation
grep -r 'broadcastedElementVersions\.get\|broadcastedElementVersions\.set' --include='*.tsx' --include='*.ts'

# Check idb-keyval operations have error handling
grep -r 'idb-keyval' --include='*.ts' --include='*.tsx' -A 5 | grep -E 'console\.(warn|error)'

# Verify async storage operations in public APIs
grep -r 'async.*save.*\|async.*load.*' --include='*.ts' --include='*.tsx' | grep -E 'LocalData|TTDStorage|Portal'
```

**Accept when:**
- All socket event handlers have corresponding cleanup (socket.off) in component unmount or cleanup functions
- All idb-keyval operations include error handling with console.warn or console.error logging
- Cache layer implementations use version tracking Maps for element synchronization
- Public API contracts (Portal, LocalData, TTDIndexedDBAdapter) expose async methods with proper concurrency control
- Storage quota exceeded conditions are tracked via localStorageQuotaExceededAtom state management

<enforcement>
Claude Code MUST NOT skip or defer verification of these rules. All R-QUOTA-### rules marked MUST are non-negotiable and must be verified before code acceptance. Violations must be escalated to code review and CI pipeline checks.
</enforcement>