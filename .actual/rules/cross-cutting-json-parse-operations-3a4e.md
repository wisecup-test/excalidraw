# Validate JSON Input from External Sources Before Parsing in Primary Datastores: Json Parse Operations

These rules are ALWAYS ACTIVE for all JSON.parse() operations on data from external sources including environment variables, HTTP responses, localStorage, WebSocket payloads, and decrypted data in datastore integration code.

### Rules

- **R-JSON-001** MUST: All JSON.parse() operations on data from external sources (environment variables, HTTP responses, localStorage, WebSocket payloads) MUST be wrapped in try-catch blocks with explicit error handling.
- **R-JSON-002** MUST: Error handlers MUST log parsing failures with context using console.error() or console.warn(), including information about the data source.
- **R-JSON-003** MUST: No unprotected JSON.parse() calls SHALL exist in datastore integration code (firebase.ts, LocalData.ts, Collab.tsx, index.ts).
- **R-JSON-004** SHOULD: For Firebase configuration parsing, validate that required fields exist after parsing before initializing Firebase services.
- **R-JSON-005** SHOULD: In WebSocket event handlers (socket.on), validate the structure of decrypted JSON payloads before updating cache layers or triggering state updates.
- **R-JSON-006** SHOULD: For localStorage data (LSData), implement fallback to empty/default state when JSON.parse() fails to prevent application initialization failures.
- **R-JSON-007** MAY: Exceptions to unprotected JSON.parse() may be granted for hardcoded string literals or trusted internal data with explicit code comments justifying the exception.

### Verify

```bash
# Find unprotected JSON.parse() calls in data and collab directories
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
- Firebase configuration parsing validates required fields after successful parsing
- WebSocket payload parsing includes structure validation before cache updates
- localStorage parsing includes fallback to default state on failure

<enforcement>
Claude Code MUST NOT skip or defer verification of these rules. All JSON.parse() operations on external data must be protected with try-catch blocks and appropriate error handling before code is accepted.
</enforcement>