# Validate JSON Input from External Sources Before Parsing in Primary Datastores: When Parsing Json

These rules are ALWAYS ACTIVE for all JSON.parse() operations on data from external sources including environment variables, HTTP responses, localStorage, WebSocket payloads, and encrypted data streams in datastore integration code.

### Rules

- **R-JSON-001** MUST: Wrap all JSON.parse() calls on external data sources (environment variables, HTTP responses, localStorage, WebSocket payloads, decrypted data) in try-catch blocks.
- **R-JSON-002** MUST: Log parsing failures with console.error() or console.warn() including context about the data source and the error.
- **R-JSON-003** SHOULD: When parsing JSON from encrypted sources (decrypted WebSocket data, encrypted storage), validation SHOULD occur after decryption but before data is committed to cache layers or datastores.
- **R-JSON-004** MUST: Implement fallback behavior in error handlers (e.g., returning default values, empty state, or triggering user notifications) rather than silent failures.
- **R-JSON-005** MUST: For Firebase configuration parsing, validate that required fields exist after parsing before initializing Firebase services.
- **R-JSON-006** MUST: In WebSocket event handlers (socket.on), validate the structure of decrypted JSON payloads before updating cache layers or triggering state updates.
- **R-JSON-007** MAY: Use JSON schema validation libraries (e.g., Zod, Yup, Ajv) for stronger type safety guarantees when migrating to runtime validation.

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
- Fallback behavior is implemented in error handlers to prevent silent failures
- Firebase configuration parsing validates required fields after successful parsing
- WebSocket payload validation occurs before cache layer updates

<enforcement>
Claude Code MUST NOT skip or defer verification. All JSON.parse() operations on external data must be protected with try-catch blocks and appropriate error handling before code is accepted.
</enforcement>