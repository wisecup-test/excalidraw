# Standardize console-based logging for public API error handling and debugging: Debug Development Information

These rules are ALWAYS ACTIVE for all public API functions and external system integrations including data synchronization, Firebase operations, iframe exports, collaborative features, and any code that interacts with external clients, browser storage, WebSocket connections, or third-party services.

### Rules

- **R-DEBUG-001** SHOULD: Debug and development information SHOULD be logged using console.info to distinguish informational messages from errors and warnings.
- **R-DEBUG-002** MUST: All public API functions that interact with external systems (Firebase, fetch, WebSocket) MUST include error logging with console.error in catch blocks.
- **R-DEBUG-003** MUST: JSON parsing operations in public APIs MUST be wrapped in try-catch with error logging that includes context about the parsing failure.
- **R-DEBUG-004** MUST: Error log messages MUST include sufficient context (operation name, relevant IDs, error details) to support troubleshooting.
- **R-DEBUG-005** SHOULD: Use template literals to construct descriptive error messages: console.error(\`Failed to ${operation}: ${error.message}\`, { context }).
- **R-DEBUG-006** SHOULD: Distinguish between error severities: console.error for failures, console.warn for recoverable issues or deprecations, console.info for debug information.
- **R-DEBUG-007** SHOULD: Include relevant identifiers in log messages (user IDs, document IDs, socket IDs) to enable correlation across distributed operations.

### Verify

```bash
# Count console.error usage in TypeScript/TSX files
grep -r 'console\.error' --include='*.ts' --include='*.tsx' excalidraw-app/ packages/ | wc -l

# Find catch blocks without console logging
grep -r 'catch.*{' --include='*.ts' --include='*.tsx' excalidraw-app/data/ | grep -v 'console\.' | head -5

# Find JSON.parse without error logging
grep -r 'JSON\.parse' --include='*.ts' --include='*.tsx' excalidraw-app/ | grep -L 'console\.error\|console\.warn'
```

**Accept when:**
- All public API functions that interact with external systems (Firebase, fetch, WebSocket) include error logging with console.error in catch blocks
- JSON parsing operations in public APIs are wrapped in try-catch with error logging that includes context about the parsing failure
- No silent error swallowing detected in public API boundaries—all caught exceptions produce observable console output
- Error log messages include sufficient context (operation name, relevant IDs, error details) to support troubleshooting
- Debug and development information uses console.info to distinguish from errors and warnings

<enforcement>
Claude Code MUST NOT skip or defer verification. All public API functions and external system integrations must be inspected for proper error logging before approval.
</enforcement>