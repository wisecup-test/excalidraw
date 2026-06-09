# Use console.warn and console.error for Async Storage Operation Error Logging: Error Logging Occur

These rules are ALWAYS ACTIVE for all async storage operation functions and error handling blocks within storage adapter modules in the excalidraw-app/data/ directory.

### Rules

- **R-STORAGE-LOG-001** MUST: Error logging MUST occur within async functions (saveFiles, load, loadChats, saveChats) at the point of failure detection.
- **R-STORAGE-LOG-002** MUST: Use console.error() for failures that result in data loss or prevent core functionality (e.g., failed save operations).
- **R-STORAGE-LOG-003** MUST: Use console.warn() for recoverable errors or degraded functionality (e.g., failed cache reads that can fall back to network).
- **R-STORAGE-LOG-004** MUST: Include the error object as a parameter to console methods to preserve stack traces: console.error('message', error).
- **R-STORAGE-LOG-005** SHOULD: Combine console logging with state management updates (e.g., localStorageQuotaExceededAtom) to enable UI feedback for specific error conditions.
- **R-STORAGE-LOG-006** SHOULD: Wrap idb-keyval operations (set, get) in try-catch blocks within async functions to ensure errors are caught and logged.

### Verify

```bash
# Check for console.error/warn in storage adapter functions
grep -r "console\.error\|console\.warn" excalidraw-app/data/ --include="*.ts" | grep -E "(saveFiles|load|loadChats|saveChats)" -A 5 -B 5

# Check for idb-keyval operations with console logging
grep -r "idb-keyval" excalidraw-app/data/ --include="*.ts" -A 10 | grep -E "console\.(error|warn)"

# Find all storage adapter files and verify logging presence
find excalidraw-app/data -name "*Storage*.ts" -o -name "*Data.ts" | xargs grep -l "console\.error\|console\.warn"
```

**Accept when:**
- All async storage functions (saveFiles, load, loadChats, saveChats) contain console.error or console.warn calls in error handling blocks
- Storage adapter files (LocalData.ts, TTDStorage.ts) demonstrate consistent use of console logging for idb-keyval operation failures
- Error log statements include contextual information about the operation that failed
- Error objects are passed as parameters to console methods to preserve stack traces
- console.error() is used for data loss or core functionality failures
- console.warn() is used for recoverable errors or degraded functionality

<enforcement>
Claude Code MUST NOT skip or defer verification of these rules. All async storage operations in scope must be audited for proper console logging at error points.
</enforcement>