# Use console.warn and console.error for Async Storage Operation Error Logging: Storage Adapters Working

These rules are ALWAYS ACTIVE for all storage adapter modules in the `excalidraw-app/data/` directory, including functions performing IndexedDB operations via idb-keyval and localStorage operations, particularly async storage operations: saveFiles, load, loadChats, and saveChats.

### Rules

- **R-STORAGE-001** SHOULD: Storage adapters working with idb-keyval SHOULD log failures during set() and get() operations using console.error() for critical failures that result in data loss or prevent core functionality, and console.warn() for recoverable errors or degraded functionality.
- **R-STORAGE-002** MUST: Include the error object as a parameter to console methods to preserve stack traces: `console.error('message', error)` or `console.warn('message', error)`.
- **R-STORAGE-003** MUST: Wrap idb-keyval operations (set, get) in try-catch blocks within async functions to ensure errors are caught and logged.
- **R-STORAGE-004** SHOULD: Combine console logging with state management updates (e.g., localStorageQuotaExceededAtom) to enable UI feedback for specific error conditions.

### Verify

```bash
# Check for console.error/warn in storage adapter error handlers
grep -r "console\.error\|console\.warn" excalidraw-app/data/ --include="*.ts" | grep -E "(saveFiles|load|loadChats|saveChats)" -A 5 -B 5

# Check idb-keyval operations have console logging
grep -r "idb-keyval" excalidraw-app/data/ --include="*.ts" -A 10 | grep -E "console\.(error|warn)"

# Find all storage adapter files and verify they contain console logging
find excalidraw-app/data -name "*Storage*.ts" -o -name "*Data.ts" | xargs grep -l "console\.error\|console\.warn"
```

**Accept when:**
- All async storage functions (saveFiles, load, loadChats, saveChats) contain console.error or console.warn calls in error handling blocks
- Storage adapter files (LocalData.ts, TTDStorage.ts) demonstrate consistent use of console logging for idb-keyval operation failures
- Error log statements include contextual information about the operation that failed
- Error objects are passed as parameters to console methods to preserve stack traces
- Try-catch blocks wrap idb-keyval operations in async functions

<enforcement>
Claude Code MUST NOT skip or defer verification of these rules. All storage adapter error handlers MUST include appropriate console logging before code is considered compliant.
</enforcement>