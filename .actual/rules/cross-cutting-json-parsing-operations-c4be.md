# Standardize JSON Parsing with Error Handling and Logging: Json Parsing Operations

These rules are ALWAYS ACTIVE for all JSON parsing operations on untrusted input sources including localStorage, sessionStorage, IndexedDB, Firebase responses, external API responses, and encrypted WebSocket payloads across data layer modules, collaboration features, and synchronization code.

### Rules

- **R-JSON-001** MUST: Wrap all JSON.parse() operations on untrusted input (localStorage, external APIs, WebSocket data) in try-catch blocks with error logging.
- **R-JSON-002** MUST: Validate the parsed structure before use in downstream operations.
- **R-JSON-003** MUST: Include console.error() or console.warn() in catch blocks with contextual information (data source, operation name, truncated input).
- **R-JSON-004** MUST: Provide fallback values for localStorage operations (e.g., JSON.parse(localStorage.getItem(key) || '{}')).
- **R-JSON-005** SHOULD: Use TextDecoder for binary-to-text conversion before parsing encrypted or encoded payloads from WebSocket or Firebase.
- **R-JSON-006** SHOULD: Import validation utilities from @excalidraw/excalidraw/data/json for post-parse structure validation.
- **R-JSON-007** MAY: Implement a parseJSON utility function that encapsulates error handling and logging for reuse across modules.

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
- All JSON.parse() calls in data/, collab/, and app-level modules are wrapped in try-catch blocks
- Error logging (console.error or console.warn) is present in 100% of JSON parsing catch blocks
- Linting rules detect and flag unwrapped JSON.parse() operations in CI pipeline
- Code review checklist includes verification of JSON parsing error handling for new data layer code
- No unwrapped JSON.parse() calls remain in security-critical modules (authentication, encryption, external API integration)

<enforcement>
Claude Code MUST NOT skip or defer verification. All JSON.parse() operations on untrusted input MUST be wrapped with error handling and logging before code is considered compliant. Violations in security-critical modules block merge and require security team notification.
</enforcement>