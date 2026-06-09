# Adopt Jotai Atom-Based State Management with IndexedDB Persistence: Data Adapters Implement

These rules are ALWAYS ACTIVE for all data persistence modules, state management code, and adapter implementations in the excalidraw-app project.

### Rules

- **R-JOTAI-001** MUST: Data adapters MUST implement standardized interfaces with load/save methods (e.g., LibraryIndexedDBAdapter, TTDIndexedDBAdapter) for each persistence domain.
- **R-JOTAI-002** MUST: All IndexedDB operations MUST use idb-keyval for Promise-based API access with proper error handling via try-catch blocks.
- **R-JOTAI-003** MUST: State coordination MUST use Jotai atoms accessed via appJotaiStore for cross-component reactivity and synchronous access outside React components.
- **R-JOTAI-004** MUST: Cache layers MUST implement versioned tracking using Map structures with element.id as key and element.version as value for synchronization state.
- **R-JOTAI-005** MUST: IndexedDB quota exceeded errors MUST be explicitly handled using localStorageQuotaExceededAtom to track quota state and display user warnings.
- **R-JOTAI-006** SHOULD: All IndexedDB operations SHOULD be wrapped with try-catch blocks and logged using console.warn or console.error for debugging.
- **R-JOTAI-007** SHOULD: New data domains SHOULD be created by implementing adapter classes following the pattern of LibraryIndexedDBAdapter and TTDIndexedDBAdapter.
- **R-JOTAI-008** SHOULD: Browser compatibility issues with IndexedDB in private browsing or older browsers SHOULD be mitigated with graceful degradation to in-memory-only mode.

### Verify

```bash
# Verify appJotaiStore usage for synchronous atom access
grep -r 'appJotaiStore\.(get|set)' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify idb-keyval usage in data persistence modules
grep -r 'idb-keyval' --include='*.ts' --include='*.tsx' excalidraw-app/data/

# Verify versioned cache tracking implementation
grep -r 'broadcastedElementVersions\.(get|set)' --include='*.ts' --include='*.tsx' excalidraw-app/
```

**Accept when:**
- All data persistence modules use idb-keyval for IndexedDB operations with proper error handling
- State coordination uses Jotai atoms accessed via appJotaiStore for cross-component reactivity
- Cache layers implement versioned tracking using Map structures for synchronization state
- IndexedDB quota exceeded errors are handled via localStorageQuotaExceededAtom
- All adapter implementations follow standardized load/save interface patterns

<enforcement>
Clause Code MUST NOT skip or defer verification. Pull requests introducing alternative state management patterns require architecture team approval. Direct localStorage usage for large data must be flagged and migrated to IndexedDB. Missing error handling for IndexedDB operations must be added before merge.
</enforcement>