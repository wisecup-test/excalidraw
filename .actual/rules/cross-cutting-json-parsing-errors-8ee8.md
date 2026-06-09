# Standardize JSON.parse Error Handling with Console Logging: Json Parsing Errors

These rules are ALWAYS ACTIVE for all JSON.parse operations across the application, including localStorage data, environment variables, configuration, external API responses, encrypted or encoded payloads, WebSocket messages, and IndexedDB data.

### Rules

- **R-JSON-001** MUST: JSON parsing errors MUST be logged using console.error or console.warn with contextual information about the source and nature of the failure.

### Verify

```bash
# Count unprotected JSON.parse calls (not wrapped in try-catch)
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' | grep -v 'try\|catch' | wc -l

# Count JSON.parse operations with console error/warn logging
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' -A 5 | grep -E 'console\.(error|warn)' | wc -l

# Run linting rule for unsafe JSON parsing
npm run lint -- --rule 'no-unsafe-json-parse'
```

**Accept when:**
- All JSON.parse operations in production code are wrapped in try-catch blocks
- At least 90% of JSON.parse error handlers include console.error or console.warn statements
- Linting passes with no violations of JSON parsing safety rules
- Code review checklist includes verification of JSON.parse error handling

<enforcement>
Clause Code MUST NOT skip or defer verification. All JSON.parse operations must be audited for proper error handling and logging before merge.
</enforcement>