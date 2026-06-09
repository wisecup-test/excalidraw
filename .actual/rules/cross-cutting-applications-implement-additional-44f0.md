# Standardize JSON.parse Error Handling with Console Logging: Applications Implement Additional

These rules are ALWAYS ACTIVE for all JSON.parse operations across localStorage, environment variables, external API responses, encrypted/encoded payloads, WebSocket messages, and IndexedDB data in production code.

### Rules

- **R-JSON-001** MUST: Wrap all JSON.parse operations in try-catch blocks to prevent unhandled exceptions.
- **R-JSON-002** MUST: Log JSON.parse errors using console.error or console.warn to create an audit trail for debugging and security analysis.
- **R-JSON-003** SHOULD: Include contextual information in error logs (storage key, endpoint URL, payload identifier) to identify the source of corrupted or malformed data.
- **R-JSON-004** SHOULD: Implement a sanitization function that redacts sensitive fields (tokens, passwords, encryption keys) before logging JSON content.
- **R-JSON-005** MAY: Applications MAY implement additional error tracking (e.g., error monitoring services) alongside console logging for enhanced observability.
- **R-JSON-006** MUST NOT: Apply this rule to performance-critical hot paths where JSON structure is guaranteed valid by prior validation (exception EX-001).
- **R-JSON-007** MUST NOT: Apply this rule to parsing operations within error recovery handlers where logging would create noise (exception EX-002).

### Verify

```bash
# Count unprotected JSON.parse calls (not wrapped in try-catch)
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' | grep -v 'try\|catch' | wc -l

# Count JSON.parse operations with console logging
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' -A 5 | grep -E 'console\.(error|warn)' | wc -l

# Run custom linting rule for unsafe JSON.parse
npm run lint -- --rule 'no-unsafe-json-parse'
```

**Accept when:**
- All JSON.parse operations in production code are wrapped in try-catch blocks
- At least 90% of JSON.parse error handlers include console.error or console.warn statements
- Linting passes with no violations of JSON parsing safety rules
- Code review checklist includes verification of JSON.parse error handling
- Sensitive data sanitization is implemented for logged JSON content

<enforcement>
Claude Code MUST NOT skip or defer verification. Static analysis via ESLint custom rules, code review checklists, and automated grep-based CI checks are mandatory. Violations result in CI build warnings, code review rejection, and technical debt tracking. Exceptions require developer documentation and tech lead approval.
</enforcement>