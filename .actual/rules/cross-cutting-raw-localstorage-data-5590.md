# Adopt JSON.parse for Input Validation in Local Storage Operations: Raw Localstorage Data

These rules are ALWAYS ACTIVE for all LocalData service operations, storage adapter implementations (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter), and file data loading operations that read from localStorage or deserialize persisted application state.

### Rules

- **R-STORAGE-001** MUST_NOT: Raw localStorage data MUST_NOT be used directly without JSON.parse validation.
- **R-STORAGE-002** MUST: All `localStorage.getItem()` calls MUST be wrapped in try-catch blocks with JSON.parse validation before use.
- **R-STORAGE-003** MUST: Parse errors MUST be logged using `console.error` or `console.warn` and tracked in `erroredFiles` map or `localStorageQuotaExceededAtom` as appropriate.
- **R-STORAGE-004** MUST: Storage adapters (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter) MUST implement consistent JSON.parse validation before returning data to consumers.
- **R-STORAGE-005** SHOULD: When storage quota issues are detected during parse operations, `appJotaiStore.set(localStorageQuotaExceededAtom, true)` SHOULD be invoked.
- **R-STORAGE-006** MAY: Legacy data format migrations MAY implement format detection and conversion before JSON.parse as documented exceptions (EXC-001).

### Verify

```bash
# Check for any localStorage.getItem calls not followed by JSON.parse
grep -r 'localStorage\.getItem' --include='*.ts' --include='*.tsx' | grep -v 'JSON\.parse' | wc -l | grep -q '^0$'

# Verify JSON.parse calls have try-catch error handling
grep -r 'JSON\.parse.*localStorage' --include='*.ts' --include='*.tsx' -A 3 | grep -q 'try\|catch'

# Verify security.input_validation pattern is documented
grep -r 'security\.input_validation.*JSON\.parse' excalidraw-app/data/LocalData.ts
```

**Accept when:**
- All `localStorage.getItem()` calls are followed by `JSON.parse()` with try-catch error handling
- Parse errors are logged using `console.error` or `console.warn` and tracked in `erroredFiles` or `localStorageQuotaExceededAtom` as appropriate
- Storage adapters (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter) implement consistent JSON.parse validation
- No raw localStorage data is used directly without validation in LocalData service boundary
- Legacy migration operations document their exception status and alternative validation approach

<enforcement>
Clause Code MUST NOT skip or defer verification. All localStorage read operations MUST pass JSON.parse validation checks. CI pipeline MUST fail if grep checks detect `localStorage.getItem` without `JSON.parse`. Code review MUST block merge if try-catch blocks are missing around JSON.parse operations. Security review is REQUIRED for any exceptions to the JSON.parse requirement.
</enforcement>