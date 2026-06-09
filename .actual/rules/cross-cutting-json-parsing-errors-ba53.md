# Validate JSON Input from External Sources Before Parsing: Json Parsing Errors

These rules are ALWAYS ACTIVE for all JSON.parse() operations on data from external sources including localStorage, environment variables, network responses, decoded/decrypted buffers, and WebSocket payloads.

### Rules

- **R-JSON-001** MUST NOT: JSON parsing errors MUST NOT expose sensitive information such as encryption keys, tokens, or internal system details in error messages.
- **R-JSON-002** MUST: All JSON.parse() operations on external data sources (localStorage, environment variables, network responses, decoded/decrypted data, WebSocket payloads) MUST be wrapped in try-catch blocks or use safe parsing utilities.
- **R-JSON-003** MUST: All JSON parsing error cases MUST include appropriate logging with console.error() or console.warn() and contextual information about the data source and operation.
- **R-JSON-004** SHOULD: Create utility functions like safeJsonParse(data, defaultValue) and parseLocalStorage(key, defaultValue) to encapsulate error handling logic and reduce boilerplate.
- **R-JSON-005** SHOULD: Document the expected JSON schema for each parsing operation in code comments to aid future validation efforts.

### Verify

```bash
# Find unprotected JSON.parse() calls (excluding comments and try blocks)
grep -n 'JSON\.parse' --include='*.ts' --include='*.tsx' -r . | grep -v 'try' | grep -v '//' | head -20

# Count localStorage JSON.parse() operations
grep -rn 'JSON\.parse.*localStorage' --include='*.ts' --include='*.tsx' . | wc -l

# Count JSON error logging patterns
grep -rn 'console\.error.*JSON\|console\.warn.*JSON' --include='*.ts' --include='*.tsx' . | wc -l

# Verify all JSON.parse() on external sources are protected
grep -rn 'JSON\.parse' --include='*.ts' --include='*.tsx' . | grep -E '(localStorage|import\.meta\.env|fetch|decrypt|socket)' | grep -v 'try' | wc -l
```

**Accept when:**
- All JSON.parse() operations on external data sources are wrapped in try-catch blocks or use safe parsing utilities
- Grep search for unprotected JSON.parse() calls on external sources returns zero results in production code paths
- All parsing error cases include appropriate logging with console.error() or console.warn() and context information
- Code review checklist includes verification of JSON parsing error handling for all new code
- Error messages do not contain sensitive data such as encryption keys, tokens, or internal system details
- Utility functions for safe JSON parsing are used consistently across the codebase

<enforcement>
Claude Code MUST NOT skip or defer verification of JSON parsing error handling. All JSON.parse() operations on external data sources MUST be protected and MUST NOT expose sensitive information in error messages. Violations in security-sensitive files (firebase.ts, Collab.tsx, encryption/collaboration code) require security team review.
</enforcement>