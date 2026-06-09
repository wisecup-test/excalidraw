# Standardize JSON Parsing with Error Handling and Logging: Modules Performing Json

These rules are ALWAYS ACTIVE for all JSON parsing operations in data layer modules, collaboration features, storage management, and external API integration code.

### Rules

- **R-JSON-001** SHOULD: Modules performing JSON operations SHOULD import validation utilities from @excalidraw/excalidraw/data/json or equivalent validation libraries.
- **R-JSON-002** MUST: All JSON.parse() calls in data/, collab/, and app-level modules MUST be wrapped in try-catch blocks with error logging.
- **R-JSON-003** MUST: Error logging (console.error or console.warn) MUST be present in 100% of JSON parsing catch blocks.
- **R-JSON-004** SHOULD: JSON parsing error logs SHOULD include contextual information: data source (localStorage key, Firebase path, API endpoint), operation name, and truncated input.
- **R-JSON-005** SHOULD: localStorage operations SHOULD provide fallback values (e.g., JSON.parse(localStorage.getItem(key) || '{}')) to handle missing or corrupt data.
- **R-JSON-006** SHOULD: Binary-to-text conversion using TextDecoder SHOULD be applied before parsing encrypted or encoded payloads from WebSocket or Firebase.
- **R-JSON-007** MAY: A parseJSON utility function MAY be implemented to encapsulate error handling and logging for reuse across modules.

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
- No unwrapped JSON.parse() calls are detected in modified files during CI verification

<enforcement>
Claude Code MUST NOT skip or defer verification. All JSON.parse() operations must be audited for compliance with R-JSON-002 and R-JSON-003. Violations in security-critical modules (authentication, encryption, external API integration) must be escalated to the security team.
</enforcement>