# Validate JSON Input from External Sources Before Processing: Environment Variable Json

These rules are ALWAYS ACTIVE for all TypeScript and TSX files that parse JSON from external sources including localStorage, environment variables (VITE_APP_FIREBASE_CONFIG), fetch responses, WebSocket payloads, and decrypted data.

### Rules

- **R-JSON-001** MUST: Environment variable JSON configurations (e.g., VITE_APP_FIREBASE_CONFIG) MUST be validated at application startup before being used to initialize services.
- **R-JSON-002** MUST: All JSON.parse operations on data from localStorage (LSData, savedElements, savedState, browser state versions) MUST be wrapped in try-catch blocks or use a validated parsing utility.
- **R-JSON-003** MUST: All JSON.parse operations on fetch response bodies from external endpoints (BACKEND_V2_GET, Firebase Storage) MUST be wrapped in try-catch blocks or use a validated parsing utility.
- **R-JSON-004** MUST: All JSON.parse operations on decoded/decrypted data (decodedBuffer, decodedData, decodedPayload) MUST be wrapped in try-catch blocks or use a validated parsing utility.
- **R-JSON-005** MUST: All JSON.parse operations on WebSocket message payloads (client-broadcast events) MUST be wrapped in try-catch blocks or use a validated parsing utility.
- **R-JSON-006** MUST: Public API functions that accept or return JSON data (loadFirebaseStorage, saveToFirebase, importFromLocalStorage) MUST have documented schemas and validation logic.
- **R-JSON-007** MUST: Error logging MUST be present for all JSON parsing failures with sufficient context to identify the source.
- **R-JSON-008** MAY: JSON parsing on data that has been cryptographically signed and signature-verified (e.g., JWT tokens after verification) may omit validation if documented with exception reference.
- **R-JSON-009** MAY: JSON parsing in isolated error recovery code paths where failure is explicitly expected and handled may omit validation if documented with exception reference.

### Verify

```bash
# Count unprotected JSON.parse calls (should return 0 in production code)
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' | grep -v 'try' | grep -v 'catch' | grep -v 'test' | grep -v '.spec' | wc -l

# Check for error logging around JSON parsing
grep -r 'console\.error.*JSON' --include='*.ts' --include='*.tsx' | wc -l

# Verify environment variable validation at startup
grep -r 'VITE_APP_FIREBASE_CONFIG' --include='*.ts' --include='*.tsx' -A 3 | grep -E '(try|catch|validate|schema)' | wc -l
```

**Accept when:**
- All JSON.parse operations on external data sources (localStorage, environment variables, fetch responses, WebSocket payloads) are wrapped in try-catch blocks or use a validated parsing utility
- Grep for unprotected JSON.parse calls returns zero results in production code paths (excluding tests)
- All public API functions that handle JSON data have documented schemas and validation logic
- Error logging is present for all JSON parsing failures with sufficient context to identify the source
- Environment variable JSON configurations are validated at application startup before service initialization
- Exceptions are documented in code comments with reference to this ADR and approval

<enforcement>
Claude Code MUST NOT skip or defer verification of these rules. All JSON.parse operations on external data must be validated before processing. Violations in security-critical paths (authentication, encryption, collaboration) require Security team review.
</enforcement>