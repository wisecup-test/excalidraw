# Adopt Async Event-Driven Concurrency with Cache Layer for Public API Integration: Public Contracts Portal

These rules are ALWAYS ACTIVE for all socket-based event handlers in Portal.tsx and similar collaboration components, IndexedDB operations using idb-keyval library, localStorage operations with quota management, and public API contracts exposing LocalData, Portal, TTDIndexedDBAdapter, and LibraryIndexedDBAdapter.

### Rules

- **R-ASYNC-001** MUST: Public API contracts (Portal, LocalData, TTDIndexedDBAdapter) encapsulate concurrency logic and cache management within dedicated service boundaries.
- **R-ASYNC-002** MUST: All socket event handlers have corresponding cleanup (socket.off) in component unmount or cleanup functions.
- **R-ASYNC-003** MUST: All idb-keyval operations include error handling with console.warn or console.error logging.
- **R-ASYNC-004** MUST: Cache layer implementations use version tracking Maps for element synchronization.
- **R-ASYNC-005** SHOULD: Use idb-keyval library for IndexedDB operations with consistent error handling patterns.
- **R-ASYNC-006** SHOULD: Implement cache version tracking using Map structures (broadcastedElementVersions.get/set) for all synchronized elements.
- **R-ASYNC-007** SHOULD: Register socket event handlers using socket.on() pattern with corresponding cleanup in component unmount lifecycle.
- **R-ASYNC-008** SHOULD: Leverage appJotaiStore for state management of quota exceeded conditions and other cache-related state.
- **R-ASYNC-009** SHOULD: Apply lodash.throttle to high-frequency broadcast operations (_broadcastSocketData) to prevent network flooding.
- **R-ASYNC-010** SHOULD: Distinguish between volatile (WS_EVENTS.SERVER_VOLATILE) and persistent (WS_EVENTS.SERVER) broadcasts based on data criticality.

### Verify

```bash
# Count socket event handlers without cleanup
grep -r 'socket\.on\|socket\.emit' --include='*.tsx' --include='*.ts' | grep -v 'socket\.off' | wc -l

# Verify cache version tracking usage
grep -r 'broadcastedElementVersions\.get\|broadcastedElementVersions\.set' --include='*.tsx' --include='*.ts'

# Check idb-keyval operations have error handling
grep -r 'idb-keyval' --include='*.ts' --include='*.tsx' -A 5 | grep -E 'console\.(warn|error)'

# Verify async save/load methods in public API contracts
grep -r 'async.*save.*\|async.*load.*' --include='*.ts' --include='*.tsx' | grep -E 'LocalData|TTDStorage|Portal'
```

**Accept when:**
- All socket event handlers have corresponding cleanup (socket.off) in component unmount or cleanup functions
- All idb-keyval operations include error handling with console.warn or console.error logging
- Cache layer implementations use version tracking Maps for element synchronization
- Public API contracts (Portal, LocalData, TTDIndexedDBAdapter) expose async methods with proper concurrency control

<enforcement>
Claude Code MUST NOT skip or defer verification. Code review MUST block merge if async operations lack proper concurrency control. CI pipeline MUST fail if verify commands detect missing error handling or cleanup patterns. Runtime monitoring MUST alert on unhandled storage quota exceeded conditions.
</enforcement>