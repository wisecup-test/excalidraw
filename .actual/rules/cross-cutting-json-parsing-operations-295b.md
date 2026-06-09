# Validate JSON Input from External Sources Before Parsing in Primary Datastores: Json Parsing Operations

These rules are ALWAYS ACTIVE for all JSON.parse() operations on external data sources including environment variables, HTTP responses, localStorage, WebSocket payloads, and decrypted data in datastore integration code.

### Rules

- **R-JSON-001** MUST: Wrap all JSON.parse() calls on external data sources (environment variables, HTTP responses, localStorage, WebSocket payloads, URL parameters) in try-catch blocks.
- **R-JSON-002** MUST: Log parsing failures with console.error() or console.warn() including context about the data source when JSON.parse() fails.
- **R-JSON-003** SHOULD: Validate the structure of parsed objects before using them in transactions (transaction.set, cache.set, filesMap.set) or state updates.
- **R-JSON-004** SHOULD: Implement fallback behavior (default values, empty state) in error handlers to prevent application initialization failures.
- **R-JSON-005** MUST: Ensure no unprotected JSON.parse() calls exist in datastore integration code (firebase.ts, LocalData.ts, Collab.tsx, index.ts).
- **R-JSON-006** SHOULD: Sanitize logged values to exclude sensitive fields; use structured logging with explicit field inclusion rather than logging entire payloads.

### Verify

```bash
# Find unprotected JSON.parse() calls in datastore integration code
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/data excalidraw-app/collab | grep -v 'try' | wc -l

# Verify Firebase config parsing has try-catch protection
grep -r 'JSON\.parse.*import\.meta\.env' --include='*.ts' --include='*.tsx' -A 5 | grep -c 'catch'

# Verify WebSocket client-broadcast handlers have JSON.parse protection
grep -r 'socket\.on.*client-broadcast' --include='*.tsx' -A 20 | grep 'JSON\.parse' | wc -l
```

**Accept when:**
- All JSON.parse() operations on external data sources (environment variables, HTTP responses, localStorage, WebSocket payloads) are wrapped in try-catch blocks
- Error handlers log parsing failures with context using console.error() or console.warn()
- No unprotected JSON.parse() calls exist in datastore integration code (firebase.ts, LocalData.ts, Collab.tsx, index.ts)
- Parsed objects are validated for required structure before use in transactions or cache updates
- Fallback behavior is implemented for error cases (default values, empty state)
- Sensitive data is not logged in error messages

<enforcement>
Claude Code MUST NOT skip or defer verification of these rules. All JSON.parse() operations on external data must be protected with try-catch blocks and proper error handling before code is accepted.
</enforcement>