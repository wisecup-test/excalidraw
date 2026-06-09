# Standardize JSON Parsing with Error Handling and Logging: Json Parsing Operations

These rules are ALWAYS ACTIVE for all JSON parsing operations in data layer modules, collaboration and synchronization features, localStorage/sessionStorage/IndexedDB access, Firebase responses, encrypted WebSocket payloads, iframe exports, JWT verification flows, and external API responses.

### Rules

- **R-JSON-001** MUST: Wrap all `JSON.parse()` calls in try-catch blocks with `console.error()` or `console.warn()` in the catch clause.
- **R-JSON-002** MUST: Include contextual information in error logs: data source (localStorage key, Firebase path, API endpoint), operation name, and truncated input.
- **R-JSON-003** SHOULD: Provide fallback values for localStorage operations (e.g., `JSON.parse(localStorage.getItem(key) || '{}')`) to handle missing or corrupt data.
- **R-JSON-004** MAY: Use TextDecoder for binary-to-text conversion before parsing when handling encrypted or encoded payloads from WebSocket or Firebase.
- **R-JSON-005** SHOULD: Import validation utilities from `@excalidraw/excalidraw/data/json` for post-parse structure validation.
- **R-JSON-006** SHOULD: Consider implementing a `parseJSON` utility function that encapsulates error handling and logging for reuse across modules.

### Verify

```bash
# Detect unwrapped JSON.parse() calls without try-catch
grep -rn 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -v 'try' | grep -v 'catch' | wc -l

# Count JSON.parse() calls with error logging in catch blocks
grep -rn 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -A5 'catch' | grep -c 'console\.error\|console\.warn'

# Run ESLint with custom rule for unsafe JSON parsing
eslint excalidraw-app/ --rule 'no-unsafe-json-parse: error' --format compact
```

**Accept when:**
- All `JSON.parse()` calls in data/, collab/, and app-level modules are wrapped in try-catch blocks
- Error logging (`console.error` or `console.warn`) is present in 100% of JSON parsing catch blocks
- Linting rules detect and flag unwrapped `JSON.parse()` operations in CI pipeline
- Code review checklist includes verification of JSON parsing error handling for new data layer code

<enforcement>
Claude Code MUST NOT skip or defer verification. All JSON parsing operations must comply with R-JSON-001 and R-JSON-002 before code is considered complete. Violations in security-critical modules (authentication, encryption, external API integration) must be escalated to the security team.
</enforcement>