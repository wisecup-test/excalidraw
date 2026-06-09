# Standardize JSON.parse Error Handling with Console Logging: Json Parse Operations

These rules are ALWAYS ACTIVE for all JSON.parse operations on configuration data, localStorage, environment variables, external API responses, encrypted or encoded payloads, WebSocket messages, and IndexedDB data across the application.

### Rules

- **R-JSON-001** SHOULD: JSON.parse operations on configuration data SHOULD log at console.warn level to distinguish from runtime errors.

### Verify

```bash
# Count unprotected JSON.parse calls (not wrapped in try-catch)
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' | grep -v 'try\|catch' | wc -l

# Count JSON.parse operations with console logging
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' -A 5 | grep -E 'console\.(error|warn)' | wc -l

# Run linting rule for unsafe JSON.parse
npm run lint -- --rule 'no-unsafe-json-parse'
```

**Accept when:**
- All JSON.parse operations in production code are wrapped in try-catch blocks
- At least 90% of JSON.parse error handlers include console.error or console.warn statements
- Linting passes with no violations of JSON parsing safety rules
- Code review checklist includes verification of JSON.parse error handling

<enforcement>
Claude Code MUST NOT skip or defer verification. All JSON.parse operations must be wrapped in try-catch with appropriate console logging before code is accepted.
</enforcement>