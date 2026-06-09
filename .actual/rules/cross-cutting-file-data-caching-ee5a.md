# Adopt Cache-Based State Management with Transactional Consistency for Collaborative Data: File Data Caching

These rules are ALWAYS ACTIVE for all collaborative data synchronization code, Firebase real-time database operations, in-memory cache layers, WebSocket-based data synchronization, and local storage persistence layers within the excalidraw-app project.

### Rules

- **R-CACHE-001** MUST: File data caching MUST track storage failures using error state management (erroredFiles.set, localStorageQuotaExceededAtom).
- **R-CACHE-002** MUST: All Firebase document updates MUST use transaction.get and transaction.set patterns to ensure atomic consistency for collaborative updates.
- **R-CACHE-003** MUST: Cache abstractions (FirebaseSceneVersionCache, appJotaiStore, filesMap) MUST be used consistently across all data access paths instead of direct storage access.
- **R-CACHE-004** MUST: Storage quota exceeded scenarios MUST be handled with localStorageQuotaExceededAtom checks and error state tracking before attempting localStorage writes.
- **R-CACHE-005** MUST: Cache operation failures MUST be logged with console.warn for recoverable issues and console.error for critical failures requiring investigation.

### Verify

```bash
# Verify transaction-based Firebase operations
grep -r 'transaction\.get\|transaction\.set' --include='*.ts' --include='*.tsx' excalidraw-app/data/

# Verify FirebaseSceneVersionCache usage
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
- erroredFiles.set is used to prevent repeated write attempts for files that failed to persist

<enforcement>
Claude Code MUST NOT skip or defer verification. All grep verification commands MUST execute successfully. Code review MUST block merge if cache abstractions are bypassed for direct storage access. CI pipeline MUST fail if non-transactional Firebase writes are detected.
</enforcement>