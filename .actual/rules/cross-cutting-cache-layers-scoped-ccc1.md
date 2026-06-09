# Adopt Cache-Based State Management with Transactional Consistency for Collaborative Data: Cache Layers Scoped

These rules are ALWAYS ACTIVE for all collaborative data synchronization code, Firebase operations, cache layer implementations, and state management patterns in the excalidraw-app project.

### Rules

- **R-CACHE-001** SHOULD: Cache layers SHOULD be scoped to specific data domains (scene versions, file data, application state) to maintain separation of concerns.
- **R-CACHE-002** MUST: All Firebase document updates MUST use transaction.get and transaction.set patterns to ensure atomic consistency and prevent race conditions during concurrent updates.
- **R-CACHE-003** MUST: Cache abstractions (FirebaseSceneVersionCache, appJotaiStore, filesMap) MUST be used consistently across all data access paths instead of direct storage access.
- **R-CACHE-004** MUST: Storage quota exceeded scenarios MUST be handled with localStorageQuotaExceededAtom checks before attempting localStorage writes.
- **R-CACHE-005** MUST: Cache operation failures MUST be logged with console.warn for recoverable issues and console.error for critical failures requiring investigation.
- **R-CACHE-006** SHOULD: Error state tracking SHOULD be implemented using erroredFiles.set(id, true) to prevent repeated write attempts for files that failed to persist.

### Verify

```bash
# Verify Firebase transaction usage
grep -r 'transaction\.get\|transaction\.set' --include='*.ts' --include='*.tsx' excalidraw-app/data/

# Verify FirebaseSceneVersionCache cache methods
grep -r 'FirebaseSceneVersionCache\.cache\.(get\|set)' --include='*.ts' excalidraw-app/

# Verify storage quota management
grep -r 'localStorageQuotaExceededAtom' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify cache abstraction usage
grep -r '\.cache\.(get\|set)\|appJotaiStore\.(get\|set)\|filesMap\.set' --include='*.ts' --include='*.tsx' excalidraw-app/data/
```

**Accept when:**
- All Firebase document updates use transaction.get and transaction.set patterns (no direct docRef.set calls)
- Cache abstractions (FirebaseSceneVersionCache, appJotaiStore, filesMap) are used consistently across all data access paths
- Storage quota exceeded scenarios are handled with localStorageQuotaExceededAtom checks and error state tracking
- Console logging is present for cache operation failures (console.warn, console.error)
- No direct Firebase document writes without transactions are detected
- Cache abstractions are not bypassed for direct storage access

<enforcement>
Claude Code MUST NOT skip or defer verification. All Firebase operations MUST use transactions. All cache access MUST go through established abstractions. Storage quota checks MUST precede localStorage writes. Violations block code review and CI pipeline.
</enforcement>