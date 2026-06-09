# Standardize JSON.parse Error Handling with Console Logging: Json Parse Operations

These rules are ALWAYS ACTIVE for all JSON.parse operations on untrusted input across the application, including localStorage, external APIs, environment variables, encrypted payloads, WebSocket messages, and IndexedDB data.

### Rules

- **R-JSON-001** SHOULD: JSON.parse operations on untrusted input (localStorage, external APIs, user-provided data) SHOULD log at console.error level when parsing fails.
- **R-JSON-002** SHOULD: Wrap JSON.parse operations in try-catch blocks to capture and handle parsing errors.
- **R-JSON-003** SHOULD: Include contextual information in error logs (storage key, endpoint URL, or payload identifier) to aid debugging.
- **R-JSON-004** SHOULD: Sanitize logged JSON content to redact sensitive fields (tokens, passwords, encryption keys) before logging.
- **R-JSON-005** MAY: Create a utility function (e.g., safeJsonParse) that encapsulates try-catch and logging logic for reuse across modules.

### Verify

```bash
# Count unprotected JSON.parse calls (not wrapped in try-catch)
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' | grep -v 'try\|catch' | wc -l

# Count JSON.parse operations with console error/warn logging
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' -A 5 | grep -E 'console\.(error|warn)' | wc -l

# Run ESLint custom rule for unsafe JSON.parse detection
npm run lint -- --rule 'no-unsafe-json-parse'
```

**Accept when:**
- All JSON.parse operations in production code are wrapped in try-catch blocks
- At least 90% of JSON.parse error handlers include console.error or console.warn statements
- Linting passes with no violations of JSON parsing safety rules
- Code review checklist includes verification of JSON.parse error handling

<enforcement>
Claude Code MUST NOT skip or defer verification. Static analysis via ESLint custom rules, code review checklists, and automated grep-based CI checks are mandatory. Violations trigger CI build warnings and code review rejection. Exceptions require developer documentation and tech lead approval, tracked in technical debt register.
</enforcement>