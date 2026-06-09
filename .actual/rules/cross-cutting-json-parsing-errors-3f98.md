# Validate JSON Input from External Sources Before Parsing: Json Parsing Errors

These rules are ALWAYS ACTIVE for all JSON.parse() operations on data from external sources including localStorage, environment variables, network responses, decoded buffers, and encrypted WebSocket payloads.

### Rules

- **R-JSON-001** MUST: JSON parsing errors MUST be logged using console.error() or console.warn() with sufficient context to identify the source and nature of the failure.
- **R-JSON-002** MUST: All JSON.parse() operations on external data sources (localStorage, environment variables, network responses, decoded/decrypted buffers, WebSocket payloads) MUST be wrapped in try-catch blocks or use safe parsing utilities.
- **R-JSON-003** MUST: Error logging for JSON parsing failures MUST include contextual information such as the data source, the operation being performed, and the specific error message.

### Verify

```bash
# Find unprotected JSON.parse() calls (excluding comments and try blocks)
grep -n 'JSON\.parse' --include='*.ts' --include='*.tsx' -r . | grep -v 'try' | grep -v '//' | head -20

# Count JSON.parse() operations on localStorage
grep -rn 'JSON\.parse.*localStorage' --include='*.ts' --include='*.tsx' . | wc -l

# Count console error/warn logging for JSON operations
grep -rn 'console\.error.*JSON\|console\.warn.*JSON' --include='*.ts' --include='*.tsx' . | wc -l
```

**Accept when:**
- All JSON.parse() operations on external data sources are wrapped in try-catch blocks or use safe parsing utilities
- Grep search for unprotected JSON.parse() calls returns zero results in production code paths
- All parsing error cases include appropriate logging with console.error() or console.warn() and context information
- Code review checklist includes verification of JSON parsing error handling for all new code
- Exceptions are documented with EXC-001 or EXC-002 references and approved by security-aware reviewers

<enforcement>
Claude Code MUST NOT skip or defer verification. All JSON.parse() operations on external data must be validated against these rules before approval.
</enforcement>