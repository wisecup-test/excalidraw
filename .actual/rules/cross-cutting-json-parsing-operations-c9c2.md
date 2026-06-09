# Validate JSON Input from External Sources Before Parsing: Json Parsing Operations

These rules are ALWAYS ACTIVE for all JSON.parse() operations on data from external sources including localStorage, environment variables, network responses, decoded/decrypted buffers, and WebSocket payloads.

### Rules

- **R-JSON-001** MUST: Wrap all JSON.parse() operations on external data sources in try-catch blocks with appropriate error handling.
- **R-JSON-002** MUST: Log all JSON parsing failures with console.error() or console.warn() including contextual information about the data source.
- **R-JSON-003** SHOULD: Verify data integrity before attempting to parse encrypted or encoded data.
- **R-JSON-004** SHOULD: Use safe parsing utility functions like safeJsonParse(data, defaultValue) to encapsulate error handling logic and reduce boilerplate.
- **R-JSON-005** MUST: Ensure error messages do not leak sensitive information about system internals or data structures.
- **R-JSON-006** SHOULD: Document the expected JSON schema for each parsing operation in code comments to aid future validation efforts.

### Verify

```bash
# Find unprotected JSON.parse() calls (should return zero results in production code)
grep -n 'JSON\.parse' --include='*.ts' --include='*.tsx' -r . | grep -v 'try' | grep -v '//' | head -20

# Count localStorage JSON parsing operations
grep -rn 'JSON\.parse.*localStorage' --include='*.ts' --include='*.tsx' . | wc -l

# Verify error logging around JSON parsing
grep -rn 'console\.error.*JSON\|console\.warn.*JSON' --include='*.ts' --include='*.tsx' . | wc -l

# Check for safe parsing utility usage
grep -rn 'safeJsonParse\|parseLocalStorage' --include='*.ts' --include='*.tsx' . | wc -l
```

**Accept when:**
- All JSON.parse() operations on external data sources are wrapped in try-catch blocks or use safe parsing utilities
- Grep search for unprotected JSON.parse() calls returns zero results in production code paths
- All parsing error cases include appropriate logging with console.error() or console.warn() and context information
- Code review checklist includes verification of JSON parsing error handling for all new code
- Error messages are sanitized and do not expose sensitive system information
- Utility functions like safeJsonParse() are used consistently across the codebase

<enforcement>
Claude Code MUST NOT skip or defer verification of JSON parsing operations. All JSON.parse() calls on external data must be validated before parsing. Violations require explicit security team approval with documented justification.
</enforcement>