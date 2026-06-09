# Validate JSON Input from External Sources Before Parsing: Json Data Localstorage

These rules are ALWAYS ACTIVE for all JSON.parse() operations on data from external sources including localStorage, environment variables, network responses, decoded/decrypted buffers, and WebSocket payloads.

### Rules

- **R-JSON-001** MUST: Wrap all JSON.parse() operations on external data sources in try-catch blocks with appropriate error handling and logging.
- **R-JSON-002** SHOULD: JSON data from localStorage SHOULD include default values using the OR operator pattern (e.g., `localStorage.getItem(key) || defaultValue`) before parsing.
- **R-JSON-003** MUST: Log all JSON parsing failures with console.error() or console.warn() including contextual information about the data source and expected schema.
- **R-JSON-004** SHOULD: Create and use centralized parsing utility functions like `safeJsonParse(data, defaultValue)` and `parseLocalStorage(key, defaultValue)` to encapsulate error handling logic.
- **R-JSON-005** MUST: Ensure error messages do not leak sensitive information about system internals or data structures; use sanitized messages for user-facing errors.
- **R-JSON-006** MUST: Document the expected JSON schema for each parsing operation in code comments to aid future validation efforts.
- **R-JSON-007** SHOULD: For localStorage operations, use the pattern: `JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue))` to handle both null values and parsing errors.
- **R-JSON-008** MUST: When parsing data from @excalidraw/excalidraw libraries, verify data integrity before parsing and handle decryption failures separately from parsing failures.

### Verify

```bash
# Find unprotected JSON.parse() calls (should return zero in production paths)
grep -n 'JSON\.parse' --include='*.ts' --include='*.tsx' -r . | grep -v 'try' | grep -v '//' | head -20

# Count localStorage JSON.parse() operations
grep -rn 'JSON\.parse.*localStorage' --include='*.ts' --include='*.tsx' . | wc -l

# Verify error logging patterns exist
grep -rn 'console\.error.*JSON\|console\.warn.*JSON' --include='*.ts' --include='*.tsx' . | wc -l

# Review specific files for compliance
grep -n 'JSON\.parse' --include='*.ts' --include='*.tsx' tabSync.ts firebase.ts ExcalidrawPlusIframeExport.tsx index.ts LocalData.ts localStorage.ts Collab.tsx
```

**Accept when:**
- All JSON.parse() operations on external data sources are wrapped in try-catch blocks or use safe parsing utilities
- Grep search for unprotected JSON.parse() calls returns zero results in production code paths
- All parsing error cases include appropriate logging with console.error() or console.warn() and context information
- Code review checklist includes verification of JSON parsing error handling for all new code
- Utility functions like safeJsonParse() and parseLocalStorage() are implemented and used consistently
- Error messages are reviewed to ensure no sensitive data leakage
- Expected JSON schemas are documented in code comments for each parsing operation

<enforcement>
Claude Code MUST NOT skip or defer verification. All JSON.parse() operations on external data sources MUST comply with these rules. Static analysis via ESLint and grep-based CI checks are mandatory. Code review must explicitly verify error handling for all JSON parsing operations. Security team review is required for violations in authentication, encryption, or collaboration code paths.
</enforcement>