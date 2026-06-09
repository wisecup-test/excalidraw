# Validate JSON Input from External Sources Before Parsing: Applications Implement Centralized

These rules are ALWAYS ACTIVE for all TypeScript and TSX files that parse JSON from external sources including localStorage, environment variables, network responses, encrypted payloads, and WebSocket messages.

### Rules

- **R-JSON-001** MUST: Wrap all JSON.parse() operations on external data sources (localStorage, environment variables, network responses, decoded/decrypted buffers, WebSocket payloads) in try-catch blocks with appropriate error handling.
- **R-JSON-002** MUST: Log all JSON parsing failures using console.error() or console.warn() with contextual information about the data source and operation.
- **R-JSON-003** MUST: Provide sensible fallback values or graceful degradation when JSON parsing fails, rather than allowing exceptions to propagate uncaught.
- **R-JSON-004** SHOULD: Implement centralized JSON parsing utility functions (e.g., safeJsonParse(), parseLocalStorage()) to encapsulate error handling logic and reduce boilerplate.
- **R-JSON-005** MUST: Ensure error messages do not leak sensitive information about system internals, data structures, or configuration details.
- **R-JSON-006** MAY: Document expected JSON schema for each parsing operation in code comments to aid future validation efforts and type safety.
- **R-JSON-007** MUST: Document exceptions to this rule (EXC-001 for same-module trusted data, EXC-002 for upstream validation) in code comments with explicit justification.

### Verify

```bash
# Find unprotected JSON.parse() calls (should return zero results in production paths)
grep -n 'JSON\.parse' --include='*.ts' --include='*.tsx' -r . | grep -v 'try' | grep -v '//' | head -20

# Count localStorage JSON.parse() operations
grep -rn 'JSON\.parse.*localStorage' --include='*.ts' --include='*.tsx' . | wc -l

# Verify error logging around JSON operations
grep -rn 'console\.error.*JSON\|console\.warn.*JSON' --include='*.ts' --include='*.tsx' . | wc -l

# Check for safe parsing utility usage
grep -rn 'safeJsonParse\|parseLocalStorage' --include='*.ts' --include='*.tsx' . | wc -l
```

**Accept when:**
- All JSON.parse() operations on external data sources are wrapped in try-catch blocks or use safe parsing utilities
- Grep search for unprotected JSON.parse() calls returns zero results in production code paths
- All parsing error cases include appropriate logging with console.error() or console.warn() and context information
- Code review checklist includes verification of JSON parsing error handling for all new code
- Error messages do not contain sensitive data or system internals
- Exceptions are documented in code comments with EXC-001 or EXC-002 reference and justification

<enforcement>
Claude Code MUST NOT skip or defer verification. All JSON.parse() operations on external data must be validated before accepting code changes. Static analysis and code review are mandatory enforcement points.
</enforcement>