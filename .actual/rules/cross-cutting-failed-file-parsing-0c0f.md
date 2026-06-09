# Adopt JSON.parse for Input Validation in Local Storage Operations: Failed File Parsing

These rules are ALWAYS ACTIVE for all LocalData service operations, storage adapter implementations (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter), and file data loading operations that read from localStorage or deserialize persisted application state.

### Rules

- **R-LSV-001** SHOULD: Failed file parsing operations SHOULD update the erroredFiles map to track problematic data.
- **R-LSV-002** MUST: All localStorage.getItem() calls MUST be followed by JSON.parse() with try-catch error handling.
- **R-LSV-003** MUST: Parse errors MUST be logged using console.error or console.warn and tracked in erroredFiles or localStorageQuotaExceededAtom as appropriate.
- **R-LSV-004** MUST: Storage adapters (LibraryIndexedDBAdapter, LibraryLocalStorageMigrationAdapter) MUST implement consistent JSON.parse validation before returning data to consumers.

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
- Failed file parsing operations update the erroredFiles map with the problematic file ID

<enforcement>
Claude Code MUST NOT skip or defer verification. All localStorage deserialization operations MUST conform to these rules. Violations detected by CI pipeline grep checks or code review MUST block merge. Exception requests require architecture review board and security team approval with documented alternative validation approach.
</enforcement>