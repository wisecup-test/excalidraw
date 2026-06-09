# Adopt Cache-Based State Management with Transactional Consistency for Collaborative Data: Cache Operations Collaborative

These rules are ALWAYS ACTIVE for all collaborative data synchronization code, Firebase real-time database operations, in-memory cache layers, WebSocket-based data synchronization, and local storage/IndexedDB persistence layers within the excalidraw-app project.

### Rules

- **R-CACHE-001** MUST: All cache operations for collaborative scene data MUST use dedicated cache abstractions (FirebaseSceneVersionCache.cache, appJotaiStore, filesMap) rather than direct storage access.
- **R-CACHE-002** MUST: All Firebase document updates MUST use transaction.get and transaction.set patterns to ensure atomic consistency for collaborative updates.
- **R-CACHE-003** MUST: Storage quota exceeded scenarios MUST be handled with localStorageQuotaExceededAtom checks and error state tracking before attempting localStorage writes.
- **R-CACHE-004** MUST: Cache operation failures MUST be logged with console.warn for recoverable issues and console.error for critical failures requiring investigation.
- **R-CACHE-005** SHOULD: Implement cache version tracking to detect staleness and prevent stale data from being displayed to users in collaborative sessions.
- **R-CACHE-006** SHOULD: Monitor localStorageQuotaExceededAtom metrics in production and implement proactive cache eviction strategies based on LRU or data age.

### Verify

```bash
# Verify transaction-based Firebase operations
grep -r 'transaction\.get\|transaction\.set' --include='*.ts' --include='*.tsx' excalidraw-app/data/

# Verify FirebaseSceneVersionCache cache usage
grep -r 'FirebaseSceneVersionCache\.cache\.(get\|set)' --include='*.ts' excalidraw-app/

# Verify storage quota handling
grep -r 'localStorageQuotaExceededAtom' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify cache abstraction usage across data access paths
grep -r '\.cache\.(get\|set)\|appJotaiStore\.(get\|set)\|filesMap\.set' --include='*.ts' --include='*.tsx' excalidraw-app/data/
```

**Accept when:**
- All Firebase document updates use transaction.get and transaction.set patterns (no direct docRef.set calls)
- Cache abstractions (FirebaseSceneVersionCache, appJotaiStore, filesMap) are used consistently across all data access paths
- Storage quota exceeded scenarios are handled with localStorageQuotaExceededAtom checks and error state tracking
- Console logging is present for cache operation failures (console.warn, console.error)

<enforcement>
Claude Code MUST NOT skip or defer verification. All rules in this file are mandatory for collaborative data synchronization code paths. Violations must be addressed before code review approval.
</enforcement>