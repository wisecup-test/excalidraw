# Adopt Cache-Based State Management with Transactional Consistency for Collaborative Data: Cache Operations Log

These rules are ALWAYS ACTIVE for all Firebase real-time database operations, in-memory cache layers (FirebaseSceneVersionCache, appJotaiStore, filesMap), WebSocket-based collaborative data synchronization, and local storage/IndexedDB persistence layers within the collaborative data synchronization system.

### Rules

- **R-CACHE-001** SHOULD: Cache operations SHOULD log warnings and errors using console.warn and console.error for debugging storage issues.

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

# Verify console logging for cache operations
grep -r 'console\.warn\|console\.error' --include='*.ts' --include='*.tsx' excalidraw-app/data/ | grep -i 'cache\|storage\|quota'
```

**Accept when:**
- All Firebase document updates use transaction.get and transaction.set patterns (no direct docRef.set calls)
- Cache abstractions (FirebaseSceneVersionCache, appJotaiStore, filesMap) are used consistently across all data access paths
- Storage quota exceeded scenarios are handled with localStorageQuotaExceededAtom checks and error state tracking
- Console logging is present for cache operation failures (console.warn, console.error)
- Error tracking with erroredFiles.set(id, true) prevents repeated write attempts for failed persistence

<enforcement>
Claude Code MUST NOT skip or defer verification. All Firebase operations must use transactions, cache abstractions must be consistent, storage quota handling must be present, and console logging for cache failures is mandatory.
</enforcement>