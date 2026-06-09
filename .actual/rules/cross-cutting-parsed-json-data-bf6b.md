# Validate JSON Input from External Sources Before Processing: Parsed Json Data

These rules are ALWAYS ACTIVE for all TypeScript and TSX files that perform JSON.parse operations on data from untrusted external sources including localStorage, environment variables, fetch responses, WebSocket payloads, and decrypted/decoded data.

### Rules

- **R-JSON-001** MUST: Parsed JSON data from untrusted sources MUST be validated against expected schema before being used in application logic.
- **R-JSON-002** MUST: All JSON.parse operations on data from localStorage (LSData, savedElements, savedState, browser state versions) MUST be wrapped in try-catch blocks or use a validated parsing utility.
- **R-JSON-003** MUST: All JSON.parse operations on environment variables (import.meta.env.VITE_APP_FIREBASE_CONFIG) MUST be validated at application startup and fail fast with clear error messages if configuration is invalid.
- **R-JSON-004** MUST: All JSON.parse operations on fetch response bodies from external endpoints (BACKEND_V2_GET, Firebase Storage) MUST be wrapped in try-catch blocks with error logging.
- **R-JSON-005** MUST: All JSON.parse operations on decoded/decrypted data (decodedBuffer, decodedData, decodedPayload) MUST verify decryption success before parsing and implement type guards for expected message types.
- **R-JSON-006** MUST: All JSON.parse operations on WebSocket message payloads (client-broadcast events) MUST be wrapped in try-catch blocks with validation of message type and structure.
- **R-JSON-007** MUST: Public API functions that accept or return JSON data (loadFirebaseStorage, saveToFirebase, importFromLocalStorage) MUST have documented schemas and validation logic.
- **R-JSON-008** MUST: Error logging MUST be present for all JSON parsing failures with sufficient context to identify the source and data origin.
- **R-JSON-009** MAY: JSON.parse operations on data that has been cryptographically signed and signature-verified (e.g., JWT tokens after verification) MAY be exempted from validation with documented justification.
- **R-JSON-010** MAY: JSON.parse operations in isolated error recovery code paths where failure is explicitly expected and handled MAY be exempted with documented justification.

### Verify

```bash
# Count unprotected JSON.parse calls (should return 0 in production code)
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' src/ | grep -v 'try' | grep -v 'catch' | grep -v test | wc -l

# Check for JSON parsing without error handling
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' src/ | grep -v 'try-catch' | grep -v 'parseJSON' | wc -l

# Verify error logging exists for JSON operations
grep -r 'console\.error.*JSON\|console\.warn.*JSON' --include='*.ts' --include='*.tsx' src/ | wc -l

# List all JSON.parse operations for manual review
grep -rn 'JSON\.parse' --include='*.ts' --include='*.tsx' src/ | head -20
```

**Accept when:**
- All JSON.parse operations on external data sources (localStorage, environment variables, fetch responses, WebSocket payloads) are wrapped in try-catch blocks or use a validated parsing utility
- Grep for unprotected JSON.parse calls returns zero results in production code paths (excluding tests)
- All public API functions that handle JSON data have documented schemas and validation logic
- Error logging is present for all JSON parsing failures with sufficient context to identify the source
- Exceptions are documented in code comments with reference to this rule and approval rationale

<enforcement>
Claude Code MUST NOT skip or defer verification of JSON parsing safety. All JSON.parse operations on external data must be validated before use. Violations in security-critical paths (authentication, encryption, collaboration) require security team review.
</enforcement>