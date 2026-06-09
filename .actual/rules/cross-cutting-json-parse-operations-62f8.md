# Adopt JSON.parse for Input Validation in Local Storage Operations: Json Parse Operations

These rules are ALWAYS ACTIVE for all LocalData service operations, storage adapter implementations (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter), and file data loading operations that read from localStorage or deserialize persisted data.

### Rules

- **R-JSON-001** MUST: JSON.parse operations MUST be wrapped in try-catch blocks to handle malformed data gracefully.
- **R-JSON-002** MUST: All localStorage.getItem() calls that retrieve serialized data MUST be followed by JSON.parse() with try-catch error handling.
- **R-JSON-003** MUST: Parse errors MUST be logged using console.error or console.warn and tracked in erroredFiles or localStorageQuotaExceededAtom as appropriate.
- **R-JSON-004** MUST: Storage adapters (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter) MUST implement consistent JSON.parse validation before returning data to consumers.
- **R-JSON-005** SHOULD: When storage quota issues are detected during parse operations, appJotaiStore.set(localStorageQuotaExceededAtom, true) SHOULD be invoked to track the condition.

### Verify

```bash
# Check for localStorage.getItem calls not wrapped with JSON.parse
grep -r 'localStorage\.getItem' --include='*.ts' --include='*.tsx' | grep -v 'JSON\.parse' | wc -l | grep -q '^0$'

# Verify JSON.parse calls have try-catch blocks
grep -r 'JSON\.parse.*localStorage' --include='*.ts' --include='*.tsx' -A 3 | grep -q 'try\|catch'

# Verify security.input_validation pattern is present in LocalData service
grep -r 'security\.input_validation.*JSON\.parse' excalidraw-app/data/LocalData.ts
```

**Accept when:**
- All localStorage.getItem() calls are followed by JSON.parse() with try-catch error handling
- Parse errors are logged using console.error or console.warn and tracked in erroredFiles or localStorageQuotaExceededAtom as appropriate
- Storage adapters (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter) implement consistent JSON.parse validation
- No raw localStorage usage exists in LocalData service without JSON.parse wrapping

<enforcement>
Clause Code MUST NOT skip or defer verification. All JSON.parse operations in scope MUST be wrapped in try-catch blocks. CI pipeline MUST fail if grep checks detect localStorage.getItem without JSON.parse. Code review MUST block merge if try-catch blocks are missing. Security review is required for any exceptions to the JSON.parse requirement.
</enforcement>