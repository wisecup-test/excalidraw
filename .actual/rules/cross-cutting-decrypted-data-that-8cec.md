# Validate JSON Input from External Sources Before Processing: Decrypted Data That

These rules are ALWAYS ACTIVE for all TypeScript and TSX files that perform JSON.parse operations on data from external sources including localStorage, environment variables, fetch responses, WebSocket payloads, and decrypted data.

### Rules

- **R-JSON-001** MUST: Wrap all JSON.parse operations on data from localStorage in try-catch blocks or use a validated parsing utility function.
- **R-JSON-002** MUST: Wrap all JSON.parse operations on environment variables (import.meta.env values) in try-catch blocks or use a validated parsing utility function.
- **R-JSON-003** MUST: Wrap all JSON.parse operations on fetch response bodies from external endpoints in try-catch blocks or use a validated parsing utility function.
- **R-JSON-004** MUST: Wrap all JSON.parse operations on decoded/decrypted data in try-catch blocks or use a validated parsing utility function, and verify decryption succeeded before parsing.
- **R-JSON-005** MUST: Wrap all JSON.parse operations on WebSocket message payloads in try-catch blocks or use a validated parsing utility function.
- **R-JSON-006** SHOULD: Implement a centralized parseJSON utility function that wraps JSON.parse with try-catch, logging, and optional schema validation.
- **R-JSON-007** SHOULD: Document expected JSON schemas for public API functions that accept or return JSON data.
- **R-JSON-008** SHOULD: Add error logging with sufficient context (source, payload sample, error details) for all JSON parsing failures.
- **R-JSON-009** MAY: Use a JSON parsing library with built-in validation (e.g., zod, yup, ajv) for type-safe parsing with schema validation.

### Verify

```bash
# Count unprotected JSON.parse calls (should return 0 in production code)
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' src/ | grep -v 'try' | grep -v 'catch' | grep -v 'test' | grep -v '.spec' | wc -l

# List all JSON.parse operations for manual review
grep -rn 'JSON\.parse' --include='*.ts' --include='*.tsx' src/ | grep -v 'test' | grep -v '.spec'

# Check for error handling around JSON parsing
grep -rn 'console\.error.*JSON\|console\.warn.*JSON' --include='*.ts' --include='*.tsx' src/ | wc -l

# Verify parseJSON utility exists and is used
grep -r 'parseJSON\|JSON\.parse' --include='*.ts' --include='*.tsx' src/ | grep -c 'parseJSON'
```

**Accept when:**
- All JSON.parse operations on external data sources (localStorage, environment variables, fetch responses, WebSocket payloads, decrypted data) are wrapped in try-catch blocks or use a validated parsing utility
- Grep for unprotected JSON.parse calls in production code paths returns zero results (excluding tests and fixtures)
- All public API functions that handle JSON data have documented schemas and validation logic
- Error logging is present for all JSON parsing failures with sufficient context to identify the source and payload
- A centralized parseJSON utility function exists and is used consistently across the codebase
- Decryption success is verified before JSON parsing operations on decrypted data

<enforcement>
Claude Code MUST NOT skip or defer verification of these rules. All JSON.parse operations on external data must be protected before code is considered compliant. Security team MUST review violations in authentication, encryption, and collaboration code paths.
</enforcement>