# Adopt Jotai Atom-Based State Management with IndexedDB Persistence: Components Implement Volatile

These rules are ALWAYS ACTIVE for all files matching the configured scope in the excalidraw-app project, particularly data persistence modules, state management layers, and components implementing collaborative features.

### Rules

- **R-JOTAI-001** MAY: Components MAY implement volatile broadcast mechanisms for performance-critical updates using WS_EVENTS.SERVER_VOLATILE
- **R-JOTAI-002** MUST: All data persistence modules use idb-keyval for IndexedDB operations with proper error handling wrapped in try-catch blocks
- **R-JOTAI-003** MUST: State coordination use Jotai atoms accessed via appJotaiStore for cross-component reactivity
- **R-JOTAI-004** MUST: Cache layers implement versioned tracking using Map structures with element.id as key and element.version as value for synchronization state
- **R-JOTAI-005** MUST: All IndexedDB operations include error handling with console.warn or console.error for debugging
- **R-JOTAI-006** SHOULD: New data domains be created by implementing adapter classes with load/save methods following the pattern of LibraryIndexedDBAdapter and TTDIndexedDBAdapter
- **R-JOTAI-007** SHOULD: Use appJotaiStore.get() and appJotaiStore.set() for synchronous atom access outside React components; use useAtom hooks within components
- **R-JOTAI-008** MUST: Direct localStorage usage for large data be flagged and migrated to IndexedDB
- **R-JOTAI-009** MUST: Missing error handling for IndexedDB operations be added before merge

### Verify

```bash
# Verify Jotai store usage patterns
grep -r 'appJotaiStore\.(get|set)' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify idb-keyval usage in data modules
grep -r 'idb-keyval' --include='*.ts' --include='*.tsx' excalidraw-app/data/

# Verify versioned cache tracking
grep -r 'broadcastedElementVersions\.(get|set)' --include='*.ts' --include='*.tsx' excalidraw-app/

# Verify error handling in IndexedDB operations
grep -r 'try.*catch' --include='*.ts' --include='*.tsx' excalidraw-app/data/ | grep -i 'idb\|indexeddb'

# Verify adapter pattern compliance
grep -r 'class.*Adapter' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -E '(Library|TTD)IndexedDBAdapter'
```

**Accept when:**
- All data persistence modules use idb-keyval for IndexedDB operations with proper error handling
- State coordination uses Jotai atoms accessed via appJotaiStore for cross-component reactivity
- Cache layers implement versioned tracking using Map structures for synchronization state
- All IndexedDB operations are wrapped in try-catch blocks with appropriate logging
- New data domains follow the adapter interface pattern (load/save methods)
- No direct localStorage usage exists for large data storage
- Volatile broadcast mechanisms use WS_EVENTS.SERVER_VOLATILE for performance-critical updates

<enforcement>
Claude Code MUST NOT skip or defer verification. Code review checks for proper use of Jotai atoms and idb-keyval in new data persistence code are mandatory. Automated grep-based verification in CI pipeline ensures consistent patterns. Architecture review for new data domains validates adapter interface compliance. Pull requests introducing alternative state management patterns require architecture team approval.
</enforcement>