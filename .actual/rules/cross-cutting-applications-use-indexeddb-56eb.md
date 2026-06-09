# Adopt Cache-Based State Management with Transactional Consistency for Collaborative Data: Applications Use Indexeddb

These rules are ALWAYS ACTIVE for all TypeScript and TypeScript React files in the collaborative data synchronization layer, Firebase integration paths, and state management modules that handle scene versions, file data, and real-time updates.

### Rules

- **R-CACHE-001** MUST: Wrap all Firebase document updates in transaction blocks using `transaction.get(docRef)` followed by `transaction.set(docRef, data)` to ensure atomic consistency for collaborative updates.
- **R-CACHE-002** MUST: Use cache abstractions (FirebaseSceneVersionCache.cache.get/set, appJotaiStore.get/set, filesMap.set) consistently across all data access paths instead of direct storage access.
- **R-CACHE-003** MUST: Check `appJotaiStore.get(localStorageQuotaExceededAtom)` before attempting localStorage writes and handle quota exceeded scenarios gracefully.
- **R-CACHE-004** MUST: Track failed file persistence attempts using `erroredFiles.set(id, true)` to prevent repeated write attempts for files that failed to persist.
- **R-CACHE-005** SHOULD: Use `console.warn` for recoverable cache issues and `console.error` for critical failures that require investigation.
- **R-CACHE-006** MAY: Applications MAY use IndexedDB (idb-keyval) as a fallback storage layer when localStorage quota is exceeded.

### Verify

```bash
# Verify transaction-based Firebase operations
grep -r 'transaction\.get\|transaction\.set' --include='*.ts' --include='*.tsx' excalidraw-app/data/

# Verify FirebaseSceneVersionCache usage
grep -r 'FirebaseSceneVersionCache\.cache\.(get\|set)' --include='*.ts' excalidraw-app/

# Verify storage quota management
grep -r 'localStorageQuotaExceededAtom' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify cache abstraction patterns
grep -r '\.cache\.(get\|set)\|appJotaiStore\.(get\|set)\|filesMap\.set' --include='*.ts' --include='*.tsx' excalidraw-app/data/
```

**Accept when:**
- All Firebase document updates use `transaction.get` and `transaction.set` patterns with no direct `docRef.set` calls
- Cache abstractions (FirebaseSceneVersionCache, appJotaiStore, filesMap) are used consistently across all data access paths
- Storage quota exceeded scenarios are handled with `localStorageQuotaExceededAtom` checks and error state tracking via `erroredFiles`
- Console logging is present for cache operation failures using `console.warn` for recoverable issues and `console.error` for critical failures

<enforcement>
Claude Code MUST NOT skip or defer verification. All Firebase operations must use transactions, cache abstractions must be consistent, storage quota checks must be present, and error logging must be implemented before code is considered compliant.
</enforcement>