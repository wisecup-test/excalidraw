# Adopt JSON.parse for Input Validation in Local Storage Operations: Parse Errors Logged

These rules are ALWAYS ACTIVE for all LocalData service operations, storage adapter implementations (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter), and file data loading operations that read from localStorage or deserialize persisted data.

### Rules

- **R-PARSE-001** MUST: Parse errors MUST be logged using the established console.error or console.warn patterns.
- **R-PARSE-002** MUST: All localStorage.getItem() calls MUST be followed by JSON.parse() with try-catch error handling.
- **R-PARSE-003** MUST: Parse errors MUST be tracked in erroredFiles map or localStorageQuotaExceededAtom as appropriate.
- **R-PARSE-004** MUST: Storage adapters (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter) MUST implement consistent JSON.parse validation before returning data to consumers.

### Verify

```bash
# Check for localStorage.getItem calls not followed by JSON.parse
grep -r 'localStorage\.getItem' --include='*.ts' --include='*.tsx' | grep -v 'JSON\.parse' | wc -l | grep -q '^0$'

# Verify JSON.parse calls have try-catch error handling
grep -r 'JSON\.parse.*localStorage' --include='*.ts' --include='*.tsx' -A 3 | grep -q 'try\|catch'

# Verify security.input_validation pattern is documented
grep -r 'security\.input_validation.*JSON\.parse' excalidraw-app/data/LocalData.ts
```

**Accept when:**
- All localStorage.getItem() calls are followed by JSON.parse() with try-catch error handling
- Parse errors are logged using console.error or console.warn and tracked in erroredFiles or localStorageQuotaExceededAtom as appropriate
- Storage adapters (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter) implement consistent JSON.parse validation
- No raw localStorage usage exists in LocalData service without JSON.parse wrapping

<enforcement>
Claude Code MUST NOT skip or defer verification. All localStorage deserialization operations MUST include JSON.parse with try-catch blocks and error logging. Violations block CI pipeline and require security review for exceptions.
</enforcement>