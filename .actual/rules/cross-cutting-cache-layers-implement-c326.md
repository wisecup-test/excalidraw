# Adopt Jotai Atom-Based State Management with IndexedDB Persistence: Cache Layers Implement

These rules are ALWAYS ACTIVE for all data persistence modules, state management code, and cache layer implementations in the excalidraw-app project.

### Rules

- **R-JOTAI-001** MUST: Cache layers MUST implement versioned tracking using Map structures (e.g., broadcastedElementVersions.get/set) for synchronization state.
- **R-JOTAI-002** MUST: All data persistence modules MUST use idb-keyval for IndexedDB operations with proper error handling.
- **R-JOTAI-003** MUST: State coordination MUST use Jotai atoms accessed via appJotaiStore for cross-component reactivity.
- **R-JOTAI-004** MUST: All IndexedDB operations MUST be wrapped in try-catch blocks with console.warn or console.error logging for debugging.
- **R-JOTAI-005** MUST: New data domains MUST implement adapter classes with load/save methods following the pattern of LibraryIndexedDBAdapter and TTDIndexedDBAdapter.
- **R-JOTAI-006** SHOULD: Use appJotaiStore.get() and appJotaiStore.set() for synchronous atom access outside React components; use useAtom hooks within components.
- **R-JOTAI-007** SHOULD: Implement version tracking for collaborative features using Map structures with element.id as key and element.version as value.
- **R-JOTAI-008** MUST: Direct localStorage usage for large data MUST be flagged and migrated to IndexedDB.
- **R-JOTAI-009** MUST: Missing error handling for IndexedDB operations MUST be added before merge.

### Verify

```bash
# Verify appJotaiStore usage patterns
grep -r 'appJotaiStore\.(get|set)' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify idb-keyval usage in data modules
grep -r 'idb-keyval' --include='*.ts' --include='*.tsx' excalidraw-app/data/

# Verify versioned cache layer implementation
grep -r 'broadcastedElementVersions\.(get|set)' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify error handling in IndexedDB operations
grep -r 'try.*catch' --include='*.ts' --include='*.tsx' excalidraw-app/data/ | grep -i 'idb\|indexeddb'

# Verify adapter pattern compliance
grep -r 'class.*Adapter' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -E '(LibraryIndexedDBAdapter|TTDIndexedDBAdapter)'
```

**Accept when:**
- All data persistence modules use idb-keyval for IndexedDB operations with proper error handling
- State coordination uses Jotai atoms accessed via appJotaiStore for cross-component reactivity
- Cache layers implement versioned tracking using Map structures for synchronization state
- All IndexedDB operations include try-catch blocks with appropriate logging
- New data domains follow the adapter interface pattern with load/save methods
- No direct localStorage usage exists for large data storage

<enforcement>
Claude Code MUST NOT skip or defer verification. All rules in this file are mandatory for data persistence and state management code. Code review checks MUST verify proper use of Jotai atoms and idb-keyval in new data persistence code. Automated grep-based verification in CI pipeline MUST ensure consistent patterns. Architecture review MUST validate adapter interface compliance for new data domains. Pull requests introducing alternative state management patterns require architecture team approval.
</enforcement>