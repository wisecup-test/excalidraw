# Validate JSON Input from External Sources Before Parsing: Json Parse Operations

These rules are ALWAYS ACTIVE for all TypeScript and TSX files that perform JSON.parse() operations on data from external sources including localStorage, environment variables, network responses, decoded buffers, decrypted payloads, and user input.

### Rules

- **R-JSON-001** MUST: All JSON.parse() operations on data from external sources (localStorage, network responses, environment variables, user input, decoded/decrypted buffers, WebSocket payloads) MUST be wrapped in try-catch blocks with appropriate error handling.

- **R-JSON-002** MUST: All JSON parsing error cases MUST include appropriate logging with console.error() or console.warn() and contextual information about the data source and expected format.

- **R-JSON-003** SHOULD: Create and use centralized parsing utility functions like safeJsonParse(data, defaultValue) and parseLocalStorage(key, defaultValue) to encapsulate error handling logic and reduce boilerplate.

- **R-JSON-004** SHOULD: Document the expected JSON schema for each parsing operation in code comments to aid future validation efforts and debugging.

- **R-JSON-005** MUST: Error messages MUST NOT include sensitive data about system internals, data structures, or user information; use sanitized error messages for user-facing errors while keeping detailed logs for internal debugging.

### Verify

```bash
# Find unprotected JSON.parse() calls on external data sources
grep -n 'JSON\.parse' --include='*.ts' --include='*.tsx' -r . | grep -v 'try' | grep -v '//' | head -20

# Count JSON.parse() operations on localStorage
grep -rn 'JSON\.parse.*localStorage' --include='*.ts' --include='*.tsx' . | wc -l

# Count JSON-related error logging
grep -rn 'console\.error.*JSON\|console\.warn.*JSON' --include='*.ts' --include='*.tsx' . | wc -l

# Verify try-catch wrapping around JSON.parse in critical files
grep -B2 -A2 'JSON\.parse' firebase.ts Collab.tsx ExcalidrawPlusIframeExport.tsx | grep -E '(try|catch)'
```

**Accept when:**
- All JSON.parse() operations on external data sources are wrapped in try-catch blocks or use safe parsing utilities
- Grep search for unprotected JSON.parse() calls returns zero results in production code paths
- All parsing error cases include appropriate logging with console.error() or console.warn() and context information
- Error messages do not expose sensitive system internals or user data
- Code review checklist includes verification of JSON parsing error handling for all new code
- Utility functions like safeJsonParse() are used consistently across the codebase

<enforcement>
Claude Code MUST NOT skip or defer verification of JSON.parse() operations. All external data sources MUST be protected with try-catch blocks. Violations in security-sensitive files (firebase.ts, Collab.tsx, authentication paths) require security team review.
</enforcement>