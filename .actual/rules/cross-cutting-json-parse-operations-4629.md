# Standardize JSON.parse Error Handling with Console Logging: Json Parse Operations

These rules are ALWAYS ACTIVE for all JSON.parse operations across the application, including localStorage data, environment variables, configuration, external API responses, encrypted or encoded payloads, WebSocket messages, and IndexedDB data.

### Rules

- **R-JSON-001** MUST: All JSON.parse operations MUST be wrapped in try-catch blocks to handle parsing exceptions.
- **R-JSON-002** MUST: JSON.parse error handlers MUST include console.error or console.warn statements to log parsing failures.
- **R-JSON-003** SHOULD: For localStorage operations, include the storage key in error messages to identify which data is corrupted.
- **R-JSON-004** SHOULD: For external API responses, include the endpoint URL or API identifier in error logs.
- **R-JSON-005** SHOULD: For encrypted payloads, log decryption/parsing failures separately to distinguish encryption vs. JSON issues.
- **R-JSON-006** SHOULD: Implement sanitization that removes sensitive fields (tokens, passwords, keys) before logging JSON content.
- **R-JSON-007** MAY: Create a utility function (e.g., safeJsonParse) that encapsulates try-catch and logging logic for reuse across modules.

### Verify

```bash
# Count unprotected JSON.parse calls (should be 0 or only documented exceptions)
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' | grep -v 'try\|catch' | wc -l

# Count JSON.parse operations with console logging (should match or exceed protected calls)
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' -A 5 | grep -E 'console\.(error|warn)' | wc -l

# Run linting rule for unsafe JSON.parse (if custom rule exists)
npm run lint -- --rule 'no-unsafe-json-parse'
```

**Accept when:**
- All JSON.parse operations in production code are wrapped in try-catch blocks
- At least 90% of JSON.parse error handlers include console.error or console.warn statements
- Linting passes with no violations of JSON parsing safety rules
- Code review checklist includes verification of JSON.parse error handling
- Exceptions are documented in code comments with justification and approved by tech lead

<enforcement>
Claude Code MUST NOT skip or defer verification. All JSON.parse operations discovered during code review or static analysis MUST comply with R-JSON-001 and R-JSON-002 unless explicitly documented as an approved exception (EX-001 or EX-002 from the ADR).
</enforcement>