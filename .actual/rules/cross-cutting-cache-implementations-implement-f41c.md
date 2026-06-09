# Adopt Cache-Based State Management with Transactional Consistency for Collaborative Data: Cache Implementations Implement

These rules are ALWAYS ACTIVE for all collaborative data synchronization code, Firebase operations, cache implementations, and state management layers in the application.

### Rules

- **R-CACHE-001** MUST: Cache implementations MUST implement get/set operations with proper error handling for storage quota exceeded scenarios.

### Verify

```bash
# Verify Firebase transaction-based operations
grep -r 'transaction\.get\|transaction\.set' --include='*.ts' --include='*.tsx' excalidraw-app/data/

# Verify FirebaseSceneVersionCache usage
grep -r 'FirebaseSceneVersionCache\.cache\.(get\|set)' --include='*.ts' excalidraw-app/

# Verify storage quota handling
grep -r 'localStorageQuotaExceededAtom' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify cache abstraction patterns
grep -r '\.cache\.(get\|set)\|appJotaiStore\.(get\|set)\|filesMap\.set' --include='*.ts' --include='*.tsx' excalidraw-app/data/
```

**Accept when:**
- All Firebase document updates use transaction.get and transaction.set patterns (no direct docRef.set calls)
- Cache abstractions (FirebaseSceneVersionCache, appJotaiStore, filesMap) are used consistently across all data access paths
- Storage quota exceeded scenarios are handled with localStorageQuotaExceededAtom checks and error state tracking
- Console logging is present for cache operation failures (console.warn, console.error)

<enforcement>
Clause Code MUST NOT skip or defer verification of cache implementation patterns. All cache get/set operations MUST include explicit error handling for storage quota exceeded scenarios. Violations block code review and CI pipeline.
</enforcement>