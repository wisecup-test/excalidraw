# Standardize JSON Parsing with Error Handling and Logging: Json Parse Operations

These rules are ALWAYS ACTIVE for all JSON.parse() operations in data layer modules, collaboration and synchronization features, localStorage/sessionStorage/IndexedDB access, Firebase responses, encrypted WebSocket payloads, iframe exports, JWT verification flows, and external API responses.

### Rules

- **R-JSON-001** MUST: All JSON.parse() operations MUST be wrapped in try-catch blocks to handle parsing errors gracefully.

### Verify

```bash
# Count unwrapped JSON.parse() calls (should be 0 or only in exceptions)
grep -rn 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -v 'try' | grep -v 'catch' | wc -l

# Verify error logging in catch blocks
grep -rn 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -A5 'catch' | grep -c 'console\.error\|console\.warn'

# Run ESLint with custom rule (if configured)
eslint excalidraw-app/ --rule 'no-unsafe-json-parse: error' --format compact
```

**Accept when:**
- All JSON.parse() calls in data/, collab/, and app-level modules are wrapped in try-catch blocks
- Error logging (console.error or console.warn) is present in 100% of JSON parsing catch blocks
- Linting rules detect and flag unwrapped JSON.parse() operations in CI pipeline
- Code review checklist includes verification of JSON parsing error handling for new data layer code
- Exceptions (EXC-001: test fixtures with known-good data; EXC-002: pre-validated hot paths) are documented with approval reference

<enforcement>
Claude Code MUST NOT skip or defer verification of JSON.parse() wrapping. All violations in security-critical modules (authentication, encryption, external API integration) MUST be escalated. Existing violations MUST be tracked as technical debt with priority based on data source trust level.
</enforcement>