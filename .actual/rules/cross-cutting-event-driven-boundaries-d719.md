# Adopt Jotai Atom-Based State Management with IndexedDB Persistence: Event Driven Boundaries

These rules are ALWAYS ACTIVE for all files in the excalidraw-app project that implement state management, data persistence, or real-time collaboration features using Jotai atoms, IndexedDB operations, or socket-based event handling.

### Rules

- **R-JOTAI-001** MUST: All data persistence modules use idb-keyval for IndexedDB operations with proper error handling wrapped in try-catch blocks.
- **R-JOTAI-002** MUST: State coordination across components use Jotai atoms accessed via appJotaiStore for cross-component reactivity.
- **R-JOTAI-003** MUST: All IndexedDB operations include error handling with console.warn or console.error for debugging.
- **R-JOTAI-004** SHOULD: Event-driven boundaries use socket.on/emit patterns for real-time collaboration features with appropriate event types (init-room, new-user, room-user-change).
- **R-JOTAI-005** SHOULD: Cache layers implement versioned tracking using Map structures with element.id as key and element.version as value for synchronization state.
- **R-JOTAI-006** SHOULD: New data domains be created by implementing adapter classes with load/save methods following the pattern of LibraryIndexedDBAdapter and TTDIndexedDBAdapter.
- **R-JOTAI-007** MAY: Use appJotaiStore.get() and appJotaiStore.set() for synchronous atom access outside React components; use useAtom hooks within components.

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
- Socket event handlers use standardized event types (init-room, new-user, room-user-change) for collaboration
- New adapter implementations follow LibraryIndexedDBAdapter and TTDIndexedDBAdapter interface patterns

<enforcement>
Clause Code MUST NOT skip or defer verification. All new data persistence code, state management patterns, and collaborative event handlers MUST pass the verify commands before merge. Pull requests introducing alternative state management patterns require architecture team approval. Direct localStorage usage for large data must be flagged and migrated to IndexedDB. Missing error handling for IndexedDB operations must be added before merge.
</enforcement>