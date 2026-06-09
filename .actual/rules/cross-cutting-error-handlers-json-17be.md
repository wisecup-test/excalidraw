# Validate JSON Input from External Sources Before Parsing in Primary Datastores: Error Handlers Json

These rules are ALWAYS ACTIVE for all JSON.parse() operations on data from external sources including environment variables, HTTP responses, localStorage, WebSocket payloads, and decrypted data in datastore integration code.

### Rules

- **R-JSON-001** MUST: Error handlers for JSON parsing failures MUST log the parsing error with context about the data source using console.error() or console.warn() to aid debugging.

### Verify

```bash
# Check for unprotected JSON.parse() calls in datastore code
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/data excalidraw-app/collab | grep -v 'try' | wc -l

# Verify Firebase config parsing has try-catch protection
grep -r 'JSON\.parse.*import\.meta\.env' --include='*.ts' --include='*.tsx' -A 5 | grep -c 'catch'

# Check WebSocket client-broadcast handlers for JSON.parse protection
grep -r 'socket\.on.*client-broadcast' --include='*.tsx' -A 20 | grep 'JSON\.parse' | wc -l
```

**Accept when:**
- All JSON.parse() operations on external data sources (environment variables, HTTP responses, localStorage, WebSocket payloads) are wrapped in try-catch blocks
- Error handlers log parsing failures with context using console.error() or console.warn()
- No unprotected JSON.parse() calls exist in datastore integration code (firebase.ts, LocalData.ts, Collab.tsx, index.ts)
- Error logging includes source context (e.g., data source identifier, configuration name, or event type)

<enforcement>
Claude Code MUST NOT skip or defer verification of this rule. All JSON.parse() calls on external data must be protected with try-catch blocks and include error logging with source context before code is accepted.
</enforcement>