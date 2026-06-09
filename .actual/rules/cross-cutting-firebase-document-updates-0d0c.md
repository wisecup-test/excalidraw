# Adopt Cache-Based State Management with Transactional Consistency for Collaborative Data: Firebase Document Updates

These rules are ALWAYS ACTIVE for all Firebase document update operations, in-memory cache layer implementations, WebSocket-based collaborative data synchronization, and local storage persistence patterns within the collaborative data management system.

### Rules

- **R-CACHE-001** MUST: Firebase document updates MUST use transaction-based operations (transaction.get, transaction.set) to ensure atomic consistency and prevent race conditions during concurrent updates.

### Verify

```bash
# Verify all Firebase document updates use transaction-based operations
grep -r 'transaction\.get\|transaction\.set' --include='*.ts' --include='*.tsx' excalidraw-app/data/

# Verify FirebaseSceneVersionCache cache abstractions are used consistently
grep -r 'FirebaseSceneVersionCache\.cache\.(get\|set)' --include='*.ts' excalidraw-app/

# Verify storage quota exceeded scenarios are handled
grep -r 'localStorageQuotaExceededAtom' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify cache abstractions are used across data access paths
grep -r '\.cache\.(get\|set)\|appJotaiStore\.(get\|set)\|filesMap\.set' --include='*.ts' --include='*.tsx' excalidraw-app/data/
```

**Accept when:**
- All Firebase document updates use transaction.get and transaction.set patterns (no direct docRef.set calls)
- Cache abstractions (FirebaseSceneVersionCache, appJotaiStore, filesMap) are used consistently across all data access paths
- Storage quota exceeded scenarios are handled with localStorageQuotaExceededAtom checks and error state tracking
- Console logging is present for cache operation failures (console.warn, console.error)

<enforcement>
Claude Code MUST NOT skip or defer verification of R-CACHE-001. All Firebase document updates must be inspected for transaction-based consistency patterns before approval.
</enforcement>