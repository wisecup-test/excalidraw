# Standardize JSON Parsing with Error Handling and Logging: Error Messages Include

These rules are ALWAYS ACTIVE for all JSON parsing operations in data layer modules, collaboration features, storage management, and external API integration code.

### Rules

- **R-JSON-001** SHOULD: Error messages SHOULD include the raw input value (truncated if necessary) to aid debugging while avoiding sensitive data exposure.

### Verify

```bash
# Detect unwrapped JSON.parse() calls (should return 0 for full compliance)
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
- Error messages include truncated raw input values without exposing sensitive data

<enforcement>
Claude Code MUST NOT skip or defer verification of JSON parsing error handling. All JSON.parse() operations must include try-catch blocks with error logging that includes truncated input values for debugging purposes.
</enforcement>