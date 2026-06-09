# Validate JSON Input from External Sources Before Processing: Json Parse Operations

These rules are ALWAYS ACTIVE for all TypeScript and TSX files that perform JSON.parse operations on data from external sources including localStorage, environment variables, fetch responses, WebSocket payloads, and decrypted/decoded data.

### Rules

- **R-JSON-001** MUST: All JSON.parse operations on data from external sources (localStorage, environment variables, fetch responses, WebSocket payloads) MUST be wrapped in try-catch blocks with appropriate error handling.
- **R-JSON-002** MUST: JSON.parse operations on localStorage data (LSData, savedElements, savedState, browser state versions) MUST include try-catch blocks and provide fallback values.
- **R-JSON-003** MUST: JSON.parse operations on environment variables (import.meta.env.VITE_APP_FIREBASE_CONFIG) MUST be validated at application startup with fail-fast error messages if configuration is invalid.
- **R-JSON-004** MUST: JSON.parse operations on fetch response bodies from external endpoints (BACKEND_V2_GET, Firebase Storage) MUST be wrapped in try-catch blocks.
- **R-JSON-005** MUST: JSON.parse operations on decoded/decrypted data (decodedBuffer, decodedData, decodedPayload) MUST verify decryption success before parsing and implement type guards for expected message types.
- **R-JSON-006** MUST: JSON.parse operations on WebSocket message payloads (client-broadcast events) MUST be wrapped in try-catch blocks with type guards for WS_SUBTYPES (INIT, UPDATE, etc.).
- **R-JSON-007** MUST: Public API functions that accept or return JSON data (loadFirebaseStorage, saveToFirebase, importFromLocalStorage) MUST have documented schemas and validation logic.
- **R-JSON-008** SHOULD: Implement a centralized parseJSON utility function that wraps JSON.parse with try-catch, logging, and optional schema validation: parseJSON(input, { source, schema, fallback }).
- **R-JSON-009** SHOULD: Add monitoring/telemetry for JSON parsing failures to detect potential attacks or data corruption issues in production.
- **R-JSON-010** MAY: Exception EXC-001 applies when JSON parsing is performed on data that has been cryptographically signed and signature-verified (e.g., JWT tokens after verification).
- **R-JSON-011** MAY: Exception EXC-002 applies when JSON parsing occurs in isolated error recovery code paths where failure is explicitly expected and handled.

### Verify

```bash
# Count unprotected JSON.parse calls (should return 0 in production code)
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' | grep -v 'try' | grep -v 'catch' | grep -v 'test' | wc -l

# Check for error logging around JSON parsing
grep -r 'console\.error.*JSON' --include='*.ts' --include='*.tsx' | wc -l

# Verify try-catch coverage for external data sources
grep -r 'localStorage\.getItem\|import\.meta\.env\|fetch\|WebSocket' --include='*.ts' --include='*.tsx' -A 2 | grep -c 'try'
```

**Accept when:**
- All JSON.parse operations on external data sources (localStorage, environment variables, fetch responses, WebSocket payloads) are wrapped in try-catch blocks or use a validated parsing utility
- Grep for unprotected JSON.parse calls returns zero results in production code paths (excluding tests)
- All public API functions that handle JSON data have documented schemas and validation logic
- Error logging is present for all JSON parsing failures with sufficient context to identify the source
- localStorage operations use fallback values: JSON.parse(localStorage.getItem(key) || defaultValue)
- Environment variable parsing validates at startup with fail-fast behavior
- WebSocket payload parsing includes type guards for expected message types
- Decryption success is verified before JSON parsing on encrypted payloads

<enforcement>
Claude Code MUST NOT skip or defer verification of these rules. All JSON.parse operations on external data must be validated before processing. Violations in security-critical paths (authentication, encryption, collaboration) require Security team review and approval.
</enforcement>