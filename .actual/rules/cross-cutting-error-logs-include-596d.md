# Standardize console-based logging for public API error handling and debugging: Error Logs Include

These rules are ALWAYS ACTIVE for all public API functions and external system interactions (Firebase, fetch, WebSocket, JSON parsing, JWT verification, encryption/decryption, and browser storage operations) across the codebase.

### Rules

- **R-LOGS-001** MUST: Error logs MUST include contextual information such as the operation being performed, relevant identifiers, and the error object or message.
- **R-LOGS-002** MUST: All public API functions that interact with external systems (Firebase, fetch, WebSocket) MUST include error logging with console.error in catch blocks.
- **R-LOGS-003** MUST: JSON parsing operations in public APIs MUST be wrapped in try-catch with error logging that includes context about the parsing failure.
- **R-LOGS-004** MUST: No silent error swallowing is permitted at public API boundaries—all caught exceptions MUST produce observable console output.
- **R-LOGS-005** SHOULD: Use template literals to construct descriptive error messages: `console.error(\`Failed to ${operation}: ${error.message}\`, { context })`.
- **R-LOGS-006** SHOULD: Distinguish between error severities: console.error for failures, console.warn for recoverable issues or deprecations, console.info for debug information.
- **R-LOGS-007** SHOULD: Include relevant identifiers in log messages (user IDs, document IDs, socket IDs) to enable correlation across distributed operations.
- **R-LOGS-008** MAY: Production builds may suppress console.info debug logging for performance optimization.
- **R-LOGS-009** MAY: Structured logging libraries (e.g., Winston, Pino) may be used instead of console methods if they provide equivalent observability.

### Verify

```bash
# Count console.error usage in TypeScript files
grep -r 'console\.error' --include='*.ts' --include='*.tsx' excalidraw-app/ packages/ | wc -l

# Find catch blocks without console logging in data modules
grep -r 'catch.*{' --include='*.ts' --include='*.tsx' excalidraw-app/data/ | grep -v 'console\.' | head -5

# Find JSON.parse operations without error logging
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -L 'console\.error\|console\.warn'
```

**Accept when:**
- All public API functions that interact with external systems (Firebase, fetch, WebSocket) include error logging with console.error in catch blocks.
- JSON parsing operations in public APIs are wrapped in try-catch with error logging that includes context about the parsing failure.
- No silent error swallowing detected in public API boundaries—all caught exceptions produce observable console output.
- Error log messages include sufficient context (operation name, relevant IDs, error details) to support troubleshooting.
- Error messages do not expose sensitive information (tokens, passwords, PII) without sanitization.

<enforcement>
Claude Code MUST NOT skip or defer verification of these rules. All public API functions and external system interactions MUST be reviewed for compliance with R-LOGS-001 through R-LOGS-004 before code acceptance.
</enforcement>