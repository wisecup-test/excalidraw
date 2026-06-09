# Validate JSON Input from External Sources Before Processing: Json Parsing Errors

These rules are ALWAYS ACTIVE for all TypeScript and TSX files that perform JSON.parse operations on data from external sources including localStorage, environment variables, fetch responses, decoded/decrypted payloads, and WebSocket messages.

### Rules

- **R-JSON-001** MUST: JSON parsing errors MUST be logged using console.error or console.warn with sufficient context to identify the source and nature of the invalid data.
- **R-JSON-002** MUST: All JSON.parse operations on data from localStorage (LSData, savedElements, savedState, browser state versions) MUST be wrapped in try-catch blocks or use a validated parsing utility.
- **R-JSON-003** MUST: All JSON.parse operations on environment variables (import.meta.env.VITE_APP_FIREBASE_CONFIG) MUST be wrapped in try-catch blocks or use a validated parsing utility.
- **R-JSON-004** MUST: All JSON.parse operations on fetch response bodies from external endpoints (BACKEND_V2_GET, Firebase Storage) MUST be wrapped in try-catch blocks or use a validated parsing utility.
- **R-JSON-005** MUST: All JSON.parse operations on decoded/decrypted data (decodedBuffer, decodedData, decodedPayload) MUST be wrapped in try-catch blocks or use a validated parsing utility.
- **R-JSON-006** MUST: All JSON.parse operations on WebSocket message payloads (client-broadcast events) MUST be wrapped in try-catch blocks or use a validated parsing utility.
- **R-JSON-007** MUST: Public API functions that accept or return JSON data (loadFirebaseStorage, saveToFirebase, importFromLocalStorage) MUST include validation logic and error handling for JSON parsing failures.
- **R-JSON-008** SHOULD: A centralized parseJSON utility function SHOULD be created that wraps JSON.parse with try-catch, logging, and optional schema validation: parseJSON(input, { source, schema, fallback }).

### Verify

```bash
# Count unprotected JSON.parse calls (should return 0 in production code)
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' | grep -v 'try' | grep -v 'catch' | grep -v 'test' | grep -v '.spec' | wc -l

# Verify error logging is present for JSON parsing failures
grep -r 'console\.error.*JSON\|console\.warn.*JSON' --include='*.ts' --include='*.tsx' | wc -l

# Check for parseJSON utility function usage
grep -r 'parseJSON' --include='*.ts' --include='*.tsx' | wc -l
```

**Accept when:**
- All JSON.parse operations on external data sources (localStorage, environment variables, fetch responses, WebSocket payloads) are wrapped in try-catch blocks or use a validated parsing utility
- Grep for unprotected JSON.parse calls returns zero results in production code paths (excluding tests and fixtures)
- All public API functions that handle JSON data have documented schemas and validation logic
- Error logging is present for all JSON parsing failures with sufficient context to identify the source
- A centralized parseJSON utility function exists and is used consistently across the codebase

<enforcement>
Claude Code MUST NOT skip or defer verification of these rules. All JSON.parse operations on external data must be validated and logged. Violations in security-critical paths (authentication, encryption, collaboration) require Security team review and approval.
</enforcement>