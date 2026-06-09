# Standardize JSON Parsing with Error Handling and Logging: Json Data External

These rules are ALWAYS ACTIVE for all JSON parsing operations in data layer modules, collaboration features, storage management, and external API integration code.

### Rules

- **R-JSON-001** MUST: JSON data from external sources (fetch responses, Firebase, WebSocket) MUST be decoded and validated before parsing.
- **R-JSON-002** MUST: Wrap all JSON.parse() calls in try-catch blocks with console.error() or console.warn() in the catch clause.
- **R-JSON-003** MUST: Include contextual information in error logs: data source (localStorage key, Firebase path, API endpoint), operation name, and truncated input.
- **R-JSON-004** SHOULD: Provide fallback values for localStorage operations (e.g., JSON.parse(localStorage.getItem(key) || '{}')) to handle missing or corrupt data.
- **R-JSON-005** SHOULD: Use TextDecoder for binary-to-text conversion before parsing encrypted or encoded payloads from WebSocket or Firebase.
- **R-JSON-006** MAY: Consider implementing a parseJSON utility function that encapsulates error handling and logging for reuse across modules.

### Verify

```bash
# Detect unwrapped JSON.parse() calls (should return 0)
grep -rn 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -v 'try' | grep -v 'catch' | wc -l

# Count JSON.parse() calls with error handling (should match total parse calls)
grep -rn 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -A5 'catch' | grep -c 'console\.error\|console\.warn'

# Run ESLint with custom rule (if configured)
eslint excalidraw-app/ --rule 'no-unsafe-json-parse: error' --format compact
```

**Accept when:**
- All JSON.parse() calls in data/, collab/, and app-level modules are wrapped in try-catch blocks
- Error logging (console.error or console.warn) is present in 100% of JSON parsing catch blocks
- Linting rules detect and flag unwrapped JSON.parse() operations in CI pipeline
- Code review checklist includes verification of JSON parsing error handling for new data layer code

<enforcement>
Claude Code MUST NOT skip or defer verification. All JSON.parse() operations must be wrapped with error handling and logging before code is approved.
</enforcement>