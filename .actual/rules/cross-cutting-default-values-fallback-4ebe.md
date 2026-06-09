# Validate JSON Input from External Sources Before Processing: Default Values Fallback

These rules are ALWAYS ACTIVE for all TypeScript and TSX files that perform JSON.parse operations on data from external sources including localStorage, environment variables, fetch responses, WebSocket payloads, and decrypted/decoded data.

### Rules

- **R-JSON-001** MUST: Wrap all JSON.parse operations on external data sources (localStorage, environment variables, fetch responses, WebSocket payloads, decrypted data) in try-catch blocks or use a validated parsing utility function.
- **R-JSON-002** SHOULD: Provide default values or fallback behavior when JSON parsing fails (e.g., `localStorage.getItem(key) || defaultValue`).
- **R-JSON-003** MUST: Log JSON parsing failures with sufficient context to identify the source, including the data source type and the attempted parse operation.
- **R-JSON-004** SHOULD: Implement a centralized parseJSON utility function that wraps JSON.parse with try-catch, logging, and optional schema validation: `parseJSON(input, { source, schema, fallback })`.
- **R-JSON-005** MUST: Validate environment variables containing JSON (e.g., VITE_APP_FIREBASE_CONFIG) at application startup and fail fast with clear error messages if configuration is invalid.
- **R-JSON-006** MUST: For WebSocket payloads, ensure decryption success is verified before JSON parsing and implement type guards for message types.
- **R-JSON-007** SHOULD: Document expected JSON schemas for public API functions that handle JSON data (loadFirebaseStorage, saveToFirebase, importFromLocalStorage) and consider adding runtime type checking with TypeScript type guards.
- **R-JSON-008** MAY: Implement ESLint custom rules or static analysis to detect unprotected JSON.parse calls on external data sources.

### Verify

```bash
# Count unprotected JSON.parse operations (should return 0 in production code)
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' src/ | grep -v 'try' | grep -v 'catch' | grep -v 'test' | wc -l

# Check for parseJSON utility usage in external data handling
grep -r 'parseJSON\|JSON\.parse' --include='*.ts' --include='*.tsx' src/ | grep -E '(localStorage|import\.meta\.env|fetch|WebSocket|decrypt)' | wc -l

# Verify error logging around JSON parsing
grep -r 'console\.(error|warn).*JSON\|JSON\.parse.*catch' --include='*.ts' --include='*.tsx' src/ | wc -l

# Check for fallback values in localStorage operations
grep -r 'localStorage\.getItem.*||' --include='*.ts' --include='*.tsx' src/ | wc -l
```

**Accept when:**
- All JSON.parse operations on external data sources (localStorage, environment variables, fetch responses, WebSocket payloads) are wrapped in try-catch blocks or use a validated parsing utility
- Grep for unprotected JSON.parse calls returns zero results in production code paths (excluding tests)
- All public API functions that handle JSON data have documented schemas and validation logic
- Error logging is present for all JSON parsing failures with sufficient context to identify the source
- A centralized parseJSON utility function exists and is used consistently across the codebase
- Environment variable validation occurs at application startup with clear error messages
- WebSocket message handlers include type guards and decryption verification before parsing

<enforcement>
Claude Code MUST NOT skip or defer verification of these rules. All JSON.parse operations on external data must be validated before merging code changes. Security team MUST review violations in security-critical paths (authentication, encryption, collaboration).
</enforcement>