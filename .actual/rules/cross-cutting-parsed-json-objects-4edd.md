# Validate JSON Input from External Sources Before Parsing: Parsed Json Objects

These rules are ALWAYS ACTIVE for all JSON.parse() operations on data from external sources including localStorage, environment variables, network responses, decoded/decrypted buffers, and WebSocket payloads.

### Rules

- **R-JSON-001** MUST: Wrap all JSON.parse() operations on external data sources in try-catch blocks with appropriate error handling.
- **R-JSON-002** MUST: Log all JSON parsing failures with console.error() or console.warn() including contextual information about the data source.
- **R-JSON-003** SHOULD: Validate parsed JSON objects against expected schema or structure before use in application logic.
- **R-JSON-004** SHOULD: Use safe parsing utility functions like safeJsonParse(data, defaultValue) to encapsulate error handling logic and reduce boilerplate.
- **R-JSON-005** MUST: Never expose sensitive system internals or data structures in error messages; use sanitized error messages for user-facing errors.
- **R-JSON-006** SHOULD: Document the expected JSON schema for each parsing operation in code comments to aid future validation efforts.
- **R-JSON-007** MAY: Apply exceptions (EXC-001: same-module trusted data, EXC-002: upstream validation) only with documented justification and code review approval.

### Verify

```bash
# Find unprotected JSON.parse() calls (should return zero in production paths)
grep -n 'JSON\.parse' --include='*.ts' --include='*.tsx' -r . | grep -v 'try' | grep -v '//' | head -20

# Count localStorage JSON.parse() operations
grep -rn 'JSON\.parse.*localStorage' --include='*.ts' --include='*.tsx' . | wc -l

# Verify error logging around JSON operations
grep -rn 'console\.error.*JSON\|console\.warn.*JSON' --include='*.ts' --include='*.tsx' . | wc -l
```

**Accept when:**
- All JSON.parse() operations on external data sources are wrapped in try-catch blocks or use safe parsing utilities
- Grep search for unprotected JSON.parse() calls returns zero results in production code paths
- All parsing error cases include appropriate logging with console.error() or console.warn() and context information
- Code review checklist includes verification of JSON parsing error handling for all new code
- Error messages do not leak sensitive information about system internals or data structures
- Expected JSON schemas are documented in code comments for each parsing operation
- Any exceptions are documented with EXC-001 or EXC-002 reference and approved by security-aware reviewer

<enforcement>
Claude Code MUST NOT skip or defer verification of JSON parsing safety. All JSON.parse() operations on external data must be validated before merging. Static analysis and code review are mandatory.
</enforcement>