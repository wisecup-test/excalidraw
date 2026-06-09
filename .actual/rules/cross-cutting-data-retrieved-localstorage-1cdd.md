# Adopt JSON.parse for Input Validation in Local Storage Operations: Data Retrieved Localstorage

These rules are ALWAYS ACTIVE for all LocalData service operations, storage adapter implementations (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter), and file data loading operations that read from localStorage.

### Rules

- **R-LSDATA-001** MUST: All data retrieved from localStorage MUST be parsed using JSON.parse before use in application logic.
- **R-LSDATA-002** MUST: Wrap all JSON.parse(localStorage.getItem(...)) calls in try-catch blocks that log errors using console.error or console.warn.
- **R-LSDATA-003** MUST: Update erroredFiles map when file-specific parsing fails: erroredFiles.set(id, true).
- **R-LSDATA-004** MUST: Use appJotaiStore.set(localStorageQuotaExceededAtom, true) when storage quota issues are detected during parse operations.
- **R-LSDATA-005** MUST: Ensure storage adapters (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter) consistently apply JSON.parse validation before returning data to consumers.
- **R-LSDATA-006** SHOULD: Monitor parse operation performance and consider implementing lazy loading or chunking for large datasets.

### Verify

```bash
# Check for localStorage.getItem calls without JSON.parse
grep -r 'localStorage\.getItem' --include='*.ts' --include='*.tsx' | grep -v 'JSON\.parse' | wc -l | grep -q '^0$'

# Verify JSON.parse calls have try-catch error handling
grep -r 'JSON\.parse.*localStorage' --include='*.ts' --include='*.tsx' -A 3 | grep -q 'try\|catch'

# Verify security.input_validation pattern in LocalData service
grep -r 'security\.input_validation.*JSON\.parse' excalidraw-app/data/LocalData.ts
```

**Accept when:**
- All localStorage.getItem() calls are followed by JSON.parse() with try-catch error handling
- Parse errors are logged using console.error or console.warn and tracked in erroredFiles or localStorageQuotaExceededAtom as appropriate
- Storage adapters (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter) implement consistent JSON.parse validation
- No raw localStorage usage exists in LocalData service without JSON.parse wrapping

<enforcement>
Claude Code MUST NOT skip or defer verification. All localStorage read operations MUST be validated through JSON.parse with proper error handling before merging code changes.
</enforcement>