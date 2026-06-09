# Standardize console-based logging for public API error handling and debugging: That Perform Json

These rules are ALWAYS ACTIVE for all public API functions and external system integrations, including data synchronization, Firebase operations, iframe exports, collaborative features, JSON parsing, JWT verification, and browser storage operations exposed through public API contracts.

### Rules

- **R-TPFJ-001** MUST: Wrap all JSON parsing, JWT verification, and data decoding operations in try-catch blocks and log parsing failures with console.error including the problematic input (sanitized if necessary).
- **R-TPFJ-002** SHOULD: All public API functions that interact with external systems (Firebase, fetch, WebSocket, browser storage) SHOULD include error logging with console.error in catch blocks.
- **R-TPFJ-003** SHOULD: Error log messages SHOULD include sufficient context (operation name, relevant IDs, error details) to support troubleshooting and correlation across distributed operations.
- **R-TPFJ-004** SHOULD: Distinguish between error severities using console.error for failures, console.warn for recoverable issues or deprecations, and console.info for debug information.
- **R-TPFJ-005** MAY: Production builds may suppress console.info debug logging for performance optimization via build-time configuration.
- **R-TPFJ-006** MAY: Structured logging libraries (e.g., Winston, Pino) may be used instead of console methods if they provide equivalent observability and are documented as exceptions.

### Verify

```bash
# Count console.error usage across TypeScript/TSX files
grep -r 'console\.error' --include='*.ts' --include='*.tsx' excalidraw-app/ packages/ | wc -l

# Find catch blocks without console logging in data modules
grep -r 'catch.*{' --include='*.ts' --include='*.tsx' excalidraw-app/data/ | grep -v 'console\.' | head -5

# Find JSON.parse operations without error logging
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -L 'console\.error\|console\.warn'
```

**Accept when:**
- All public API functions that interact with external systems (Firebase, fetch, WebSocket) include error logging with console.error in catch blocks
- JSON parsing operations in public APIs are wrapped in try-catch with error logging that includes context about the parsing failure
- No silent error swallowing detected in public API boundaries—all caught exceptions produce observable console output
- Error log messages include sufficient context (operation name, relevant IDs, error details) to support troubleshooting
- JWT verification and encryption/decryption operations in public APIs include try-catch blocks with descriptive error logging
- Browser storage operations (localStorage, IndexedDB) exposed through public APIs include error handling with console output

<enforcement>
Clause Code MUST NOT skip or defer verification of these rules. All public API functions must be reviewed for compliance with R-TPFJ-001 through R-TPFJ-006 before approval. Static analysis and code review are mandatory enforcement mechanisms.
</enforcement>