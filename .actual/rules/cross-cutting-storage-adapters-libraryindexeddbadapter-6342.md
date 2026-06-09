# Adopt JSON.parse for Input Validation in Local Storage Operations: Storage Adapters Libraryindexeddbadapter

These rules are ALWAYS ACTIVE for all LocalData service operations that read from localStorage, LibraryIndexedDBAdapter and LibraryLocalStorageMigrationAdapter data deserialization, file data loading operations in the saveFiles and load concurrency model, and application state restoration from @excalidraw/excalidraw/appState.

### Rules

- **R-STORAGE-001** MUST: Wrap all `JSON.parse(localStorage.getItem(...))` calls in try-catch blocks that log errors using `console.error` or `console.warn`.
- **R-STORAGE-002** MUST: Update `erroredFiles` map when file-specific parsing fails: `erroredFiles.set(id, true)`.
- **R-STORAGE-003** MUST: Use `appJotaiStore.set(localStorageQuotaExceededAtom, true)` when storage quota issues are detected during parse operations.
- **R-STORAGE-004** MUST: Ensure storage adapters (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter) consistently apply JSON.parse validation before returning data to consumers.
- **R-STORAGE-005** MAY: Storage adapters (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter) MAY implement additional validation beyond JSON.parse for domain-specific constraints.

### Verify

```bash
# Check for localStorage.getItem calls not followed by JSON.parse
grep -r 'localStorage\.getItem' --include='*.ts' --include='*.tsx' | grep -v 'JSON\.parse' | wc -l | grep -q '^0$'

# Verify JSON.parse calls have try-catch error handling
grep -r 'JSON\.parse.*localStorage' --include='*.ts' --include='*.tsx' -A 3 | grep -q 'try\|catch'

# Verify security.input_validation pattern in LocalData service
grep -r 'security\.input_validation.*JSON\.parse' excalidraw-app/data/LocalData.ts
```

**Accept when:**
- All `localStorage.getItem()` calls are followed by `JSON.parse()` with try-catch error handling
- Parse errors are logged using `console.error` or `console.warn` and tracked in `erroredFiles` or `localStorageQuotaExceededAtom` as appropriate
- Storage adapters (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter) implement consistent JSON.parse validation
- No raw localStorage usage exists in LocalData service without JSON.parse wrapping

<enforcement>
Clause Code MUST NOT skip or defer verification. All localStorage operations MUST be validated through JSON.parse with proper error handling. CI pipeline MUST fail if grep checks detect localStorage.getItem without JSON.parse. Code review MUST block merge if try-catch blocks are missing around JSON.parse operations.
</enforcement>