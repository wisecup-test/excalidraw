# Standardize JSON Parsing with Error Handling and Logging: Json Parsing Errors

These rules are ALWAYS ACTIVE for all JSON.parse() operations in data layer modules, collaboration and synchronization features, localStorage/sessionStorage/IndexedDB access, Firebase responses, encrypted WebSocket payloads, iframe exports, JWT verification flows, and external API responses.

### Rules

- **R-JSON-001** MUST: JSON parsing errors MUST be logged using console.error() or console.warn() with contextual information about the data source and operation.

### Verify

```bash
# Detect unwrapped JSON.parse() calls (should return 0 for compliance)
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

<enforcement>
Claude Code MUST NOT skip or defer verification. All JSON.parse() operations must be wrapped with error handling and logging before code is considered compliant.
</enforcement>