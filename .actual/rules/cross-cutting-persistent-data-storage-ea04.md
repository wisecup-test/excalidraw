# Adopt Jotai Atom-Based State Management with IndexedDB Persistence: Persistent Data Storage

These rules are ALWAYS ACTIVE for all data persistence modules, state management code, and any files implementing client-side storage or cross-component state coordination in the excalidraw-app project.

### Rules

- **R-JOTAI-IDB-001** MUST: Persistent data storage MUST use IndexedDB via the idb-keyval library for durable client-side persistence.
- **R-JOTAI-IDB-002** MUST: All IndexedDB operations MUST be wrapped in try-catch blocks with proper error handling and logging using console.warn or console.error.
- **R-JOTAI-IDB-003** MUST: State coordination across components MUST use Jotai atoms accessed via appJotaiStore for cross-component reactivity.
- **R-JOTAI-IDB-004** MUST: New data domains MUST implement adapter classes with load/save methods following the pattern of LibraryIndexedDBAdapter and TTDIndexedDBAdapter.
- **R-JOTAI-IDB-005** MUST: Collaborative features MUST implement version tracking using Map structures with element.id as key and element.version as value.
- **R-JOTAI-IDB-006** SHOULD: Use appJotaiStore.get() and appJotaiStore.set() for synchronous atom access outside React components; use useAtom hooks within components.
- **R-JOTAI-IDB-007** SHOULD: Implement localStorageQuotaExceededAtom to track quota state and display user warnings to prevent data loss.
- **R-JOTAI-IDB-008** MAY: Wrap IndexedDB operations with graceful degradation to in-memory-only mode for private browsing or older browser compatibility.

### Verify

```bash
# Verify Jotai store usage patterns
grep -r 'appJotaiStore\.(get|set)' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify idb-keyval usage in data modules
grep -r 'idb-keyval' --include='*.ts' --include='*.tsx' excalidraw-app/data/

# Verify versioned cache tracking
grep -r 'broadcastedElementVersions\.(get|set)' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify adapter pattern compliance
grep -r 'IndexedDBAdapter' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -E '(load|save)'

# Verify error handling for IndexedDB
grep -r 'try.*catch' --include='*.ts' --include='*.tsx' excalidraw-app/data/ | grep -i 'idb\|indexeddb'
```

**Accept when:**
- All data persistence modules use idb-keyval for IndexedDB operations with proper error handling
- State coordination uses Jotai atoms accessed via appJotaiStore for cross-component reactivity
- Cache layers implement versioned tracking using Map structures for synchronization state
- New data domains follow the adapter interface pattern with load/save methods
- All IndexedDB operations include try-catch blocks with console logging
- Quota exceeded scenarios are handled via localStorageQuotaExceededAtom or equivalent tracking

<enforcement>
Claude Code MUST NOT skip or defer verification. All data persistence code MUST comply with R-JOTAI-IDB-001 through R-JOTAI-IDB-008. Code review checks MUST verify proper use of Jotai atoms and idb-keyval. Pull requests introducing alternative state management patterns require architecture team approval. Direct localStorage usage for large data MUST be flagged and migrated to IndexedDB. Missing error handling for IndexedDB operations MUST be added before merge.
</enforcement>