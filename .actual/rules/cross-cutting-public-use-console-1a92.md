# Standardize console-based logging for public API error handling and debugging: Public Use Console

These rules are ALWAYS ACTIVE for all public API functions and external system integrations, including data synchronization, Firebase operations, iframe exports, collaborative features, and any code that interacts with external clients, storage systems, or network services.

### Rules

- **R-CONSOLE-001** MUST: Public APIs that interact with external systems (Firebase, fetch, WebSocket, browser storage) MUST include error logging with `console.error` in catch blocks.
- **R-CONSOLE-002** SHOULD: Public APIs SHOULD use `console.warn` for recoverable errors, fallback scenarios, or deprecated behavior that does not prevent operation completion.
- **R-CONSOLE-003** MUST: JSON parsing operations in public APIs MUST be wrapped in try-catch blocks with error logging that includes context about the parsing failure.
- **R-CONSOLE-004** MUST: Error log messages MUST include sufficient context (operation name, relevant IDs, error details) to support troubleshooting and correlation across distributed operations.
- **R-CONSOLE-005** MUST: No silent error swallowing is permitted at public API boundaries—all caught exceptions MUST produce observable console output.
- **R-CONSOLE-006** SHOULD: Error messages SHOULD use template literals to construct descriptive messages: `console.error(\`Failed to ${operation}: ${error.message}\`, { context })`.
- **R-CONSOLE-007** SHOULD: Developers SHOULD distinguish between error severities: `console.error` for failures, `console.warn` for recoverable issues or deprecations, `console.info` for debug information.

### Verify

```bash
# Count console.error usage in public API files
grep -r 'console\.error' --include='*.ts' --include='*.tsx' excalidraw-app/ packages/ | wc -l

# Find catch blocks without console logging in data modules
grep -r 'catch.*{' --include='*.ts' --include='*.tsx' excalidraw-app/data/ | grep -v 'console\.' | head -5

# Find JSON.parse operations without error logging
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -L 'console\.error\|console\.warn'
```

**Accept when:**
- All public API functions that interact with external systems (Firebase, fetch, WebSocket) include error logging with `console.error` in catch blocks
- JSON parsing operations in public APIs are wrapped in try-catch with error logging that includes context about the parsing failure
- No silent error swallowing detected in public API boundaries—all caught exceptions produce observable console output
- Error log messages include sufficient context (operation name, relevant IDs, error details) to support troubleshooting
- Public APIs use `console.warn` for recoverable errors, fallback scenarios, or deprecated behavior
- Error messages follow the template literal pattern with descriptive operation context

<enforcement>
Claude Code MUST NOT skip or defer verification. All public API functions and external system integrations MUST be reviewed for compliance with these logging standards before approval.
</enforcement>