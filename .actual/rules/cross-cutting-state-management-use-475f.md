# Adopt Jotai Atom-Based State Management with IndexedDB Persistence: State Management Use

These rules are ALWAYS ACTIVE for all state management, data persistence, and caching code in the application, particularly modules handling client-side state coordination, IndexedDB operations, and cross-component reactivity.

### Rules

- **R-STATE-001** MUST: State management MUST use Jotai atoms (e.g., appJotaiStore with atoms like localStorageQuotaExceededAtom) for reactive state coordination across components.
- **R-STATE-002** MUST: All IndexedDB operations MUST use idb-keyval for Promise-based access with proper error handling via try-catch blocks.
- **R-STATE-003** MUST: All IndexedDB operations MUST include error handling with console.warn or console.error logging for debugging.
- **R-STATE-004** MUST: New data persistence modules MUST implement adapter classes following the pattern of LibraryIndexedDBAdapter and TTDIndexedDBAdapter with load/save methods.
- **R-STATE-005** MUST: Collaborative features MUST implement version tracking using Map structures with element.id as key and element.version as value.
- **R-STATE-006** SHOULD: Use appJotaiStore.get() and appJotaiStore.set() for synchronous atom access outside React components; use useAtom hooks within components.
- **R-STATE-007** SHOULD: Wrap all IndexedDB operations in try-catch blocks and provide graceful degradation to in-memory-only mode for private browsing or older browsers.
- **R-STATE-008** MAY: Direct localStorage usage is permitted only for ephemeral state under 5MB; large data MUST be migrated to IndexedDB.

### Verify

```bash
# Verify Jotai atom usage in state management
grep -r 'appJotaiStore\.(get|set)' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify idb-keyval usage in data persistence modules
grep -r 'idb-keyval' --include='*.ts' --include='*.tsx' excalidraw-app/data/

# Verify versioned cache tracking for collaborative features
grep -r 'broadcastedElementVersions\.(get|set)' --include='*.ts' --include='*.tsx' excalidraw-app/
```

**Accept when:**
- All data persistence modules use idb-keyval for IndexedDB operations with proper error handling (try-catch blocks present)
- State coordination uses Jotai atoms accessed via appJotaiStore for cross-component reactivity
- Cache layers implement versioned tracking using Map structures for synchronization state
- New data domains implement adapter interfaces with load/save methods following established patterns
- IndexedDB quota exceeded errors are tracked via localStorageQuotaExceededAtom with user notification

<enforcement>
Claude Code MUST NOT skip or defer verification. All state management code MUST be reviewed against these rules before approval. Pull requests introducing alternative state management patterns require architecture team approval. Direct localStorage usage for large data must be flagged and migrated to IndexedDB. Missing error handling for IndexedDB operations must be added before merge.
</enforcement>