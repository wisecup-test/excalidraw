# Validate JSON Input from External Sources Before Parsing in Primary Datastores: Json Parsing Errors

These rules are ALWAYS ACTIVE for all JSON.parse() operations on data from external sources including environment variables, HTTP responses, localStorage, WebSocket payloads, and URL parameters in datastore integration code.

### Rules

- **R-JSON-001** MUST: JSON parsing errors MUST NOT propagate uncaught to the application runtime; they MUST be caught and handled with appropriate fallback behavior.
- **R-JSON-002** MUST: All JSON.parse() calls on data from environment variables (import.meta.env.VITE_APP_FIREBASE_CONFIG) MUST be wrapped in try-catch blocks with error logging.
- **R-JSON-003** MUST: All JSON.parse() calls on HTTP response bodies from external APIs (fetch responses from BACKEND_V2_GET, Firebase Storage) MUST be wrapped in try-catch blocks with error logging.
- **R-JSON-004** MUST: All JSON.parse() calls on localStorage data (LSData from LocalData) MUST be wrapped in try-catch blocks with error logging and fallback to default state.
- **R-JSON-005** MUST: All JSON.parse() calls on decrypted WebSocket payloads (client-broadcast events) MUST be wrapped in try-catch blocks with error logging before updating cache layers or state.
- **R-JSON-006** MUST: All JSON.parse() calls on decoded data from URL parameters or share links MUST be wrapped in try-catch blocks with error logging.
- **R-JSON-007** MUST: Error handlers MUST log parsing failures with context using console.error() or console.warn() including the data source.
- **R-JSON-008** MUST: Error logging MUST NOT expose sensitive data (API keys, user content, encryption keys) in console output or log aggregation systems.
- **R-JSON-009** SHOULD: Consider implementing a centralized safe JSON parsing utility function to reduce code duplication and standardize error handling behavior.
- **R-JSON-010** MAY: JSON.parse() of hardcoded string literals in test files, trusted internal modules already validated, or third-party library internal JSON parsing may be exempted with explicit code comments justifying the exception.

### Verify

```bash
# Find unprotected JSON.parse() calls in datastore integration code
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/data excalidraw-app/collab | grep -v 'try' | wc -l

# Verify Firebase config parsing has try-catch protection
grep -r 'JSON\.parse.*import\.meta\.env' --include='*.ts' --include='*.tsx' -A 5 | grep -c 'catch'

# Verify WebSocket client-broadcast events have JSON.parse protection
grep -r 'socket\.on.*client-broadcast' --include='*.tsx' -A 20 | grep 'JSON\.parse' | wc -l

# Verify error logging exists around JSON.parse in firebase.ts
grep -r 'JSON\.parse' excalidraw-app/data/firebase.ts -A 3 | grep -E '(console\.(error|warn)|catch)' | wc -l

# Verify error logging exists around JSON.parse in LocalData.ts
grep -r 'JSON\.parse' excalidraw-app/data/LocalData.ts -A 3 | grep -E '(console\.(error|warn)|catch)' | wc -l
```

**Accept when:**
- All JSON.parse() operations on external data sources (environment variables, HTTP responses, localStorage, WebSocket payloads, URL parameters) are wrapped in try-catch blocks
- Error handlers log parsing failures with context using console.error() or console.warn()
- No unprotected JSON.parse() calls exist in datastore integration code (firebase.ts, LocalData.ts, Collab.tsx, index.ts)
- Error logging does not expose sensitive data such as API keys, user content, or encryption keys
- Fallback behavior is implemented for localStorage parsing failures to prevent application initialization failures
- WebSocket payload validation occurs before updating cache layers (FirebaseSceneVersionCache.cache.set, filesMap.set) or triggering state updates

<enforcement>
Claude Code MUST NOT skip or defer verification of JSON parsing error handling. All JSON.parse() calls on external data sources MUST be protected with try-catch blocks and appropriate error logging before code is accepted.
</enforcement>