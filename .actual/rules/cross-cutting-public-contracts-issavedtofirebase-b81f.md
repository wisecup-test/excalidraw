# Validate JSON Input from External Sources Before Processing: Public Contracts Issavedtofirebase

These rules are ALWAYS ACTIVE for all TypeScript and TSX files that perform JSON.parse operations on data from external sources including localStorage, environment variables, fetch responses, WebSocket payloads, and decrypted/decoded data.

### Rules

- **R-JSON-001** MUST: Wrap all JSON.parse operations on data from localStorage (LSData, savedElements, savedState, browser state versions) in try-catch blocks or use a validated parsing utility function.
- **R-JSON-002** MUST: Wrap all JSON.parse operations on environment variables (import.meta.env.VITE_APP_FIREBASE_CONFIG) in try-catch blocks with validation at application startup, failing fast with clear error messages if configuration is invalid.
- **R-JSON-003** MUST: Wrap all JSON.parse operations on fetch response bodies from external endpoints (BACKEND_V2_GET, Firebase Storage) in try-catch blocks or use a validated parsing utility function.
- **R-JSON-004** MUST: Wrap all JSON.parse operations on decoded/decrypted data (decodedBuffer, decodedData, decodedPayload) in try-catch blocks and verify decryption success before parsing.
- **R-JSON-005** MUST: Wrap all JSON.parse operations on WebSocket message payloads (client-broadcast events) in try-catch blocks and implement type guards for message types (WS_SUBTYPES.INIT, WS_SUBTYPES.UPDATE, etc.).
- **R-JSON-006** SHOULD: Document expected JSON schemas for public API functions that accept or return JSON data (loadFirebaseStorage, saveToFirebase, importFromLocalStorage) and consider adding runtime type checking with TypeScript type guards.
- **R-JSON-007** SHOULD: Create a centralized parseJSON utility function that wraps JSON.parse with try-catch, logging, and optional schema validation: parseJSON(input, { source, schema, fallback }).
- **R-JSON-008** SHOULD: Add monitoring/telemetry for JSON parsing failures to detect potential attacks or data corruption issues in production.
- **R-JSON-009** MAY: Trust JSON.parse operations on data that has been cryptographically signed and signature-verified (e.g., JWT tokens after verification) as an exception to validation requirements, provided the exception is documented in code comments with reference to this ADR.
- **R-JSON-010** MAY: Trust JSON.parse operations in isolated error recovery code paths where failure is explicitly expected and handled, provided the exception is documented in code comments with reference to this ADR.

### Verify

```bash
# Count unprotected JSON.parse calls (without try-catch)
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' | grep -v 'try' | grep -v 'catch' | wc -l

# Check for ESLint violations on unsafe JSON parsing
eslint . --rule '{"no-unsafe-json-parse": "error"}' --ext .ts,.tsx

# Count JSON parsing error handling patterns
grep -r 'console\.error.*JSON' --include='*.ts' --include='*.tsx' | wc -l
```

**Accept when:**
- All JSON.parse operations on external data sources (localStorage, environment variables, fetch responses, WebSocket payloads) are wrapped in try-catch blocks or use a validated parsing utility.
- Grep for unprotected JSON.parse calls returns zero results in production code paths (excluding tests).
- All public API functions that handle JSON data have documented schemas and validation logic.
- Error logging is present for all JSON parsing failures with sufficient context to identify the source.
- ESLint custom rule detects no violations of JSON.parse without surrounding try-catch blocks.
- Code review checklist confirms validation of all external data parsing.
- Security audit of data boundary crossing points (localStorage, fetch, WebSocket handlers) shows no gaps.

<enforcement>
Claude Code MUST NOT skip or defer verification. All JSON.parse operations on external data must be validated before processing. Violations in security-critical paths (authentication, encryption, collaboration) require Security team review and approval.
</enforcement>