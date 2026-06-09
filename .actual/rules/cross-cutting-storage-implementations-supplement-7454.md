# Use console.warn and console.error for Async Storage Operation Error Logging: Storage Implementations Supplement

These rules are ALWAYS ACTIVE for all storage adapter modules in the excalidraw-app/data/ directory, including functions performing IndexedDB operations via idb-keyval and localStorage operations, particularly async storage operations: saveFiles, load, loadChats, and saveChats.

### Rules

- **R-STORAGE-001** MUST: Use console.error() for failures that result in data loss or prevent core functionality (e.g., failed save operations).
- **R-STORAGE-002** MUST: Use console.warn() for recoverable errors or degraded functionality (e.g., failed cache reads that can fall back to network).
- **R-STORAGE-003** MUST: Include the error object as a parameter to console methods to preserve stack traces: console.error('message', error).
- **R-STORAGE-004** MAY: Storage implementations MAY supplement console logging with state management updates (e.g., appJotaiStore.set(localStorageQuotaExceededAtom, true)).
- **R-STORAGE-005** MUST: Wrap idb-keyval operations (set, get) in try-catch blocks within async functions to ensure errors are caught and logged.
- **R-STORAGE-006** MUST: Include contextual information about the operation that failed in error log statements.

### Verify

```bash
# Check for console.error and console.warn in storage adapter error handlers
grep -r "console\.error\|console\.warn" excalidraw-app/data/ --include="*.ts" | grep -E "(saveFiles|load|loadChats|saveChats)" -A 5 -B 5

# Verify idb-keyval operations have console logging
grep -r "idb-keyval" excalidraw-app/data/ --include="*.ts" -A 10 | grep -E "console\.(error|warn)"

# Find all storage adapter files and check for console logging
find excalidraw-app/data -name "*Storage*.ts" -o -name "*Data.ts" | xargs grep -l "console\.error\|console\.warn"
```

**Accept when:**
- All async storage functions (saveFiles, load, loadChats, saveChats) contain console.error or console.warn calls in error handling blocks
- Storage adapter files (LocalData.ts, TTDStorage.ts) demonstrate consistent use of console logging for idb-keyval operation failures
- Error log statements include contextual information about the operation that failed
- Error objects are passed as parameters to console methods to preserve stack traces
- idb-keyval operations are wrapped in try-catch blocks with appropriate error logging

<enforcement>
Claude Code MUST NOT skip or defer verification. All storage adapter error handlers MUST include appropriate console logging before code review approval.
</enforcement>