# Validate JSON Input from External Sources Before Processing: Json Parsing Not

These rules are ALWAYS ACTIVE for all TypeScript and TSX files that perform JSON.parse operations on data from external sources including localStorage, environment variables, fetch responses, decoded/decrypted payloads, and WebSocket messages.

### Rules

- **R-JSON-001** MUST NOT: JSON parsing MUST NOT be performed on raw external input without error handling, even for data from seemingly trusted sources like localStorage.
- **R-JSON-002** MUST: All JSON.parse operations on data from localStorage (LSData, savedElements, savedState, browser state versions) MUST be wrapped in try-catch blocks or use a validated parsing utility.
- **R-JSON-003** MUST: All JSON.parse operations on environment variables (import.meta.env.VITE_APP_FIREBASE_CONFIG) MUST be validated at application startup and fail fast with clear error messages if configuration is invalid.
- **R-JSON-004** MUST: All JSON.parse operations on fetch response bodies from external endpoints (BACKEND_V2_GET, Firebase Storage) MUST be wrapped in try-catch blocks with error logging.
- **R-JSON-005** MUST: All JSON.parse operations on decoded/decrypted data (decodedBuffer, decodedData, decodedPayload) MUST verify decryption success before parsing and implement type guards for expected message types.
- **R-JSON-006** MUST: All JSON.parse operations on WebSocket message payloads (client-broadcast events) MUST be wrapped in try-catch blocks with source context in error logs.
- **R-JSON-007** MUST: Public API functions that accept or return JSON data (loadFirebaseStorage, saveToFirebase, importFromLocalStorage) MUST have documented schemas and validation logic.
- **R-JSON-008** SHOULD: Use a centralized parseJSON utility function that wraps JSON.parse with try-catch, logging, and optional schema validation: parseJSON(input, { source, schema, fallback }).
- **R-JSON-009** SHOULD: Provide fallback values for localStorage operations using the pattern: JSON.parse(localStorage.getItem(key) || defaultValue).
- **R-JSON-010** SHOULD: Add monitoring/telemetry for JSON parsing failures to detect potential attacks or data corruption issues in production.

### Verify

```bash
# Count unprotected JSON.parse calls (should return 0 in production code)
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' | grep -v 'try' | grep -v 'catch' | grep -v 'test' | grep -v '.spec' | wc -l

# Check for error logging around JSON parsing
grep -r 'console\.error.*JSON' --include='*.ts' --include='*.tsx' | wc -l

# Verify try-catch coverage for external data sources
grep -r 'localStorage\.getItem\|import\.meta\.env\|fetch.*JSON\.parse\|WebSocket' --include='*.ts' --include='*.tsx' -A 2 | grep -c 'try'
```

**Accept when:**
- All JSON.parse operations on external data sources (localStorage, environment variables, fetch responses, WebSocket payloads) are wrapped in try-catch blocks or use a validated parsing utility
- Grep for unprotected JSON.parse calls returns zero results in production code paths (excluding tests)
- All public API functions that handle JSON data have documented schemas and validation logic
- Error logging is present for all JSON parsing failures with sufficient context to identify the source
- Environment variable validation occurs at application startup with fail-fast behavior
- WebSocket message parsing includes type guards for expected message types
- Decryption success is verified before JSON parsing in encryption workflows

<enforcement>
Claude Code MUST NOT skip or defer verification of these rules. All JSON.parse operations on external data must be validated before merging code. Security team MUST review violations in security-critical paths (authentication, encryption, collaboration). Exceptions require documentation with ADR reference and approval.
</enforcement>