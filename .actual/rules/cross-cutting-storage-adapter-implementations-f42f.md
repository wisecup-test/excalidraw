# Use console.warn and console.error for Async Storage Operation Error Logging: Storage Adapter Implementations

These rules are ALWAYS ACTIVE for all storage adapter implementations in the `excalidraw-app/data/` directory, including functions performing IndexedDB operations via idb-keyval and localStorage operations.

### Rules

- **R-STORAGE-001** MUST: Storage adapter implementations MUST log errors using console.error() for critical failures that prevent data persistence.
- **R-STORAGE-002** MUST: Use console.error() for failures that result in data loss or prevent core functionality (e.g., failed save operations).
- **R-STORAGE-003** SHOULD: Use console.warn() for recoverable errors or degraded functionality (e.g., failed cache reads that can fall back to network).
- **R-STORAGE-004** MUST: Include the error object as a parameter to console methods to preserve stack traces: console.error('message', error).
- **R-STORAGE-005** SHOULD: Combine console logging with state management updates (e.g., localStorageQuotaExceededAtom) to enable UI feedback for specific error conditions.
- **R-STORAGE-006** MUST: Wrap idb-keyval operations (set, get) in try-catch blocks within async functions to ensure errors are caught and logged.

### Verify

```bash
# Check for console.error/warn in storage adapter error handlers
grep -r "console\.error\|console\.warn" excalidraw-app/data/ --include="*.ts" | grep -E "(saveFiles|load|loadChats|saveChats)" -A 5 -B 5

# Verify idb-keyval operations have console logging
grep -r "idb-keyval" excalidraw-app/data/ --include="*.ts" -A 10 | grep -E "console\.(error|warn)"

# Find all storage adapter files and check for logging
find excalidraw-app/data -name "*Storage*.ts" -o -name "*Data.ts" | xargs grep -l "console\.error\|console\.warn"
```

**Accept when:**
- All async storage functions (saveFiles, load, loadChats, saveChats) contain console.error or console.warn calls in error handling blocks
- Storage adapter files (LocalData.ts, TTDStorage.ts) demonstrate consistent use of console logging for idb-keyval operation failures
- Error log statements include contextual information about the operation that failed
- Error objects are passed as parameters to console methods to preserve stack traces
- Try-catch blocks wrap idb-keyval operations in async functions

<enforcement>
Claude Code MUST NOT skip or defer verification of these rules. All storage adapter implementations MUST include appropriate console logging for error visibility during development and debugging.
</enforcement>