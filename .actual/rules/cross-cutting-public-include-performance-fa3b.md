# Standardize console-based logging for public API error handling and debugging: Public Include Performance

These rules are ALWAYS ACTIVE for all public API functions and external system integrations, including data synchronization, Firebase operations, iframe exports, collaborative features, and any code that interacts with external clients, storage, or network systems.

### Rules

- **R-PUBAPI-001** MUST: All public API functions that interact with external systems (Firebase, fetch, WebSocket, browser storage) include error logging with `console.error` in catch blocks.
- **R-PUBAPI-002** MUST: JSON parsing operations in public APIs are wrapped in try-catch with error logging that includes context about the parsing failure.
- **R-PUBAPI-003** MUST: No silent error swallowing in public API boundaries—all caught exceptions produce observable console output.
- **R-PUBAPI-004** MUST: Error log messages include sufficient context (operation name, relevant IDs, error details) to support troubleshooting.
- **R-PUBAPI-005** SHOULD: Use template literals to construct descriptive error messages: `console.error(\`Failed to ${operation}: ${error.message}\`, { context })`.
- **R-PUBAPI-006** SHOULD: Distinguish between error severities: `console.error` for failures, `console.warn` for recoverable issues or deprecations, `console.info` for debug information.
- **R-PUBAPI-007** MAY: Public APIs MAY include performance logging using `console.info` for operations that track timing, frame budgets, or resource usage.
- **R-PUBAPI-008** SHOULD: Include relevant identifiers in log messages (user IDs, document IDs, socket IDs) to enable correlation across distributed operations.
- **R-PUBAPI-009** SHOULD: Implement log sanitization for known sensitive fields (tokens, passwords, PII) to prevent exposure of authentication credentials or user data.

### Verify

```bash
# Count console.error usage in public API files
grep -r 'console\.error' --include='*.ts' --include='*.tsx' excalidraw-app/ packages/ | wc -l

# Find catch blocks without console logging in data APIs
grep -r 'catch.*{' --include='*.ts' --include='*.tsx' excalidraw-app/data/ | grep -v 'console\.' | head -5

# Find JSON.parse operations without error logging
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -L 'console\.error\|console\.warn'
```

**Accept when:**
- All public API functions that interact with external systems (Firebase, fetch, WebSocket) include error logging with `console.error` in catch blocks.
- JSON parsing operations in public APIs are wrapped in try-catch with error logging that includes context about the parsing failure.
- No silent error swallowing detected in public API boundaries—all caught exceptions produce observable console output.
- Error log messages include sufficient context (operation name, relevant IDs, error details) to support troubleshooting.
- Sensitive data (tokens, passwords, PII) is not exposed in error log messages.

<enforcement>
Claude Code MUST NOT skip or defer verification. All public API functions must be reviewed for compliance with R-PUBAPI-001 through R-PUBAPI-009. Code review rejection is required for public API functions lacking error logging in external system interactions. CI pipeline warnings must flag catch blocks without observable error handling.
</enforcement>