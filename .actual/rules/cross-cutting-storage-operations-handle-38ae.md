# Adopt Jotai Atom-Based State Management with IndexedDB Persistence: Storage Operations Handle

These rules are ALWAYS ACTIVE for all data persistence modules, storage adapters, and state management code that handles client-side caching and IndexedDB operations.

### Rules

- **R-STORAGE-001** SHOULD: Storage operations SHOULD handle quota exceeded errors gracefully by setting appropriate atom state (localStorageQuotaExceededAtom) and logging warnings.

### Verify

```bash
# Verify Jotai store usage patterns
grep -r 'appJotaiStore\.(get|set)' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify idb-keyval usage in data modules
grep -r 'idb-keyval' --include='*.ts' --include='*.tsx' excalidraw-app/data/

# Verify versioned cache tracking
grep -r 'broadcastedElementVersions\.(get|set)' --include='*.ts' --include='*.tsx' excalidraw-app/
```

**Accept when:**
- All data persistence modules use idb-keyval for IndexedDB operations with proper error handling
- State coordination uses Jotai atoms accessed via appJotaiStore for cross-component reactivity
- Cache layers implement versioned tracking using Map structures for synchronization state
- Storage quota errors are caught and logged with appropriate atom state updates
- New data domains implement adapter classes following LibraryIndexedDBAdapter and TTDIndexedDBAdapter patterns

<enforcement>
Clause R-STORAGE-001 verification is mandatory. Code review MUST check for proper use of Jotai atoms and idb-keyval in new data persistence code. Pull requests introducing alternative state management patterns require architecture team approval. Direct localStorage usage for large data must be flagged and migrated to IndexedDB. Missing error handling for IndexedDB operations must be added before merge.
</enforcement>